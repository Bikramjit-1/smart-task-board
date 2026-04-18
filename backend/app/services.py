from datetime import date

from .models import (
    DisplayStatus,
    Priority,
    TaskCreate,
    TaskRecord,
    TaskResponse,
    TaskStatus,
    TaskUpdate,
)
from .repository import TaskRepository

PRIORITY_WEIGHT = {
    Priority.HIGH: 3,
    Priority.MEDIUM: 2,
    Priority.LOW: 1,
}


class TaskService:
    def __init__(self, repository: TaskRepository) -> None:
        self.repository = repository

    def list_tasks(
        self,
        *,
        status: str | None = None,
        priority: Priority | None = None,
        today: date | None = None,
    ) -> list[TaskResponse]:
        today = today or date.today()
        items = [self._to_response(task, today=today) for task in self.repository.list()]

        if status:
            items = [item for item in items if item.status == status]

        if priority:
            items = [item for item in items if item.priority == priority]

        items.sort(key=lambda item: (-item.urgency_score, item.due_date))
        return items

    def create_task(self, payload: TaskCreate, today: date | None = None) -> TaskResponse:
        task = TaskRecord(id=self.repository.next_id(), **payload.model_dump())
        self.repository.create(task)
        return self._to_response(task, today=today or date.today())

    def update_task(self, task_id: int, payload: TaskUpdate, today: date | None = None) -> TaskResponse | None:
        current = self.repository.get(task_id)
        if current is None:
            return None

        updates = payload.model_dump(exclude_unset=True)
        updated = current.model_copy(update=updates)
        self.repository.update(task_id, updated)
        return self._to_response(updated, today=today or date.today())

    def _to_response(self, task: TaskRecord, *, today: date) -> TaskResponse:
        days_to_due = (task.due_date - today).days
        urgency_score = PRIORITY_WEIGHT[task.priority] + (days_to_due * -1)
        task_status = task.status if isinstance(task.status, str) else task.status.value

        status = (
            DisplayStatus.OVERDUE
            if task.due_date < today and task_status != TaskStatus.DONE.value
            else DisplayStatus(task_status)
        )

        return TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            priority=task.priority,
            status=status,
            due_date=task.due_date,
            urgency_score=urgency_score,
        )
