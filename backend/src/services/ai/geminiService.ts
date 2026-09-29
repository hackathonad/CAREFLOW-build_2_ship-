import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/index.js';
import {
  AICommandResponse,
  AICommandResponseSchema,
  ALLOWED_INTENTS,
} from '../../types/index.js';

const SYSTEM_PROMPT = `You are CareFlow AI, an intelligent hospital operations automation parser.
Your role is STRICTLY to analyze operational requests and extract structured operational intents and entities.
You NEVER perform clinical diagnosis, treatment recommendations, or medical advice.
You NEVER execute arbitrary commands or database mutations.

You must classify the user message into exactly ONE of the following allowed intents:
- patient_admission
- bed_request
- doctor_allocation
- inventory_replenishment
- ambulance_coordination
- appointment_scheduling
- task_creation
- resource_request
- operational_status
- unknown

You must output a VALID JSON object adhering to this schema:
{
  "intent": "<one of the allowed intents>",
  "confidence": <number between 0 and 1>,
  "entities": {
    "patientId": "<string or null>",
    "patientName": "<string or null>",
    "department": "<string or null>",
    "wardCategory": "<icu|premium|semi_premium|general|emergency|observation or null>",
    "doctorName": "<string or null>",
    "itemName": "<string or null>",
    "quantity": <number or null>,
    "destination": "<string or null>",
    "urgency": "<normal|high|critical or null>",
    "date": "<YYYY-MM-DD or null>",
    "time": "<string or null>",
    "taskTitle": "<string or null>"
  },
  "missingInformation": ["<list of any required parameters missing to safely execute>"],
  "requiredActions": ["<list of proposed deterministic backend actions>"],
  "priority": "<low|normal|high|critical>",
  "explanation": "<concise explanation of understanding>"
}

VALIDATION RULES:
1. For 'patient_admission', patientName and department are mandatory. If department is omitted, include "Hospital department/specialty is missing" in missingInformation.
2. For 'appointment_scheduling', patientName, department, and time/date are required. If time or department is omitted, list it in missingInformation.
3. For 'inventory_replenishment', itemName is required.
4. For read-only stock inspection or querying items below minimum/safety stock, classify as 'operational_status' (NOT inventory_replenishment) and set missingInformation to empty array [].
5. For 'ambulance_coordination', destination or pickup is required.
6. If the request is ambiguous or unknown, set intent to 'unknown' with confidence < 0.5.
Respond with JSON only. No markdown formatting.`;

