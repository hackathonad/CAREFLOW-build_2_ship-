import { getSupabase } from '../../db/supabase.js';
import { mockStore } from '../../db/mockStore.js';
import { Task, TaskPriority, TaskStatus } from '../../types/index.js';
import { AuditService } from '../audit/auditService.js';

export class TaskService {
  public static async getAll(filter?: {
    department?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  }): Promise<Task[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (filter?.department) query = query.eq('department', filter.department);
        if (filter?.priority) query = query.eq('priority', filter.priority);
        if (filter?.status) query = query.eq('status', filter.status);

        const { data, error } = await query;
        if (!error && data) {
          return data as Task[];
        }
      } catch (err) {
        console.warn('Supabase task list fallback:', err);
      }
    }

    let result = [...mockStore.tasks];
    if (filter?.department) result = result.filter((t) => t.department.toLowerCase() === filter.department?.toLowerCase());
    if (filter?.priority) result = result.filter((t) => t.priority === filter.priority);
    if (filter?.status) result = result.filter((t) => t.status === filter.status);
    return result;
  }

  public static async create(taskData: {
    title: string;
    description: string;
    department: string;
    assigned_employee?: string;
    priority?: TaskPriority;
    due_time?: string;
    source_workflow?: string;
  }): Promise<Task> {
    const supabase = getSupabase();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: taskData.title,
      description: taskData.description,
      department: taskData.department,
      assigned_employee: taskData.assigned_employee || 'On-Duty Operations Staff',
      priority: taskData.priority || 'medium',
      status: 'pending',
      due_time: taskData.due_time || new Date(Date.now() + 2 * 3600000).toISOString(),
      source_workflow: taskData.source_workflow || 'Manual Ops',
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
        if (!error && data) {
          await AuditService.log({
            action: 'task_created',
            source: 'system',
            entity_type: 'task',
            entity_id: data.id,
            details: { title: data.title, department: data.department },
          });
          return data as Task;
        }
      } catch (err) {
        console.warn('Supabase task create fallback:', err);
      }
    }

    mockStore.tasks.unshift(newTask);
    await AuditService.log({
      action: 'task_created',
      source: 'system',
      entity_type: 'task',
      entity_id: newTask.id,
      details: { title: newTask.title, department: newTask.department },
    });
    return newTask;
  }

  public static async update(
    id: string,
    updates: Partial<Pick<Task, 'status' | 'priority' | 'assigned_employee'>>
  ): Promise<Task | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await AuditService.log({
            action: 'task_updated',
            source: 'user_action',
            entity_type: 'task',
            entity_id: id,
            details: updates,
          });
          return data as Task;
        }
      } catch (err) {
        console.warn('Supabase task update fallback:', err);
      }
    }

    const task = mockStore.tasks.find((t) => t.id === id);
    if (!task) return null;

    Object.assign(task, updates);
    await AuditService.log({
      action: 'task_updated',
      source: 'user_action',
      entity_type: 'task',
      entity_id: id,
      details: updates,
    });
    return task;
  }
}
