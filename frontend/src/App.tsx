import type { FormEvent } from 'react'
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import './App.css'

type Task = {
  id: number
  title: string
  notes: string
  priority: string
  tag: string | null
  completed: boolean
}

type TasksData = {
  tasks: Task[]
}

type CreateTaskData = {
  createTask: Task
}

type CreateTaskVariables = {
  title: string
  notes: string
}

type ToggleTaskData = {
  toggleTask: Task | null
}

type ToggleTaskVariables = {
  taskId: number
}

type DeleteTaskData = {
  deleteTask: boolean
}

type DeleteTaskVariables = {
  taskId: number
}

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      notes
      priority
      tag
      completed
    }
  }
`

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $notes: String!) {
    createTask(title: $title, notes: $notes) {
      id
      title
      notes
      priority
      tag
      completed
    }
  }
`

const TOGGLE_TASK = gql`
  mutation ToggleTask($taskId: Int!) {
    toggleTask(taskId: $taskId) {
      id
      title
      notes
      priority
      tag
      completed
    }
  }
`

const DELETE_TASK = gql`
  mutation DeleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId)
  }
`

function App() {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const {
    data,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery<TasksData>(GET_TASKS)

  const [createTask, { loading: creating, error: createError }] =
    useMutation<CreateTaskData, CreateTaskVariables>(CREATE_TASK, {
      refetchQueries: [{ query: GET_TASKS }],
    })

  const [toggleTask] = useMutation<ToggleTaskData, ToggleTaskVariables>(
    TOGGLE_TASK,
    {
      refetchQueries: [{ query: GET_TASKS }],
    },
  )

  const [deleteTask] = useMutation<DeleteTaskData, DeleteTaskVariables>(
    DELETE_TASK,
    {
      refetchQueries: [{ query: GET_TASKS }],
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    await createTask({
      variables: {
        title: trimmedTitle,
        notes: notes.trim(),
      },
    })

    setTitle('')
    setNotes('')
  }

  async function handleToggle(taskId: number) {
    await toggleTask({
      variables: { taskId },
    })
  }

  async function handleDelete(taskId: number) {
    await deleteTask({
      variables: { taskId },
    })
  }

  const tasks = data?.tasks ?? []

  return (
    <main className="app-shell">
      <section className="app-container">
        <header className="app-header">
          <p className="eyebrow">TASK MANAGER</p>
          <h1>NoteFlow</h1>
          <p className="subtitle">
            Create tasks and let the app suggest a priority and tag.
          </p>
        </header>

        <section className="panel">
          <h2>Create a task</h2>

          <form className="task-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Finish my resume today"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Add any extra details..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
            />

            <button type="submit" disabled={creating}>
              {creating ? 'Adding...' : 'Add task'}
            </button>

            {createError && (
              <p className="error-message">
                Could not create task: {createError.message}
              </p>
            )}
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Your tasks</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasksLoading && <p>Loading tasks...</p>}

          {tasksError && (
            <p className="error-message">
              Could not load tasks: {tasksError.message}
            </p>
          )}

          {!tasksLoading && !tasksError && tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <span>Create your first task above.</span>
            </div>
          )}

          {!tasksLoading && !tasksError && tasks.length > 0 && (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={`task-item ${task.completed ? 'task-completed' : ''}`}
                  key={task.id}
                >
                  <div className="task-item-heading">
                    <div>
                      <h3>{task.title}</h3>

                      <div className="badges">
                        <span className={`priority priority-${task.priority}`}>
                          {task.priority}
                        </span>

                        {task.tag && <span className="tag">{task.tag}</span>}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleToggle(task.id)}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {task.notes && <p>{task.notes}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App