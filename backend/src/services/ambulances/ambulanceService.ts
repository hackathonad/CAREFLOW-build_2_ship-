import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Ambulance, AmbulanceStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';
import { TaskService } from '../tasks/taskService.js';
import { NotificationService } from '../automation/notificationService.js';

export class AmbulanceService {
  public static async getAll(status?: AmbulanceStatus): Promise<Ambulance[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('ambulances').select('*').order('ambulance_code');
        if (status) query = query.eq('vehicle_status', status);
        const { data, error } = await query;
        if (!error && data) return data as Ambulance[];
      } catch (err) {
        console.warn('Supabase getAmbulances fallback:', err);
      }
    }

    if (status) {
      return mockStore.ambulances.filter((a) => a.vehicle_status === status);
    }
    return mockStore.ambulances;
  }

  public static async getById(id: string): Promise<Ambulance | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('ambulances').select('*').eq('id', id).single();
        if (!error && data) return data as Ambulance;
      } catch (err) {
        console.warn('Supabase getAmbulanceById fallback:', err);
      }
    }
    return mockStore.ambulances.find((a) => a.id === id || a.ambulance_code === id) || null;
  }

  public static async findAvailable(): Promise<Ambulance | null> {
    const available = await this.getAll('available');
    return available[0] || null;
  }

  public static async dispatch(
    ambulanceId: string,
    destination: string,
    requestDescription: string,
    urgency: 'normal' | 'high' | 'critical' = 'high'
  ): Promise<Ambulance> {
    const amb = await this.getById(ambulanceId);
    if (!amb) throw new Error(`Ambulance ${ambulanceId} not found`);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('ambulances')
          .update({
            vehicle_status: 'dispatched',
            destination,
            current_request: requestDescription,
            updated_at: new Date().toISOString(),
          })
          .eq('id', amb.id);
      } catch (err) {
        console.warn('Supabase dispatch fallback:', err);
      }
    }

    const stored = mockStore.ambulances.find((a) => a.id === amb.id);
    if (stored) {
      stored.vehicle_status = 'dispatched';
      stored.destination = destination;
      stored.current_request = requestDescription;
      stored.updated_at = new Date().toISOString();
    }

    // Create trauma bay prep task
    await TaskService.create({
      title: `Prepare Trauma Intake Bay for ${amb.ambulance_code}`,
      description: `Ambulance dispatched to ${destination}. Request: ${requestDescription}. Prepare rapid transfer gurney and vitals monitor.`,
      department: 'Emergency & Trauma',
      assigned_employee: 'Triage Nurse On-Duty',
      priority: urgency === 'critical' ? 'critical' : 'high',
      source_workflow: 'Ambulance Dispatch Engine',
    });

    await NotificationService.create(
      `Ambulance ${amb.ambulance_code} Dispatched`,
      `En route to ${destination}. Driver: ${amb.driver}. Urgency: ${urgency.toUpperCase()}.`,
      urgency === 'critical' ? 'urgent' : 'warning',
      'Emergency & Trauma'
    );

    await AuditService.log({
      action: 'ambulance_dispatched',
      source: 'automation',
      entity_type: 'ambulance',
      entity_id: amb.id,
      details: { ambulance_code: amb.ambulance_code, destination, requestDescription, urgency },
    });

    return stored || amb;
  }
}
