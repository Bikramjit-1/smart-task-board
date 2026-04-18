import type { TaskFilters, TaskListResponse, TaskPayload, Task, TaskUpdatePayload } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = 'Request failed.';

    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail || detail;
    } catch {
      detail = 'Request failed.';
    }

    throw new Error(detail);
  }

  return (await response.json()) as T;
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(input, init);
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Unable to reach the backend API. Start FastAPI on http://127.0.0.1:8000 and try again.',
      );
    }

    throw error;
  }
}

export async function fetchTasks(filters: TaskFilters): Promise<TaskListResponse> {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set('status', filters.status);
  }

  if (filters.priority) {
    searchParams.set('priority', filters.priority);
  }

  const queryString = searchParams.toString();
  return requestJson<TaskListResponse>(`${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`);
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  return requestJson<Task>(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateTask(taskId: number, payload: TaskUpdatePayload): Promise<Task> {
  return requestJson<Task>(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
