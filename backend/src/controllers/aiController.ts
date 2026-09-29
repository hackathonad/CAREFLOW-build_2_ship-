import { Request, Response, NextFunction } from 'express';
import { AICommandService } from '../services/ai/aiCommandService.js';

export class AIController {
  public static async executeCommand(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, execute = true } = req.body;
      const result = await AICommandService.handleCommand(message, execute);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
