import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/tasks/taskService.js';
import { TaskPriority, TaskStatus } from '../types/index.js';

export class TaskController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { department, priority, status } = req.query;
      const tasks = await TaskService.getAll({
        department: department as string,
        priority: priority as TaskPriority,
        status: status as TaskStatus,
      });
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.update(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
}
