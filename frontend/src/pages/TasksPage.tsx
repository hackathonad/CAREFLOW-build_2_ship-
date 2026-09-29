import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import { Task, TaskPriority, TaskStatus } from '../types';
import { TaskTable } from '../components/tasks/TaskTable';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { CheckSquare, PlusCircle, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => clientCache.get<Task[]>('/tasks') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/tasks'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTasks = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('tasks');
      }
      if (tasks.length === 0) setIsLoading(true);
      setError(null);
      const data = await taskService.getAll({
        status: statusFilter !== 'all' ? (statusFilter as TaskStatus) : undefined,
        priority: priorityFilter !== 'all' ? (priorityFilter as TaskPriority) : undefined,
      });
      setTasks(data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      if (tasks.length === 0) {
        setError(err?.message || 'Failed to fetch operational tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.assigned_employee.toLowerCase().includes(q)
    );
  });

  const statusOptions = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Escalated', value: 'escalated' },
  ];

  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    await taskService.update(task.id, { status: newStatus });
    await fetchTasks();
  };

  const handleCreateTask = async (data: any) => {
    await taskService.create(data);
    await fetchTasks();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Operational Tasks & Work Orders
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Automated task dispatching for nursing, biomedical, billing, and pharmacy operations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>

          <button
            onClick={() => fetchTasks(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Tasks"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search task title, assigned staff, or department..."
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
      />

      {/* Tasks Table */}
      {isLoading && tasks.length === 0 ? (
        <LoadingState message="Loading operational task roster..." />
      ) : error && tasks.length === 0 ? (
        <ErrorState message={error} onRetry={fetchTasks} />
      ) : (
        <TaskTable tasks={filteredTasks} onToggleComplete={handleToggleComplete} />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};
