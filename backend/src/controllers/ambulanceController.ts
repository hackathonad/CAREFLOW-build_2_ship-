import { Request, Response, NextFunction } from 'express';
import { AmbulanceService } from '../services/ambulances/ambulanceService.js';
import { AmbulanceStatus } from '../types/index.js';

export class AmbulanceController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const ambulances = await AmbulanceService.getAll(status as AmbulanceStatus);
      res.json(ambulances);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const ambulance = await AmbulanceService.getById(req.params.id);
      if (!ambulance) {
        return res.status(404).json({ error: 'Ambulance not found' });
      }
      res.json(ambulance);
    } catch (error) {
      next(error);
    }
  }

  public static async dispatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { destination, request, urgency } = req.body;
      const ambulance = await AmbulanceService.dispatch(
        req.params.id,
        destination,
        request,
        urgency
      );
      res.json(ambulance);
    } catch (error) {
      next(error);
    }
  }
}
