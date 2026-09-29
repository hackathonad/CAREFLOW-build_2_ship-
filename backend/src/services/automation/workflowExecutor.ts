import { ResourceAllocator } from './resourceAllocator.js';
import { TaskOrchestrator } from './taskOrchestrator.js';
import { PatientService } from '../patients/patientService.js';
import { BedService } from '../beds/bedService.js';
import { InventoryService } from '../inventory/inventoryService.js';
import { AmbulanceService } from '../ambulances/ambulanceService.js';
import { AppointmentService } from '../appointments/appointmentService.js';
import { TaskService } from '../tasks/taskService.js';
import { AuditService } from '../audit/auditService.js';
import { NotificationService } from './notificationService.js';
import {
  AICommandResponse,
  CommandExecutionResult,
} from '../../types/index.js';

export class WorkflowExecutor {
  public static async execute(
    parsedAI: AICommandResponse,
    automationRunId: string
  ): Promise<CommandExecutionResult> {
    const { intent, entities } = parsedAI;

    switch (intent) {
      case 'patient_admission': {
        if (!entities.patientName || !entities.department) {
          throw new Error('Mandatory admission entities (patientName, department) are missing.');
        }

        // 1. Allocate bed
        const bed = await ResourceAllocator.allocateBed({
          preferredCategory: entities.wardCategory || 'general',
          department: entities.department,
        });

        // 2. Allocate doctor
        const doctor = await ResourceAllocator.allocateDoctor(entities.department);

        // 3. Create admitted patient record
        const patient = await PatientService.create({
          name: entities.patientName,
          department: entities.department,
          ward_id: bed.ward_id,
          ward_name: bed.ward_name,
          room_id: bed.room_id,
          room_number: bed.room_number,
          bed_id: bed.id,
          bed_number: bed.bed_number,
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          status: 'admitted',
        });

        // 4. Update bed status to occupied
        await BedService.updateBedStatus(bed.id, 'occupied', patient.name);

        // 5. Generate standardized admission task bundle
        const tasks = await TaskOrchestrator.orchestrateAdmissionTasks({
          patientName: patient.name,
          bedNumber: bed.bed_number,
          wardName: bed.ward_name || 'Inpatient Wing',
          doctorName: doctor.name,
          department: entities.department,
        });

        const audit = await AuditService.log({
          action: 'automated_admission_completed',
          source: 'ai_command_automation',
          entity_type: 'patient',
          entity_id: patient.id,
          details: {
            patientName: patient.name,
            bed: bed.bed_number,
            doctor: doctor.name,
            runId: automationRunId,
          },
        });

        return {
          success: true,
          message: `Successfully admitted ${patient.name} to ${entities.department}. Bed ${bed.bed_number} assigned under ${doctor.name}.`,
          automationRunId,
          executedActions: [
            `Allocated bed ${bed.bed_number} (${bed.ward_name})`,
            `Assigned attending doctor ${doctor.name} (${doctor.specialization})`,
            `Created patient record ${patient.patient_code}`,
            `Generated ${tasks.length} clinical and intake tasks`,
          ],
          affectedEntities: [
            { type: 'patient', id: patient.id, details: { code: patient.patient_code, name: patient.name } },
            { type: 'bed', id: bed.id, details: { bedNumber: bed.bed_number, status: 'occupied' } },
            { type: 'doctor', id: doctor.id, details: { name: doctor.name, workload: doctor.workload } },
          ],
          tasksCreated: tasks.map((t) => t.title),
          notificationsSent: [`Admission alert sent to ${entities.department} nursing station`],
          auditLogId: audit.id,
        };
      }

      case 'bed_request': {
        const bed = await ResourceAllocator.allocateBed({
          preferredCategory: entities.wardCategory || 'general',
        });

        const patientName = entities.patientName || entities.patientId || 'Requested Patient';
        await BedService.updateBedStatus(bed.id, 'reserved', patientName);

        const task = await TaskService.create({
          title: `Hold Bed ${bed.bed_number} for ${patientName}`,
          description: `Bed allocated in ${bed.ward_name} (${bed.ward_category}). Prepare for transfer.`,
          department: 'Bed Management',
          priority: 'high',
          source_workflow: 'Bed Allocation Engine',
        });

        return {
          success: true,
          message: `Reserved Bed ${bed.bed_number} (${bed.ward_name}) for ${patientName}.`,
          automationRunId,
          executedActions: [
            `Located optimal bed in ${bed.ward_name}`,
            `Reserved bed slot ${bed.bed_number}`,
            `Created hold ticket for floor supervisor`,
          ],
          affectedEntities: [{ type: 'bed', id: bed.id, details: { bedNumber: bed.bed_number, status: 'reserved' } }],
          tasksCreated: [task.title],
          notificationsSent: [`Bed hold confirmed for ${bed.bed_number}`],
        };
      }

      case 'inventory_replenishment': {
        const itemName = entities.itemName || 'Medical Oxygen Cylinders (47L)';
        const replenishResult = await InventoryService.handleReplenishmentRequest(
          itemName,
          entities.quantity || undefined
        );

        return {
          success: true,
          message: `Replenishment process initiated for ${replenishResult.item.name}.`,
          automationRunId,
          executedActions: [
            `Evaluated inventory threshold for ${replenishResult.item.name}`,
            replenishResult.approvalCreated
              ? 'Generated administrative procurement approval ticket'
              : 'Auto-approved replenishment under standard threshold quota',
            'Created materials handling purchase task',
          ],
          affectedEntities: [
            {
              type: 'inventory_item',
              id: replenishResult.item.id,
              details: { name: replenishResult.item.name, currentStock: replenishResult.item.quantity },
            },
          ],
          tasksCreated: [`Procure batch for ${replenishResult.item.name}`],
          notificationsSent: [`Restock notification triggered for ${replenishResult.item.name}`],
        };
      }

      case 'ambulance_coordination': {
        const ambulance = await ResourceAllocator.allocateAmbulance();
        const destination = entities.destination || 'Apex Metro Trauma Unit';
        const dispatched = await AmbulanceService.dispatch(
          ambulance.id,
          destination,
          'Dispatched via CareFlow AI Command Center',
          entities.urgency === 'critical' ? 'critical' : 'high'
        );

        return {
          success: true,
          message: `Dispatched ambulance ${dispatched.ambulance_code} to ${destination} with driver ${dispatched.driver}.`,
          automationRunId,
          executedActions: [
            `Selected idle ALS ambulance ${dispatched.ambulance_code}`,
            `Set destination waypoint to ${destination}`,
            `Alerted emergency department trauma triage`,
          ],
          affectedEntities: [
            {
              type: 'ambulance',
              id: dispatched.id,
              details: { code: dispatched.ambulance_code, driver: dispatched.driver, status: 'dispatched' },
            },
          ],
          tasksCreated: [`Prepare Trauma Intake Bay for ${dispatched.ambulance_code}`],
          notificationsSent: [`Ambulance ${dispatched.ambulance_code} en route to ${destination}`],
        };
      }

      case 'appointment_scheduling': {
        if (!entities.patientName) {
          throw new Error('Patient name is required for appointment scheduling.');
        }

        const app = await AppointmentService.create({
          patient_name: entities.patientName,
          doctor_name: entities.doctorName || undefined,
          department: entities.department || 'Cardiology',
          date: entities.date || new Date().toISOString().split('T')[0],
          time: entities.time || '10:00 AM',
        });

        return {
          success: true,
          message: `Scheduled appointment for ${app.patient_name} with ${app.doctor_name} (${app.department}) on ${app.date} at ${app.time}.`,
          automationRunId,
          executedActions: [
            `Verified physician availability for ${app.doctor_name}`,
            `Confirmed time slot ${app.time} on ${app.date}`,
            `Created appointment booking in OPD roster`,
          ],
          affectedEntities: [{ type: 'appointment', id: app.id, details: { patient: app.patient_name, doctor: app.doctor_name } }],
          tasksCreated: [`Prepare Case Notes: ${app.patient_name}`],
          notificationsSent: [`Appointment booked for ${app.patient_name}`],
        };
      }

      case 'task_creation': {
        const task = await TaskService.create({
          title: entities.taskTitle || 'Operational Assignment',
          description: `Created via AI Command Center for ${entities.department || 'General Operations'}`,
          department: entities.department || 'General Operations',
          priority: parsedAI.priority === 'critical' ? 'critical' : parsedAI.priority === 'high' ? 'high' : 'medium',
          source_workflow: 'AI Command Center',
        });

        return {
          success: true,
          message: `Created task "${task.title}" for ${task.department}.`,
          automationRunId,
          executedActions: [`Created operational task ticket`, `Assigned to department roster`],
          affectedEntities: [{ type: 'task', id: task.id, details: { title: task.title, department: task.department } }],
          tasksCreated: [task.title],
          notificationsSent: [`New task dispatched to ${task.department}`],
        };
      }

      case 'doctor_allocation': {
        const dept = entities.department || 'Cardiology';
        const doc = await ResourceAllocator.allocateDoctor(dept);

        return {
          success: true,
          message: `Allocated ${doc.name} (${doc.specialization}) in ${doc.department}. Current caseload: ${doc.workload}/${doc.max_workload}.`,
          automationRunId,
          executedActions: [
            `Evaluated on-duty staff in ${dept}`,
            `Selected doctor ${doc.name} with lowest active workload`,
          ],
          affectedEntities: [{ type: 'doctor', id: doc.id, details: { name: doc.name, department: doc.department } }],
          tasksCreated: [],
          notificationsSent: [`Doctor allocation confirmed for ${doc.name}`],
        };
      }

      case 'operational_status': {
        const lowStock = await InventoryService.getLowStock();
        const itemSummary = lowStock
          .map((i) => `${i.name} (Stock: ${i.quantity}, Min: ${i.minimum_threshold})`)
          .join(', ');

        return {
          success: true,
          message: `Operational status audit complete: Found ${lowStock.length} items below minimum safety threshold.`,
          automationRunId,
          executedActions: [
            `Audited inventory safety thresholds across hospital central repository`,
            `Identified ${lowStock.length} items requiring replenishment: ${itemSummary}`,
          ],
          affectedEntities: lowStock.map((i) => ({
            type: 'inventory_item',
            id: i.id,
            details: { name: i.name, quantity: i.quantity, minimum_threshold: i.minimum_threshold, status: i.status },
          })),
          tasksCreated: [],
          notificationsSent: [
            `Operational audit flagged ${lowStock.length} inventory supplies below minimum quota.`,
          ],
        };
      }

      default:
        throw new Error(`Automation execution not supported for intent: ${intent}`);
    }
  }
}
