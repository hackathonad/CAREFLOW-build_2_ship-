import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Doctor } from '../../types/index.js';

export class DoctorService {
  public static async getAll(filter?: {
    department?: string;
    availability?: string;
    shift?: string;
  }): Promise<Doctor[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('doctors').select('*');
        if (filter?.department) query = query.ilike('department', `%${filter.department}%`);
        if (filter?.availability) query = query.eq('availability', filter.availability);
        if (filter?.shift) query = query.eq('shift', filter.shift);

        const { data, error } = await query;
        if (!error && data) return data as Doctor[];
      } catch (err) {
        console.warn('Supabase getDoctors fallback:', err);
      }
    }

    let result = [...mockStore.doctors];
    if (filter?.department) {
      result = result.filter((d) =>
        d.department.toLowerCase().includes(filter.department!.toLowerCase())
      );
    }
    if (filter?.availability) {
      result = result.filter((d) => d.availability === filter.availability);
    }
    if (filter?.shift) {
      result = result.filter((d) => d.shift.toLowerCase() === filter.shift!.toLowerCase());
    }
    return result;
  }

  public static async getById(id: string): Promise<Doctor | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single();
        if (!error && data) return data as Doctor;
      } catch (err) {
        console.warn('Supabase getDoctorById fallback:', err);
      }
    }
    return mockStore.doctors.find((d) => d.id === id) || null;
  }

  public static async findBestDoctor(department?: string): Promise<Doctor | null> {
    const doctors = await this.getAll({
      department: department || undefined,
      availability: 'available',
    });

    if (doctors.length === 0) {
      // Fallback to any doctor in department or overall
      const allInDept = await this.getAll({ department });
      if (allInDept.length > 0) {
        return allInDept.sort((a, b) => a.workload - b.workload)[0];
      }
      return mockStore.doctors.sort((a, b) => a.workload - b.workload)[0];
    }

    // Sort by lowest workload
    return doctors.sort((a, b) => a.workload - b.workload)[0];
  }

  public static async updateWorkload(id: string, delta: number): Promise<void> {
    const doc = mockStore.doctors.find((d) => d.id === id);
    if (doc) {
      doc.workload = Math.max(0, doc.workload + delta);
      if (doc.workload >= doc.max_workload) {
        doc.availability = 'busy';
      } else if (doc.availability === 'busy') {
        doc.availability = 'available';
      }
    }

    const supabase = getSupabase();
    if (supabase && doc) {
      try {
        await supabase
          .from('doctors')
          .update({ workload: doc.workload, availability: doc.availability })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateWorkload fallback:', err);
      }
    }
  }
}
