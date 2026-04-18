from datetime import date

from .models import Priority, TaskRecord, TaskStatus


class TaskRepository:
    def __init__(self) -> None:
        self._next_id = 5
        self._tasks: dict[int, TaskRecord] = {
            1: TaskRecord(
                id=1,
                title="Fix login bug",
                description="Resolve the broken login redirect before the release window.",
                priority=Priority.HIGH,
                due_date=date(2026, 4, 15),
                status=TaskStatus.TODO,
            ),
            2: TaskRecord(
                id=2,
                title="Implement new API endpoint",
                description="Ship the reporting endpoint needed by the dashboard view.",
                priority=Priority.MEDIUM,
                due_date=date(2026, 4, 20),
                status=TaskStatus.IN_PROGRESS,
            ),
            3: TaskRecord(
                id=3,
                title="Write project documentation",
                description="Capture setup steps, assumptions, and delivery notes for handoff.",
                priority=Priority.LOW,
                due_date=date(2026, 4, 10),
                status=TaskStatus.DONE,
            ),
            4: TaskRecord(
                id=4,
                title="Design homepage layout",
                description="Prepare the new homepage structure and align it with the brand system.",
                priority=Priority.LOW,
                due_date=date(2026, 4, 25),
                status=TaskStatus.TODO,
            ),
        }

    def list(self) -> list[TaskRecord]:
        return list(self._tasks.values())

    def get(self, task_id: int) -> TaskRecord | None:
        return self._tasks.get(task_id)

    def create(self, task: TaskRecord) -> TaskRecord:
        self._tasks[task.id] = task
        self._next_id = max(self._next_id, task.id + 1)
        return task

    def next_id(self) -> int:
        task_id = self._next_id
        self._next_id += 1
        return task_id

    def update(self, task_id: int, task: TaskRecord) -> TaskRecord:
        self._tasks[task_id] = task
        return task
