import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Bed, BedStatus, Ward, Room, WardCategory } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';

export class BedService {
  public static async getWards(): Promise<Ward[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('wards').select('*');
        if (!error && data) return data as Ward[];
      } catch (err) {
        console.warn('Supabase getWards fallback:', err);
      }
    }
    return mockStore.wards;
  }

  public static async getRooms(wardId?: string): Promise<Room[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('rooms').select('*');
        if (wardId) query = query.eq('ward_id', wardId);
        const { data, error } = await query;
        if (!error && data) return data as Room[];
      } catch (err) {
        console.warn('Supabase getRooms fallback:', err);
      }
    }
    if (wardId) {
      return mockStore.rooms.filter((r) => r.ward_id === wardId);
    }
    return mockStore.rooms;
  }

  public static async getBeds(wardId?: string, status?: BedStatus): Promise<Bed[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('beds').select('*, wards(name, category), rooms(room_number)');
        if (wardId) query = query.eq('ward_id', wardId);
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data) {
          return data.map((b: any) => ({
            ...b,
            ward_name: b.wards?.name,
            ward_category: b.wards?.category,
            room_number: b.rooms?.room_number,
          })) as Bed[];
        }
      } catch (err) {
        console.warn('Supabase getBeds fallback:', err);
      }
    }

    let result = [...mockStore.beds];
    if (wardId) result = result.filter((b) => b.ward_id === wardId);
    if (status) result = result.filter((b) => b.status === status);
    return result;
  }

  public static async findAvailableBed(preferredCategory?: WardCategory | string): Promise<Bed | null> {
    const beds = await this.getBeds();
    const availableBeds = beds.filter((b) => b.status === 'available');

    if (preferredCategory) {
      const match = availableBeds.find(
        (b) => b.ward_category?.toLowerCase() === preferredCategory.toLowerCase()
      );
      if (match) return match;
    }

    // Default preference order: general -> semi_premium -> premium -> observation -> icu
    const order: WardCategory[] = ['general', 'semi_premium', 'premium', 'observation', 'emergency', 'icu'];
    for (const cat of order) {
      const found = availableBeds.find((b) => b.ward_category === cat);
      if (found) return found;
    }

    return availableBeds[0] || null;
  }

  public static async updateBedStatus(
    bedId: string,
    status: BedStatus,
    patientName?: string
  ): Promise<Bed | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('beds')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', bedId)
          .select()
          .single();

        if (!error && data) {
          await AuditService.log({
            action: `bed_${status}`,
            source: 'system',
            entity_type: 'bed',
            entity_id: bedId,
            details: { status, patientName },
          });
          return data as Bed;
        }
      } catch (err) {
        console.warn('Supabase updateBedStatus fallback:', err);
      }
    }

    const bed = mockStore.beds.find((b) => b.id === bedId);
    if (!bed) return null;

    bed.status = status;
    bed.patient_name = status === 'occupied' ? patientName : undefined;

    await AuditService.log({
      action: `bed_${status}`,
      source: 'system',
      entity_type: 'bed',
      entity_id: bedId,
      details: { status, patientName },
    });

    return bed;
  }
}
