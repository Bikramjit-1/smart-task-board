export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type DisplayStatus = TaskStatus | 'Overdue';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  status: DisplayStatus;
  urgency_score: number;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
}

export interface TaskFilters {
  status: '' | DisplayStatus;
  priority: '' | TaskPriority;
}

export interface TaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  status: TaskStatus;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  status?: TaskStatus;
}
