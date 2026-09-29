import { TaskService } from '../tasks/taskService.js';
import { NotificationService } from './notificationService.js';
import { Task, TaskPriority } from '../../types/index.js';

export class TaskOrchestrator {
  public static async orchestrateAdmissionTasks(params: {
    patientName: string;
    bedNumber: string;
    wardName: string;
    doctorName: string;
    department: string;
  }): Promise<Task[]> {
    const tasks: Task[] = [];

    // 1. Bed Preparation & Sanitation Task
    const t1 = await TaskService.create({
      title: `Sanitize & Prepare Bed ${params.bedNumber} (${params.wardName})`,
      description: `Intake preparation for incoming patient ${params.patientName}. Verify bedding, oxygen point, and vitals monitor.`,
      department: params.department,
      assigned_employee: 'Floor Nursing Staff',
      priority: 'high',
      source_workflow: 'Admission Automation',
    });
    tasks.push(t1);

    // 2. Doctor Clinical Intake Review Task
    const t2 = await TaskService.create({
      title: `Conduct Initial Admission Review: ${params.patientName}`,
      description: `Assigned physician ${params.doctorName} to conduct bedside assessment and verify admission orders.`,
      department: params.department,
      assigned_employee: params.doctorName,
      priority: 'high',
      source_workflow: 'Admission Automation',
    });
    tasks.push(t2);

    // 3. Admission Documentation Task
    const t3 = await TaskService.create({
      title: `Complete Admission Files & Consent: ${params.patientName}`,
      description: `Verify emergency contacts, insurance documentation, and issue patient ID wristband.`,
      department: 'Billing & Administration',
      assigned_employee: 'Admissions Desk Clerk',
      priority: 'medium',
      source_workflow: 'Admission Automation',
    });
    tasks.push(t3);

    // Notify Nursing Station
    await NotificationService.create(
      `New Admission: ${params.patientName}`,
      `Allocated Bed ${params.bedNumber} in ${params.wardName} under ${params.doctorName}. Intake tasks generated.`,
      'info',
      params.department
    );

    return tasks;
  }
}
