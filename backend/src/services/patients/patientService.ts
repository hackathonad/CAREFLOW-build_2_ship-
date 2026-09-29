import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Patient, PatientStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';
import { BedService } from '../beds/bedService.js';
import { DoctorService } from '../doctors/doctorService.js';

export class PatientService {
  public static async getAll(filter?: {
    status?: PatientStatus | 'all';
    department?: string;
    search?: string;
  }): Promise<Patient[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('patients').select('*, wards(name), rooms(room_number), beds(bed_number), doctors(name)');
        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        if (filter?.department) {
          query = query.ilike('department', `%${filter.department}%`);
        }
        if (filter?.search) {
          query = query.or(`name.ilike.%${filter.search}%,patient_code.ilike.%${filter.search}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((p: any) => ({
            ...p,
            ward_name: p.wards?.name,
            room_number: p.rooms?.room_number,
            bed_number: p.beds?.bed_number,
            doctor_name: p.doctors?.name,
          })) as Patient[];
        }
      } catch (err) {
        console.warn('Supabase getPatients fallback:', err);
      }
    }

    let result = [...mockStore.patients];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter((p) => p.status === filter.status);
    }
    if (filter?.department) {
      result = result.filter((p) =>
        p.department?.toLowerCase().includes(filter.department!.toLowerCase())
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.patient_code.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public static async getById(id: string): Promise<Patient | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*, wards(name), rooms(room_number), beds(bed_number), doctors(name)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            ...data,
            ward_name: data.wards?.name,
            room_number: data.rooms?.room_number,
            bed_number: data.beds?.bed_number,
            doctor_name: data.doctors?.name,
          } as Patient;
        }
      } catch (err) {
        console.warn('Supabase getPatientById fallback:', err);
      }
    }

    return (
      mockStore.patients.find(
        (p) => p.id === id || p.patient_code.toLowerCase() === id.toLowerCase()
      ) || null
    );
  }

  public static async create(patientData: Partial<Patient>): Promise<Patient> {
    const code = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: `pat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patient_code: patientData.patient_code || code,
      name: patientData.name || 'Admitted Patient',
      age: patientData.age || 40,
      gender: patientData.gender || 'Unknown',
      admission_date: new Date().toISOString(),
      discharge_date: null,
      ward_id: patientData.ward_id || null,
      ward_name: patientData.ward_name,
      room_id: patientData.room_id || null,
      room_number: patientData.room_number,
      bed_id: patientData.bed_id || null,
      bed_number: patientData.bed_number,
      doctor_id: patientData.doctor_id || null,
      doctor_name: patientData.doctor_name,
      department: patientData.department || 'General Medicine',
      status: patientData.status || 'admitted',
      bill_amount: patientData.bill_amount || 12500.0,
      emergency_contact: patientData.emergency_contact || 'Family Contact',
      emergency_phone: patientData.emergency_phone || '+91-98000-00000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('patients').insert(newPatient).select().single();
        if (!error && data) {
          await AuditService.log({
            action: 'patient_admitted',
            source: 'system',
            entity_type: 'patient',
            entity_id: data.id,
            details: { name: data.name, code: data.patient_code },
          });
          return data as Patient;
        }
      } catch (err) {
        console.warn('Supabase patient insert fallback:', err);
      }
    }

    mockStore.patients.unshift(newPatient);
    await AuditService.log({
      action: 'patient_admitted',
      source: 'system',
      entity_type: 'patient',
      entity_id: newPatient.id,
      details: { name: newPatient.name, code: newPatient.patient_code },
    });
    return newPatient;
  }

  public static async update(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('patients')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as Patient;
        }
      } catch (err) {
        console.warn('Supabase update patient fallback:', err);
      }
    }

    const patient = mockStore.patients.find((p) => p.id === id || p.patient_code === id);
    if (!patient) return null;

    Object.assign(patient, updates);
    patient.updated_at = new Date().toISOString();
    return patient;
  }

  public static async admitPatient(params: {
    name: string;
    age?: number;
    gender?: string;
    department?: string;
    wardCategory?: string;
  }): Promise<{ patient: Patient; bed: any; doctor: any }> {
    const department = params.department || 'General Medicine';
    const bed = await BedService.findAvailableBed(params.wardCategory);
    const doctor = await DoctorService.findBestDoctor(department);

    const patient = await this.create({
      name: params.name,
      age: params.age || 45,
      gender: params.gender || 'Not Specified',
      department,
      ward_id: bed?.ward_id || null,
      ward_name: bed?.ward_name,
      room_id: bed?.room_id || null,
      room_number: bed?.room_number,
      bed_id: bed?.id || null,
      bed_number: bed?.bed_number,
      doctor_id: doctor?.id || null,
      doctor_name: doctor?.name,
      status: 'admitted',
      bill_amount: 15000.0,
    });

    if (bed) {
      await BedService.updateBedStatus(bed.id, 'occupied', patient.name);
    }
    if (doctor) {
      await DoctorService.updateWorkload(doctor.id, 1);
    }

    return { patient, bed, doctor };
  }
}
