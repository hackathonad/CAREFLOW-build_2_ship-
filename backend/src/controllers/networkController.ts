import { Request, Response, NextFunction } from 'express';
import { HospitalDataService } from '../services/government-data/hospitalDataService.js';
import { AmbulanceDataService } from '../services/government-data/ambulanceDataService.js';

export class NetworkController {
  public static async getFacilities(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, state, district, facilityType } = req.query;
      const facilities = await HospitalDataService.getDirectory({
        search: search as string,
        state: state as string,
        district: district as string,
        facilityType: facilityType as string,
      });
      res.json(facilities);
    } catch (error) {
      next(error);
    }
  }

  public static async getAmbulanceReference(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AmbulanceDataService.getRegionalAmbulanceStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
