from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class TaskStatus(str, Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class DisplayStatus(str, Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"
    OVERDUE = "Overdue"


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=500)
    priority: Priority
    due_date: date

    @field_validator("title", "description")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("must not be blank")
        return value


class TaskCreate(TaskBase):
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, min_length=1, max_length=500)
    priority: Priority | None = None
    due_date: date | None = None
    status: TaskStatus | None = None

    @field_validator("title", "description")
    @classmethod
    def validate_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()
        if not value:
            raise ValueError("must not be blank")
        return value


class TaskRecord(TaskBase):
    id: int
    status: TaskStatus

    model_config = ConfigDict(use_enum_values=True)


class TaskResponse(TaskBase):
    id: int
    status: DisplayStatus
    urgency_score: int

    model_config = ConfigDict(use_enum_values=True)


class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    total: int
