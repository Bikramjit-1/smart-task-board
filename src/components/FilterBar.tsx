import type { Dispatch, SetStateAction } from 'react';
import type { TaskFilters } from '../types/task';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: Dispatch<SetStateAction<TaskFilters>>;
}

const STATUS_OPTIONS: TaskFilters['status'][] = ['', 'Todo', 'In Progress', 'Done', 'Overdue'];
const PRIORITY_OPTIONS: TaskFilters['priority'][] = ['', 'Low', 'Medium', 'High'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  function updateFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    onChange((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="filters-row" aria-label="Filters">
      <div className="select-wrap">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value as TaskFilters['status'])}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option || 'all-status'} value={option}>
              {option || 'Status'}
            </option>
          ))}
        </select>
      </div>

      <div className="select-wrap">
        <select
          className="filter-select"
          value={filters.priority}
          onChange={(event) => updateFilter('priority', event.target.value as TaskFilters['priority'])}
          aria-label="Filter by priority"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option || 'all-priority'} value={option}>
              {option || 'Priority'}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
