import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Approval, ApprovalRisk, ApprovalStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';

export class ApprovalService {
  public static async getAll(status?: ApprovalStatus): Promise<Approval[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('approvals').select('*').order('created_at', { ascending: false });
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data) {
          return data as Approval[];
        }
      } catch (err) {
        console.warn('Supabase approval list fallback:', err);
      }
    }

    if (status) {
      return mockStore.approvals.filter((a) => a.status === status);
    }
    return mockStore.approvals;
  }

  public static async create(entry: {
    action: string;
    requested_by: string;
    risk_level: ApprovalRisk;
    reason: string;
  }): Promise<Approval> {
    const supabase = getSupabase();
    const newApproval: Approval = {
      id: `appr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action: entry.action,
      requested_by: entry.requested_by,
      approver: null,
      risk_level: entry.risk_level,
      status: 'pending',
      reason: entry.reason,
      resolved_at: null,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('approvals').insert(newApproval).select().single();
        if (!error && data) {
          await AuditService.log({
            action: 'approval_requested',
            source: 'automation',
            entity_type: 'approval',
            entity_id: data.id,
            details: { action: data.action, risk: data.risk_level },
          });
          return data as Approval;
        }
      } catch (err) {
        console.warn('Supabase approval create fallback:', err);
      }
    }

    mockStore.approvals.unshift(newApproval);
    await AuditService.log({
      action: 'approval_requested',
      source: 'automation',
      entity_type: 'approval',
      entity_id: newApproval.id,
      details: { action: newApproval.action, risk: newApproval.risk_level },
    });
    return newApproval;
  }

  public static async resolve(
    id: string,
    status: 'approved' | 'rejected',
    approverName: string = 'Operations Administrator'
  ): Promise<Approval | null> {
    const supabase = getSupabase();
    const resolvedAt = new Date().toISOString();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('approvals')
          .update({ status, approver: approverName, resolved_at: resolvedAt })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await AuditService.log({
            action: `approval_${status}`,
            source: 'user_action',
            entity_type: 'approval',
            entity_id: id,
            details: { status, approver: approverName },
          });
          return data as Approval;
        }
      } catch (err) {
        console.warn('Supabase resolve approval fallback:', err);
      }
    }

    const app = mockStore.approvals.find((a) => a.id === id);
    if (!app) return null;

    app.status = status;
    app.approver = approverName;
    app.resolved_at = resolvedAt;

    await AuditService.log({
      action: `approval_${status}`,
      source: 'user_action',
      entity_type: 'approval',
      entity_id: id,
      details: { status, approver: approverName },
    });

    return app;
  }
}
