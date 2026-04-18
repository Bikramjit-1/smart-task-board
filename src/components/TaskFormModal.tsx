import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { TaskPayload, TaskPriority, TaskStatus } from '../types/task';

interface TaskFormModalProps {
  isOpen: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
}

interface TaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
}

const INITIAL_FORM: TaskFormState = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Todo',
  due_date: '',
};

function formatDateForInput(dateString: string) {
  if (!dateString) {
    return '';
  }

  return new Date(dateString).toISOString().slice(0, 10);
}

export function TaskFormModal({ isOpen, submitting, onClose, onSubmit }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormState>(INITIAL_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function updateField<K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.due_date) {
      setError('Title, description, and due date are required.');
      return;
    }

    setError('');
    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      due_date: formatDateForInput(form.due_date),
    });
  }

  return (
    <section className="modal-zone">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-header">
          <h2 id="task-form-title">Add New Task</h2>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Title"
            />
          </div>

          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <div className="select-wrap">
                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(event) => updateField('priority', event.target.value as TaskPriority)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="task-due-date">Due Date</label>
              <div className="select-wrap date-input-wrap">
                <input
                  id="task-due-date"
                  type="date"
                  value={form.due_date}
                  onChange={(event) => updateField('due_date', event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="field field-hidden">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as TaskStatus)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {error ? <p className="validation-text">{error}</p> : null}

          <div className="modal-actions">
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
