from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import Priority, TaskCreate, TaskListResponse, TaskResponse, TaskUpdate
from .repository import TaskRepository
from .services import TaskService

app = FastAPI(title="Smart Task Board API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4174",
        "http://127.0.0.1:4174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

task_service = TaskService(TaskRepository())


@app.get("/tasks", response_model=TaskListResponse)
def get_tasks(
    status: str | None = Query(default=None),
    priority: Priority | None = Query(default=None),
) -> TaskListResponse:
    items = task_service.list_tasks(status=status, priority=priority)
    return TaskListResponse(items=items, total=len(items))


@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(payload: TaskCreate) -> TaskResponse:
    return task_service.create_task(payload)


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, payload: TaskUpdate) -> TaskResponse:
    task = task_service.update_task(task_id, payload)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task
