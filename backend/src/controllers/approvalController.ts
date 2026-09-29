import { Request, Response, NextFunction } from 'express';
import { ApprovalService } from '../services/approvals/approvalService.js';
import { ApprovalStatus } from '../types/index.js';

export class ApprovalController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const approvals = await ApprovalService.getAll(status as ApprovalStatus);
      res.json(approvals);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const approval = await ApprovalService.create(req.body);
      res.status(201).json(approval);
    } catch (error) {
      next(error);
    }
  }

  public static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, approver } = req.body;
      const updated = await ApprovalService.resolve(req.params.id, status, approver);
      if (!updated) {
        return res.status(404).json({ error: 'Approval request not found' });
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
