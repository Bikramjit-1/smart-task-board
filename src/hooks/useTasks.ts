import { useCallback, useEffect, useState } from 'react';
import { createTask as createTaskRequest, fetchTasks, updateTask as updateTaskRequest } from '../api/tasks';
import type { Task, TaskFilters, TaskPayload, TaskUpdatePayload } from '../types/task';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  submitting: boolean;
  error: string;
  createTask: (payload: TaskPayload) => Promise<boolean>;
  updateTask: (taskId: number, payload: TaskUpdatePayload) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTasks(filters: TaskFilters): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextTasks = await fetchTasks(filters);
      setTasks(nextTasks.items);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function createTask(payload: TaskPayload) {
    setSubmitting(true);
    setError('');

    try {
      await createTaskRequest(payload);
      await loadTasks();
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create task.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTask(taskId: number, payload: TaskUpdatePayload) {
    setError('');

    try {
      await updateTaskRequest(taskId, payload);
      await loadTasks();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update task.');
    }
  }

  return {
    tasks,
    loading,
    submitting,
    error,
    createTask,
    updateTask,
    refresh: loadTasks,
  };
}
