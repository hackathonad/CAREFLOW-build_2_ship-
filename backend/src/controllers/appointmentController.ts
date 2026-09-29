import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointments/appointmentService.js';
import { AppointmentStatus } from '../types/index.js';

export class AppointmentController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, date } = req.query;
      const appointments = await AppointmentService.getAll({
        status: status as AppointmentStatus | 'all',
        date: date as string,
      });
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.create(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }
}
