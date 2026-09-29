import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { InventoryItem, InventoryStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';
import { TaskService } from '../tasks/taskService.js';
import { ApprovalService } from '../approvals/approvalService.js';
import { NotificationService } from '../automation/notificationService.js';

export class InventoryService {
  public static async getAll(filter?: {
    category?: string;
    status?: InventoryStatus | 'all';
    search?: string;
  }): Promise<InventoryItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('inventory_items').select('*').order('name');
        if (filter?.category) query = query.eq('category', filter.category);
        if (filter?.status && filter.status !== 'all') query = query.eq('status', filter.status);
        if (filter?.search) query = query.ilike('name', `%${filter.search}%`);

        const { data, error } = await query;
        if (!error && data) return data as InventoryItem[];
      } catch (err) {
        console.warn('Supabase getInventory fallback:', err);
      }
    }

    let result = [...mockStore.inventory];
    if (filter?.category) result = result.filter((i) => i.category === filter.category);
    if (filter?.status && filter.status !== 'all') result = result.filter((i) => i.status === filter.status);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return result;
  }

  public static async getLowStock(): Promise<InventoryItem[]> {
    const all = await this.getAll();
    return all.filter(
      (i) =>
        i.quantity <= i.minimum_threshold ||
        i.status === 'low_stock' ||
        i.status === 'critical' ||
        i.status === 'out_of_stock'
    );
  }

  public static async getById(id: string): Promise<InventoryItem | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('inventory_items').select('*').eq('id', id).single();
        if (!error && data) return data as InventoryItem;
      } catch (err) {
        console.warn('Supabase getInventoryById fallback:', err);
      }
    }
    return mockStore.inventory.find((i) => i.id === id || i.name.toLowerCase().includes(id.toLowerCase())) || null;
  }

  public static async restock(id: string, quantityToAdd: number): Promise<InventoryItem | null> {
    const item = await this.getById(id);
    if (!item) return null;

    const newQty = item.quantity + quantityToAdd;
    let newStatus: InventoryStatus = 'normal';
    if (newQty <= 0) newStatus = 'out_of_stock';
    else if (newQty < item.minimum_threshold / 2) newStatus = 'critical';
    else if (newQty < item.minimum_threshold) newStatus = 'low_stock';

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .update({
            quantity: newQty,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)
          .select()
          .single();

        if (!error && data) {
          await AuditService.log({
            action: 'inventory_restocked',
            source: 'user_action',
            entity_type: 'inventory',
            entity_id: item.id,
            details: { item: item.name, added: quantityToAdd, newQuantity: newQty },
          });
          return data as InventoryItem;
        }
      } catch (err) {
        console.warn('Supabase restock fallback:', err);
      }
    }

    const storedItem = mockStore.inventory.find((i) => i.id === item.id);
    if (storedItem) {
      storedItem.quantity = newQty;
      storedItem.status = newStatus;
      storedItem.updated_at = new Date().toISOString();
    }

    await AuditService.log({
      action: 'inventory_restocked',
      source: 'user_action',
      entity_type: 'inventory',
      entity_id: item.id,
      details: { item: item.name, added: quantityToAdd, newQuantity: newQty },
    });

    return storedItem || item;
  }

  public static async handleReplenishmentRequest(itemName: string, quantity?: number): Promise<{
    item: InventoryItem;
    approvalCreated?: boolean;
    taskCreated?: boolean;
  }> {
    const item = mockStore.inventory.find(
      (i) => i.name.toLowerCase().includes(itemName.toLowerCase()) || i.sku.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
      throw new Error(`Inventory item '${itemName}' not found in hospital catalog.`);
    }

    const qty = quantity || item.minimum_threshold * 2;
    const estCost = qty * item.unit_cost;

    let approvalCreated = false;
    if (estCost > 10000 || item.category === 'Gases' || item.category === 'Emergency') {
      await ApprovalService.create({
        action: `Bulk Restock Order: ${qty} ${item.unit} of ${item.name}`,
        requested_by: 'CareFlow Inventory Bot',
        risk_level: item.status === 'critical' ? 'critical' : 'high',
        reason: `Item stock is currently ${item.quantity} (Threshold: ${item.minimum_threshold}). Estimated purchase cost: ₹${estCost.toLocaleString()}`,
      });
      approvalCreated = true;
    }

    await TaskService.create({
      title: `Procure ${qty} ${item.unit} - ${item.name}`,
      description: `Stock level is currently ${item.quantity} (threshold: ${item.minimum_threshold}). Contact supplier ${item.supplier_name || 'Authorized Distributor'}.`,
      department: 'Inventory Operations',
      assigned_employee: 'Materials Store Manager',
      priority: item.status === 'critical' ? 'critical' : 'high',
      source_workflow: 'Inventory Threshold Engine',
    });

    await NotificationService.create(
      `Replenishment Triggered: ${item.name}`,
      `Order process initiated for ${qty} ${item.unit}. Stock: ${item.quantity}/${item.minimum_threshold}.`,
      item.status === 'critical' ? 'urgent' : 'warning',
      'Inventory Operations'
    );

    return { item, approvalCreated, taskCreated: true };
  }
}
