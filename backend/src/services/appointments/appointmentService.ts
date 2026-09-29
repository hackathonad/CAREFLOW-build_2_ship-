import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Appointment, AppointmentStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';
import { DoctorService } from '../doctors/doctorService.js';
import { TaskService } from '../tasks/taskService.js';

export class AppointmentService {
  public static async getAll(filter?: {
    status?: AppointmentStatus | 'all';
    date?: string;
  }): Promise<Appointment[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('appointments').select('*').order('date', { ascending: true });
        if (filter?.status && filter.status !== 'all') query = query.eq('status', filter.status);
        if (filter?.date) query = query.eq('date', filter.date);

        const { data, error } = await query;
        if (!error && data) return data as Appointment[];
      } catch (err) {
        console.warn('Supabase getAppointments fallback:', err);
      }
    }

    let result = [...mockStore.appointments];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter((a) => a.status === filter.status);
    }
    if (filter?.date) {
      result = result.filter((a) => a.date === filter.date);
    }
    return result;
  }

  public static async create(data: {
    patient_name: string;
    doctor_name?: string;
    department?: string;
    date?: string;
    time?: string;
    type?: string;
    notes?: string;
  }): Promise<Appointment> {
    const department = data.department || 'Cardiology';
    let doctorName = data.doctor_name;
    if (!doctorName) {
      const doc = await DoctorService.findBestDoctor(department);
      doctorName = doc?.name || 'Dr. Rajesh Sen';
    }

    const newApp: Appointment = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patient_name: data.patient_name,
      doctor_name: doctorName,
      department,
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '10:00 AM',
      type: data.type || 'Consultation',
      status: 'upcoming',
      notes: data.notes || 'Automated appointment booking via CareFlow AI',
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: dbData, error } = await supabase.from('appointments').insert(newApp).select().single();
        if (!error && dbData) {
          await AuditService.log({
            action: 'appointment_scheduled',
            source: 'automation',
            entity_type: 'appointment',
            entity_id: dbData.id,
            details: { patient: newApp.patient_name, doctor: newApp.doctor_name, date: newApp.date },
          });
          return dbData as Appointment;
        }
      } catch (err) {
        console.warn('Supabase appointment create fallback:', err);
      }
    }

    mockStore.appointments.push(newApp);

    await TaskService.create({
      title: `Prepare Case Notes: ${newApp.patient_name}`,
      description: `Appointment scheduled with ${newApp.doctor_name} in ${newApp.department} on ${newApp.date} at ${newApp.time}.`,
      department: newApp.department,
      assigned_employee: 'OPD Desk Coordinator',
      priority: 'medium',
      source_workflow: 'Appointment Automation',
    });

    await AuditService.log({
      action: 'appointment_scheduled',
      source: 'automation',
      entity_type: 'appointment',
      entity_id: newApp.id,
      details: { patient: newApp.patient_name, doctor: newApp.doctor_name, date: newApp.date },
    });

    return newApp;
  }
}
