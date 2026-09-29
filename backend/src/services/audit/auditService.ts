import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { AuditLog } from '../../types/index.js';

export class AuditService {
  public static async log(entry: {
    action: string;
    source: string;
    entity_type: string;
    entity_id?: string | null;
    result?: string;
    details?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const supabase = getSupabase();
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action: entry.action,
      source: entry.source,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id || null,
      result: entry.result || 'success',
      details: entry.details || {},
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert({
            action: entry.action,
            source: entry.source,
            entity_type: entry.entity_type,
            entity_id: entry.entity_id,
            result: entry.result || 'success',
            details: entry.details || {},
          })
          .select()
          .single();

        if (!error && data) {
          return data as AuditLog;
        }
      } catch (err) {
        console.warn('Supabase audit log insert fallback:', err);
      }
    }

    mockStore.auditLogs.unshift(newLog);
    return newLog;
  }

  public static async getAll(limit = 50): Promise<AuditLog[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data) {
          return data as AuditLog[];
        }
      } catch (err) {
        console.warn('Supabase audit get fallback:', err);
      }
    }

    return mockStore.auditLogs.slice(0, limit);
  }
}
