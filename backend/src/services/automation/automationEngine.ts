import { WorkflowService } from '../workflows/workflowService.js';
import { WorkflowExecutor } from './workflowExecutor.js';
import { AuditService } from '../audit/auditService.js';
import {
  AICommandResponse,
  CommandExecutionResult,
} from '../../types/index.js';

export class AutomationEngine {
  public static async processCommand(
    parsedAI: AICommandResponse
  ): Promise<CommandExecutionResult> {
    const workflowName = `Workflow: ${parsedAI.intent}`;
    const run = await WorkflowService.startRun(workflowName, 'ai_command_center');

    try {
      const result = await WorkflowExecutor.execute(parsedAI, run.id);

      await WorkflowService.completeRun(run.id, {
        intent: parsedAI.intent,
        entities: parsedAI.entities,
        executedActions: result.executedActions,
      });

      return result;
    } catch (error: any) {
      const errorMessage = error?.message || 'Automation workflow failed during execution';
      console.error('❌ Automation engine failure:', errorMessage);

      await WorkflowService.failRun(run.id, errorMessage);

      await AuditService.log({
        action: 'automation_failed',
        source: 'automation_engine',
        entity_type: 'workflow',
        entity_id: run.id,
        result: 'failed',
        details: {
          intent: parsedAI.intent,
          error: errorMessage,
        },
      });

      return {
        success: false,
        message: `Automation execution stopped: ${errorMessage}`,
        automationRunId: run.id,
        executedActions: [],
        affectedEntities: [],
        tasksCreated: [],
        notificationsSent: [],
      };
    }
  }
}
