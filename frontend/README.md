# NoteFlow

An AI-assisted full-stack task management application built with React, FastAPI, GraphQL, SQLAlchemy, and Apollo Client.

Users can create, complete, and delete tasks while automatically receiving intelligent priority and category suggestions.

---

## Features

- Create tasks
- Delete tasks
- Mark tasks complete
- AI-generated priority suggestions
- AI-generated task tags
- GraphQL API
- Apollo Client integration
- Responsive React UI
- SQLite database
- Docker support
- Unit & integration testing

---

## Tech Stack

### Frontend

- React
- TypeScript
- Apollo Client
- Vite
- CSS

### Backend

- FastAPI
- Strawberry GraphQL
- SQLAlchemy
- SQLite

### Testing

- Pytest
- Vitest
- React Testing Library

---

## Project Structure

```
task-notes-app
│
├── backend
│   ├── app
│   ├── tests
│   └── Dockerfile
│
├── frontend
│   ├── src
│   ├── public
│   └── tests
│
└── docker-compose.yml
```

---

## Running the Project

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

## Running Tests

### Backend

```bash
pytest -v
```

### Frontend

```bash
npx vitest run
```

---

## Screenshots

### Create Task

(Add screenshot)

### AI Priority

(Add screenshot)

### Completed Task

(Add screenshot)

---

## Future Improvements

- User authentication
- Due dates
- Search
- Drag-and-drop task ordering
- Task editing
- PostgreSQL deployment
- Cloud deployment (AWS)

---

## Author

Lauren Stone
