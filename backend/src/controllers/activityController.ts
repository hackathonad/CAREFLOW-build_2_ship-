import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit/auditService.js';
import { WorkflowService } from '../services/workflows/workflowService.js';

export class ActivityController {
  public static async getTimeline(_req: Request, res: Response, next: NextFunction) {
    try {
      const [auditLogs, runs] = await Promise.all([
        AuditService.getAll(40),
        WorkflowService.getAutomationRuns(),
      ]);

      const timeline = [
        ...auditLogs.map((log) => ({
          id: log.id,
          type: 'audit',
          action: log.action.replace(/_/g, ' ').toUpperCase(),
          source: log.source,
          entityType: log.entity_type,
          entityId: log.entity_id,
          result: log.result,
          details: log.details,
          timestamp: log.created_at,
        })),
        ...runs.map((r) => ({
          id: r.id,
          type: 'workflow',
          action: `${r.workflow_name} (${r.status.toUpperCase()})`,
          source: r.trigger_source,
          entityType: 'automation_run',
          entityId: r.id,
          result: r.status,
          details: r.execution_details,
          timestamp: r.started_at,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json(timeline.slice(0, 50));
    } catch (error) {
      next(error);
    }
  }
}