export class GeminiService {
  private static client: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!this.client && config.hasGemini) {
      try {
        this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (e) {
        console.warn('Failed to initialize GoogleGenAI client:', e);
      }
    }
    return this.client;
  }

  public static async parseCommand(message: string): Promise<AICommandResponse | null> {
    const ai = this.getClient();
    if (!ai) return null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `${SYSTEM_PROMPT}\n\nUSER REQUEST: "${message}"`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      let jsonStr = rawText;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(jsonStr);
      const validated = AICommandResponseSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
      console.warn(`Gemini Zod validation failed:`, validated.error);
    } catch (err: any) {
      console.warn(`Gemini model call failed (${err?.status || err?.message || 'error'}), initiating fallback.`);
    }

    return null;
  }

  public static deterministicNLPParser(message: string): AICommandResponse {
    const lower = message.toLowerCase().trim();

    // 0. Operational Status / Inventory Audit (Scenario 6)
    if (
      lower.includes('below minimum') ||
      lower.includes('below min') ||
      lower.includes('low stock') ||
      lower.includes('out of stock') ||
      lower.includes('check which inventory') ||
      lower.includes('check inventory') ||
      lower.includes('inventory status') ||
      lower.includes('bed status') ||
      lower.includes('operational status') ||
      lower.includes('hospital status')
    ) {
      return {
        intent: 'operational_status',
        confidence: 0.95,
        entities: {
          taskTitle: 'Audit low-stock inventory items',
        },
        missingInformation: [],
        requiredActions: ['query_low_stock_inventory', 'evaluate_reorder_thresholds', 'generate_status_report'],
        priority: 'normal',
        explanation: 'Auditing inventory catalog for all items currently below safety reorder threshold.',
      };
    }

    // 1. Patient Admission
    if (lower.includes('admit') || lower.includes('admission')) {
      const nameMatch = message.match(/(?:admit\s+(?:patient\s+)?)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const patientName = nameMatch ? nameMatch[1].trim() : null;

      const deptMatch = message.match(/(?:to\s+|in\s+)([A-Za-z\s]+)(?:department|ward)?/i);
      let department = deptMatch ? deptMatch[1].replace(/ward|department/gi, '').trim() : null;

      // Check known departments
      const depts = ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'ICU', 'Nephrology', 'Radiology', 'Oncology'];
      for (const d of depts) {
        if (lower.includes(d.toLowerCase())) {
          department = d;
          break;
        }
      }

      const missing: string[] = [];
      if (!patientName) missing.push('Patient name is required');
      if (!department) missing.push('Department or clinical specialty is required');

      let wardCategory = 'general';
      if (lower.includes('icu')) wardCategory = 'icu';
      else if (lower.includes('premium') || lower.includes('suite')) wardCategory = 'premium';
      else if (lower.includes('semi')) wardCategory = 'semi_premium';
      else if (lower.includes('emergency')) wardCategory = 'emergency';

      return {
        intent: 'patient_admission',
        confidence: 0.95,
        entities: {
          patientName,
          department,
          wardCategory,
        },
        missingInformation: missing,
        requiredActions: ['check_bed_availability', 'reserve_bed', 'assign_duty_doctor', 'create_admission_tasks', 'notify_nursing_station'],
        priority: lower.includes('emergency') || lower.includes('critical') ? 'critical' : 'normal',
        explanation: `Parsed admission request for ${patientName || 'patient'} to ${department || 'unspecified department'}.`,
      };
    }

    // 2. Bed Request
    if (lower.includes('bed') || lower.includes('ward')) {
      const patMatch =
        message.match(/(?:for\s+(?:patient\s+)?|patient\s+)([A-Za-z0-9-]+)/i) ||
        message.match(/\b([A-Z]\d+|PAT-\d+)\b/i);
      const patientRef = patMatch ? patMatch[1].trim() : 'Inpatient';

      let wardCategory = 'general';
      if (lower.includes('icu')) wardCategory = 'icu';
      else if (lower.includes('premium')) wardCategory = 'premium';
      else if (lower.includes('emergency')) wardCategory = 'emergency';

      return {
        intent: 'bed_request',
        confidence: 0.92,
        entities: {
          patientId: patientRef?.startsWith('P') ? patientRef : null,
          patientName: !patientRef?.startsWith('P') ? patientRef : null,
          wardCategory,
        },
        missingInformation: [],
        requiredActions: ['query_bed_inventory', 'evaluate_sanitation_status', 'lock_bed_slot'],
        priority: wardCategory === 'icu' || wardCategory === 'emergency' ? 'high' : 'normal',
        explanation: `Locating available ${wardCategory.toUpperCase()} bed for ${patientRef}.`,
      };
    }

    // 3. Appointment / Checkup Scheduling
    if (lower.includes('schedule') || lower.includes('appointment') || lower.includes('checkup')) {
      const nameMatch = message.match(/(?:for\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const patientName = nameMatch ? nameMatch[1].trim() : null;

      let department: string | null = null;
      const depts = ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'Nephrology', 'Radiology', 'Oncology'];
      for (const d of depts) {
        if (lower.includes(d.toLowerCase())) {
          department = d;
          break;
        }
      }

      const missing: string[] = [];
      if (!department) missing.push('Department or clinical specialty is required to match physician schedule');
      const timeMatch = message.match(/(?:at\s+)(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      const time = timeMatch ? timeMatch[1] : null;
      if (!time && !lower.includes('tomorrow') && !lower.includes('today')) {
        missing.push('Preferred appointment date and time slot required');
      }

      return {
        intent: 'appointment_scheduling',
        confidence: 0.91,
        entities: {
          patientName,
          department,
          time,
        },
        missingInformation: missing,
        requiredActions: ['check_doctor_calendar', 'confirm_time_slot', 'generate_appointment_slip', 'create_calendar_entry'],
        priority: 'normal',
        explanation: `Appointment scheduling for ${patientName || 'patient'}. ${missing.length > 0 ? 'Awaiting missing scheduling parameters.' : 'All scheduling parameters verified.'}`,
      };
    }

    // 4. Inventory Replenishment
    if (lower.includes('inventory') || lower.includes('stock') || lower.includes('restock') || lower.includes('replenish') || lower.includes('oxygen') || lower.includes('suture')) {
      let itemName: string | null = null;
      if (lower.includes('oxygen')) itemName = 'Medical Oxygen Cylinders (47L)';
      else if (lower.includes('suture')) itemName = 'Emergency Suture Kit 3-0 Silk';
      else if (lower.includes('glove')) itemName = 'Nitrile Examination Gloves (M)';
      else if (lower.includes('saline') || lower.includes('iv')) itemName = 'Normal Saline IV (0.9% 500ml)';
      else if (lower.includes('defibrillator')) itemName = 'Defibrillator Electrode Pads (Adult)';

      const qtyMatch = message.match(/(\d+)\s*(?:units|cylinders|boxes|kits|packs)?/i);
      const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

      return {
        intent: 'inventory_replenishment',
        confidence: 0.94,
        entities: {
          itemName,
          quantity,
        },
        missingInformation: itemName ? [] : ['Inventory item name must be specified or review low-stock list'],
        requiredActions: ['audit_stock_threshold', 'generate_supplier_purchase_request', 'route_for_financial_approval', 'create_storekeeper_task'],
        priority: lower.includes('critical') || lower.includes('emergency') || lower.includes('oxygen') ? 'critical' : 'high',
        explanation: itemName
          ? `Initiating replenishment workflow for ${itemName} (Quantity: ${quantity || 'Standard Restock Batch'}).`
          : 'Querying catalog items below safety minimum threshold.',
      };
    }

    // 5. Ambulance Coordination
    if (lower.includes('ambulance') || lower.includes('dispatch') || lower.includes('paramedic')) {
      const destMatch = message.match(/(?:to\s+|at\s+)([A-Za-z0-9\s,]+)(?:\.|$)/i);
      const destination = destMatch ? destMatch[1].trim() : 'Apex Metro Emergency Bay';

      return {
        intent: 'ambulance_coordination',
        confidence: 0.96,
        entities: {
          destination,
          urgency: lower.includes('emergency') || lower.includes('critical') ? 'critical' : 'high',
        },
        missingInformation: [],
        requiredActions: ['locate_nearest_idle_ambulance', 'assign_navigation_route', 'alert_triage_bay', 'dispatch_vehicle'],
        priority: 'critical',
        explanation: `Coordinating emergency ambulance dispatch to ${destination}.`,
      };
    }

    // 6. Task Creation
    if (lower.includes('task') || lower.includes('assign') || lower.includes('manager')) {
      let department = 'General Operations';
      if (lower.includes('icu')) department = 'Intensive Care Unit';
      else if (lower.includes('emergency')) department = 'Emergency & Trauma';
      else if (lower.includes('billing')) department = 'Billing & Administration';

      const rawTitle = message
        .replace(/^create\s+(?:a\s+)?task\s+(?:for\s+)?/i, '')
        .replace(/\.$/, '')
        .trim();
      const taskTitle = rawTitle.startsWith('the ')
        ? `Operational duty for ${rawTitle}`
        : rawTitle || 'Operational assignment';

      return {
        intent: 'task_creation',
        confidence: 0.9,
        entities: {
          department,
          taskTitle,
        },
        missingInformation: [],
        requiredActions: ['assign_staff_member', 'set_sla_deadline', 'create_task_ticket'],
        priority: lower.includes('urgent') || lower.includes('icu') ? 'high' : 'normal',
        explanation: `Creating operational task for ${department}.`,
      };
    }

    // 7. Doctor Allocation
    if (lower.includes('doctor') || lower.includes('physician') || lower.includes('specialist')) {
      let department = 'Cardiology';
      if (lower.includes('emergency')) department = 'Emergency & Trauma';
      else if (lower.includes('neurology')) department = 'Neurology';

      return {
        intent: 'doctor_allocation',
        confidence: 0.88,
        entities: {
          department,
        },
        missingInformation: [],
        requiredActions: ['evaluate_duty_roster', 'check_active_caseload', 'assign_on_call_doctor'],
        priority: 'normal',
        explanation: `Allocating on-duty specialist for ${department}.`,
      };
    }

    // Default Unknown
    return {
      intent: 'unknown',
      confidence: 0.35,
      entities: {},
      missingInformation: ['Request not recognized as a supported hospital operational procedure'],
      requiredActions: [],
      priority: 'low',
      explanation: 'Could not map request to an authorized operational automation workflow.',
    };
  }
}
