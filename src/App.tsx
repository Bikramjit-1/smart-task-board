import { useState } from 'react';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskFormModal } from './components/TaskFormModal';
import { useTasks } from './hooks/useTasks';
import type { TaskFilters, TaskPayload } from './types/task';

const EMPTY_FILTERS: TaskFilters = {
  status: '',
  priority: '',
};

function App() {
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { tasks, loading, error, submitting, createTask, updateTask, refresh } = useTasks(filters);

  async function handleCreateTask(payload: TaskPayload) {
    const created = await createTask(payload);
    if (created) {
      setIsModalOpen(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="board-container">
        <section className="board-panel">
          <header className="board-header">
            <h1>Task Board</h1>
            <button className="primary-button" type="button" onClick={() => setIsModalOpen(true)}>
              + Add Task
            </button>
          </header>

          <FilterBar filters={filters} onChange={setFilters} />

          {error ? (
            <div className="status-banner error">
              <p>{error}</p>
              <button type="button" className="inline-button" onClick={refresh}>
                Retry
              </button>
            </div>
          ) : null}

          {loading ? <div className="status-banner">Loading tasks...</div> : null}

          {!loading ? (
            <section className="task-list" aria-label="Tasks">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} />
              ))}
            </section>
          ) : null}
        </section>

        <TaskFormModal
          isOpen={isModalOpen}
          submitting={submitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </section>
    </main>
  );
}

export default App;
