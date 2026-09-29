import { ApprovalService } from '../approvals/approvalService.js';
import { NotificationService } from './notificationService.js';
import { AuditService } from '../audit/auditService.js';

export class EscalationService {
  public static async escalateOvercapacity(department: string, wardCategory: string): Promise<void> {
    await ApprovalService.create({
      action: `Emergency Ward Over-Capacity Bed Allocation (${wardCategory.toUpperCase()})`,
      requested_by: 'Automation Engine',
      risk_level: 'critical',
      reason: `No available beds in ${wardCategory} for department ${department}. Surge capacity protocols requested.`,
    });

    await NotificationService.create(
      `CRITICAL: Ward Capacity Exhausted`,
      `Zero available beds in ${wardCategory}. Medical Superintendent notification dispatched.`,
      'urgent',
      department
    );

    await AuditService.log({
      action: 'capacity_escalated',
      source: 'automation_engine',
      entity_type: 'ward',
      details: { department, wardCategory },
    });
  }
}
