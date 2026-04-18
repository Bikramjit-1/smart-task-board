import type { Task, TaskUpdatePayload } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: number, payload: TaskUpdatePayload) => Promise<void>;
}

const STATUS_CLASSNAME: Record<Task['status'], string> = {
  Overdue: 'status-pill status-pill-overdue',
  'In Progress': 'status-pill status-pill-progress',
  Done: 'status-pill status-pill-done',
  Todo: 'status-pill status-pill-todo',
};

const STATUS_ICON: Record<Task['status'], string> = {
  Overdue: '●',
  'In Progress': '✦',
  Done: '✓',
  Todo: '○',
};

function formatDueDate(dueDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dueDate));
}

function buildActions(task: Task) {
  if (task.status === 'Done') {
    return [{ label: 'Move to Todo', status: 'Todo' as const }];
  }

  if (task.status === 'Todo' || task.status === 'Overdue') {
    return [
      { label: 'Start', status: 'In Progress' as const },
      { label: 'Done', status: 'Done' as const },
    ];
  }

  return [
    { label: 'Todo', status: 'Todo' as const },
    { label: 'Done', status: 'Done' as const },
  ];
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const actions = buildActions(task);

  return (
    <article className="task-card">
      <div className="task-card-head">
        <div className="task-copy">
          <h2>{task.title}</h2>
          <div className="task-meta">
            <span className="calendar-mark">□</span>
            <span>Due: {formatDueDate(task.due_date)}</span>
          </div>
        </div>

        <div className="task-right">
          <span className={STATUS_CLASSNAME[task.status]}>
            <span className="status-icon">{STATUS_ICON[task.status]}</span>
            {task.status}
          </span>
          <div className="action-dots">•••</div>
        </div>
      </div>

      <div className="task-card-foot">
        <div className="task-inline-actions" aria-label={`Actions for ${task.title}`}>
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className="ghost-chip"
              onClick={() => void onUpdate(task.id, { status: action.status })}
            >
              {action.label}
            </button>
          ))}
        </div>

        <p className="urgency-score">
          <span>Urgency Score:</span> {task.urgency_score}
        </p>
      </div>
    </article>
  );
}
