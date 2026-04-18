# Smart Task Board

A standalone assessment project built with React, TypeScript, and FastAPI. The backend owns overdue detection, urgency scoring, sorting, and filtering so the frontend stays focused on presentation and interaction.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Pydantic
- Storage: In-memory repository

## Project Structure

```text
Smart Task Board/
  backend/
    app/
      main.py
      models.py
      repository.py
      services.py
    requirements.txt
  src/
    api/
      tasks.ts
    components/
      FilterBar.tsx
      TaskCard.tsx
      TaskFormModal.tsx
    hooks/
      useTasks.ts
    types/
      task.ts
    App.tsx
    main.tsx
    styles.css
  index.html
  package.json
  tsconfig.json
  vite.config.js
```

## Business Rules

- If `due_date` is in the past and the task is not `Done`, the API returns `status: "Overdue"`.
- `urgency_score` is computed dynamically and never stored in the database.
- Tasks are sorted by:
  1. `urgency_score` descending
  2. `due_date` ascending
- Filtering is supported by `status` and `priority`.

## API

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/{id}`

Example response item:

```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Resolve the broken login redirect before the release window.",
  "priority": "High",
  "status": "Overdue",
  "due_date": "2026-04-15",
  "urgency_score": 6
}
```

## Step-By-Step Run Guide

### 1. Open the project folder

Open a terminal inside:

```bash
C:\Users\Bikramjit\OneDrive\Documents\New project\Smart Task Board
```

### 2. Start the backend first

Open a terminal in the project root, then run:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

Quick check:

```text
http://127.0.0.1:8000/tasks
```

### 3. Start the frontend

Open a second terminal in the project root, then run:

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

If Vite chooses another free port, open the URL shown in the terminal.

### 4. Use the app

1. Open the frontend URL in your browser.
2. Make sure the backend terminal is still running.
3. Add a task from the modal.
4. Filter by status or priority.
5. Update a task status from the task cards.

## Notes About Local Ports

- The frontend calls the backend from [tasks.ts](C:\Users\Bikramjit\OneDrive\Documents\New%20project\Smart%20Task%20Board\src\api\tasks.ts).
- The default backend API base URL is `http://127.0.0.1:8000`.
- Backend CORS currently allows:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
  - `http://localhost:4174`
  - `http://127.0.0.1:4174`

If you run the frontend on a different port, either use one of the allowed ports above or update [main.py](C:\Users\Bikramjit\OneDrive\Documents\New%20project\Smart%20Task%20Board\backend\app\main.py#L8).

## Assumptions

- Persistent storage was not required, so tasks live in memory.
- Input task status values are limited to `Todo`, `In Progress`, and `Done`; `Overdue` is derived by the backend.
- The urgency formula is applied exactly as specified, including for completed tasks.

## Incomplete / Tradeoffs

- Tasks are stored in memory, so restarting the backend resets the data.
- Authentication and database persistence were intentionally left out to keep the focus on the assessment requirements.
