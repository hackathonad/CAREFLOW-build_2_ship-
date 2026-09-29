import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctors/doctorService.js';

export class DoctorController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { department, availability, shift } = req.query;
      const doctors = await DoctorService.getAll({
        department: department as string,
        availability: availability as string,
        shift: shift as string,
      });
      res.json(doctors);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await DoctorService.getById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      next(error);
    }
  }
}
