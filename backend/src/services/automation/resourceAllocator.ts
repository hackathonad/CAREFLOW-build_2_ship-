import { BedService } from '../beds/bedService.js';
import { DoctorService } from '../doctors/doctorService.js';
import { AmbulanceService } from '../ambulances/ambulanceService.js';
import { Bed, Doctor, Ambulance, WardCategory } from '../../types/index.js';

export class ResourceAllocator {
  public static async allocateBed(params: {
    preferredCategory?: WardCategory | string;
    department?: string;
  }): Promise<Bed> {
    const bed = await BedService.findAvailableBed(params.preferredCategory);
    if (!bed) {
      throw new Error(`No beds currently available in category '${params.preferredCategory || 'any'}'. Over-capacity triage required.`);
    }
    return bed;
  }

  public static async allocateDoctor(department: string): Promise<Doctor> {
    const doctor = await DoctorService.findBestDoctor(department);
    if (!doctor) {
      throw new Error(`No available physician located for department '${department}'.`);
    }
    return doctor;
  }

  public static async allocateAmbulance(): Promise<Ambulance> {
    const amb = await AmbulanceService.findAvailable();
    if (!amb) {
      throw new Error('All hospital ambulances currently dispatched or in maintenance. External mutual-aid request needed.');
    }
    return amb;
  }
}
