import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Notification } from '../../types/index.js';

export class NotificationService {
  public static async create(
    title: string,
    message: string,
    type: 'info' | 'warning' | 'urgent' | 'success' = 'info',
    department?: string
  ): Promise<Notification> {
    const supabase = getSupabase();
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      department,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({ title, message, type, department, is_read: false })
          .select()
          .single();

        if (!error && data) {
          return data as Notification;
        }
      } catch (err) {
        console.warn('Supabase notification fallback:', err);
      }
    }

    mockStore.notifications.unshift(newNotif);
    return newNotif;
  }

  public static async getAll(): Promise<Notification[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Notification[];
        }
      } catch (err) {
        console.warn('Supabase notification get fallback:', err);
      }
    }

    return mockStore.notifications;
  }

  public static async markRead(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      } catch (err) {
        console.warn('Supabase mark read fallback:', err);
      }
    }

    const n = mockStore.notifications.find((item) => item.id === id);
    if (n) {
      n.is_read = true;
      return true;
    }
    return false;
  }
}
