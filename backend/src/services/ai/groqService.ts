import Groq from 'groq-sdk';
import { config } from '../../config/index.js';
import {
  AICommandResponse,
  AICommandResponseSchema,
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

export class GroqService {
  private static client: Groq | null = null;

  private static getClient(): Groq | null {
    if (!this.client && config.hasGroq) {
      try {
        this.client = new Groq({ apiKey: config.groqApiKey });
      } catch (e) {
        console.warn('Failed to initialize Groq client:', e);
      }
    }
    return this.client;
  }

  public static async parseCommand(message: string): Promise<AICommandResponse | null> {
    const groq = this.getClient();
    if (!groq) return null;

    // Supported models on this endpoint
    const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

    for (const model of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          model,
          response_format: { type: 'json_object' },
          temperature: 0.1,
        });

        const rawText = completion.choices[0]?.message?.content?.trim() || '';
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
        console.warn(`Groq Zod validation failed for model ${model}:`, validated.error);
      } catch (err: any) {
        console.warn(`Groq model ${model} call failed:`, err?.message || err);
      }
    }

    return null;
  }
}
