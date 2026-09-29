import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory/inventoryService.js';
import { InventoryStatus } from '../types/index.js';

export class InventoryController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, status, search } = req.query;
      const items = await InventoryService.getAll({
        category: category as string,
        status: status as InventoryStatus | 'all',
        search: search as string,
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await InventoryService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  public static async restock(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body;
      const item = await InventoryService.restock(req.params.id, Number(quantity) || 10);
      if (!item) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
}
