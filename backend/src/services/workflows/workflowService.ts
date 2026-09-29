import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Workflow, AutomationRun } from '../../types/index.js';

export class WorkflowService {
  public static async getWorkflows(): Promise<Workflow[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('workflows').select('*');
        if (!error && data) return data as Workflow[];
      } catch (err) {
        console.warn('Supabase getWorkflows fallback:', err);
      }
    }
    return mockStore.workflows;
  }

  public static async getAutomationRuns(): Promise<AutomationRun[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('automation_runs')
          .select('*')
          .order('started_at', { ascending: false });
        if (!error && data) return data as AutomationRun[];
      } catch (err) {
        console.warn('Supabase getAutomationRuns fallback:', err);
      }
    }
    return mockStore.automationRuns;
  }

  public static async startRun(workflowName: string, triggerSource: string): Promise<AutomationRun> {
    const newRun: AutomationRun = {
      id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      workflow_id: null,
      workflow_name: workflowName,
      trigger_source: triggerSource,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: null,
      execution_details: {},
      error_message: null,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('automation_runs').insert(newRun).select().single();
        if (!error && data) return data as AutomationRun;
      } catch (err) {
        console.warn('Supabase startRun fallback:', err);
      }
    }

    mockStore.automationRuns.unshift(newRun);
    return newRun;
  }

  public static async completeRun(
    runId: string,
    details: Record<string, unknown>
  ): Promise<AutomationRun | null> {
    const completedAt = new Date().toISOString();
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('automation_runs')
          .update({
            status: 'completed',
            completed_at: completedAt,
            execution_details: details,
          })
          .eq('id', runId)
          .select()
          .single();

        if (!error && data) return data as AutomationRun;
      } catch (err) {
        console.warn('Supabase completeRun fallback:', err);
      }
    }

    const run = mockStore.automationRuns.find((r) => r.id === runId);
    if (run) {
      run.status = 'completed';
      run.completed_at = completedAt;
      run.execution_details = details;
    }
    return run || null;
  }

  public static async failRun(runId: string, errorMessage: string): Promise<AutomationRun | null> {
    const completedAt = new Date().toISOString();
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('automation_runs')
          .update({
            status: 'failed',
            completed_at: completedAt,
            error_message: errorMessage,
          })
          .eq('id', runId)
          .select()
          .single();

        if (!error && data) return data as AutomationRun;
      } catch (err) {
        console.warn('Supabase failRun fallback:', err);
      }
    }

    const run = mockStore.automationRuns.find((r) => r.id === runId);
    if (run) {
      run.status = 'failed';
      run.completed_at = completedAt;
      run.error_message = errorMessage;
    }
    return run || null;
  }
}
