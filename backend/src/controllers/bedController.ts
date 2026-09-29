import { Request, Response, NextFunction } from 'express';
import { BedService } from '../services/beds/bedService.js';
import { BedStatus } from '../types/index.js';

export class BedController {
  public static async getBeds(req: Request, res: Response, next: NextFunction) {
    try {
      const { wardId, status } = req.query;
      const beds = await BedService.getBeds(wardId as string, status as BedStatus);
      res.json(beds);
    } catch (error) {
      next(error);
    }
  }

  public static async getWards(_req: Request, res: Response, next: NextFunction) {
    try {
      const wards = await BedService.getWards();
      res.json(wards);
    } catch (error) {
      next(error);
    }
  }

  public static async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { wardId } = req.query;
      const rooms = await BedService.getRooms(wardId as string);
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  public static async updateBedStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, patientName } = req.body;
      const updated = await BedService.updateBedStatus(req.params.id, status, patientName);
      if (!updated) {
        return res.status(404).json({ error: 'Bed not found' });
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
