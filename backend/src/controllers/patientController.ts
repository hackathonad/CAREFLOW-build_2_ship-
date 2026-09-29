import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patients/patientService.js';
import { PatientStatus } from '../types/index.js';

export class PatientController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, department, search } = req.query;
      const patients = await PatientService.getAll({
        status: status as PatientStatus | 'all',
        department: department as string,
        search: search as string,
      });
      res.json(patients);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.getById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.create(req.body);
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.update(req.params.id, req.body);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  }
}
