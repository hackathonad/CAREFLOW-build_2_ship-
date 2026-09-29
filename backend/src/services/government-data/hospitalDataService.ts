import { GovernmentDataClient } from './governmentDataClient.js';
import { NetworkFacility } from '../../types/index.js';

export class HospitalDataService {
  public static async getDirectory(filter?: {
    search?: string;
    state?: string;
    district?: string;
    facilityType?: string;
  }): Promise<NetworkFacility[]> {
    const rawFacilities = await GovernmentDataClient.fetchFacilities();

    let facilities: NetworkFacility[] = rawFacilities.map((r: any, idx: number) => ({
      id: r.id || `gov-fac-${idx + 1}`,
      name: r.name || r.hospital_name || 'Government Health Facility',
      facility_type: r.facility_type || r.category || 'Public Hospital',
      ownership: r.ownership || 'Government',
      state: r.state || 'Maharashtra',
      district: r.district || 'Mumbai',
      pincode: r.pincode || '400001',
      total_beds: Number(r.total_beds || 200),
      icu_beds: Number(r.icu_beds || 20),
      emergency_services: r.emergency_services !== false,
      ambulance_count: Number(r.ambulance_count || 3),
      contact_phone: r.contact_phone || '+91-22-2000-0000',
      source_attribution: r.source_attribution || 'National Hospital Directory (data.gov.in)',
    }));

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      facilities = facilities.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.district.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.facility_type.toLowerCase().includes(q)
      );
    }
    if (filter?.state) {
      facilities = facilities.filter((f) => f.state.toLowerCase() === filter.state!.toLowerCase());
    }
    if (filter?.district) {
      facilities = facilities.filter((f) => f.district.toLowerCase() === filter.district!.toLowerCase());
    }
    if (filter?.facilityType && filter.facilityType !== 'all') {
      facilities = facilities.filter((f) =>
        f.facility_type.toLowerCase().includes(filter.facilityType!.toLowerCase())
      );
    }

    return facilities;
  }
}
