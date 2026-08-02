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

type TaskFilter = 'all' | 'active' | 'completed'

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

type UpdateTaskData = {
  updateTask: Task | null
}

type UpdateTaskVariables = {
  taskId: number
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

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: Int!
    $title: String!
    $notes: String!
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      notes: $notes
    ) {
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
  const [searchTerm, setSearchTerm] = useState('')
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingNotes, setEditingNotes] = useState('')

  const {
    data,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery<TasksData>(GET_TASKS)

  const [createTask, { loading: creating, error: createError }] =
    useMutation<CreateTaskData, CreateTaskVariables>(CREATE_TASK, {
      refetchQueries: [{ query: GET_TASKS }],
    })

  const [updateTask, { loading: updating }] = useMutation<
    UpdateTaskData,
    UpdateTaskVariables
  >(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  })

  const [toggleTask, { loading: toggling }] = useMutation<
    ToggleTaskData,
    ToggleTaskVariables
  >(TOGGLE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  })

  const [deleteTask, { loading: deleting }] = useMutation<
    DeleteTaskData,
    DeleteTaskVariables
  >(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  })

  function showSuccess(message: string) {
    setSuccessMessage(message)

    window.setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    setSuccessMessage('')
    setActionError('')

    try {
      await createTask({
        variables: {
          title: trimmedTitle,
          notes: notes.trim(),
        },
      })

      setTitle('')
      setNotes('')
      showSuccess('Task created successfully.')
    } catch {
      // Apollo exposes the detailed create error through createError.
    }
  }

  function handleStartEdit(task: Task) {
    setEditingTaskId(task.id)
    setEditingTitle(task.title)
    setEditingNotes(task.notes)
    setActionError('')
  }

  function handleCancelEdit() {
    setEditingTaskId(null)
    setEditingTitle('')
    setEditingNotes('')
  }

  async function handleSaveEdit(taskId: number) {
    const trimmedTitle = editingTitle.trim()

    if (!trimmedTitle) {
      setActionError('Task title cannot be empty.')
      return
    }

    setActionError('')

    try {
      const result = await updateTask({
        variables: {
          taskId,
          title: trimmedTitle,
          notes: editingNotes.trim(),
        },
      })

      if (!result.data?.updateTask) {
        setActionError('Could not find the task to update.')
        return
      }

      handleCancelEdit()
      showSuccess('Task updated successfully.')
    } catch {
      setActionError('Could not update the task. Please try again.')
    }
  }

  async function handleToggle(taskId: number) {
    setActionError('')

    try {
      await toggleTask({
        variables: { taskId },
      })
    } catch {
      setActionError('Could not update the task. Please try again.')
    }
  }

  async function handleDelete(taskId: number) {
    setActionError('')

    try {
      await deleteTask({
        variables: { taskId },
      })

      if (editingTaskId === taskId) {
        handleCancelEdit()
      }
    } catch {
      setActionError('Could not delete the task. Please try again.')
    }
  }

  const tasks = [...(data?.tasks ?? [])].sort(
    (firstTask, secondTask) =>
      Number(firstTask.completed) - Number(secondTask.completed),
  )

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      taskFilter === 'all' ||
      (taskFilter === 'active' && !task.completed) ||
      (taskFilter === 'completed' && task.completed)

    const searchableText = [
      task.title,
      task.notes,
      task.priority,
      task.tag ?? '',
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      normalizedSearch === '' ||
      searchableText.includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })

  const hasFilters =
    taskFilter !== 'all' || normalizedSearch.length > 0

  const actionInProgress = updating || toggling || deleting

  return (
    <main className="app-shell">
      <section className="app-container">
        <header className="app-header">
          <p className="eyebrow">TASK MANAGER</p>
          <h1>NoteFlow</h1>
          <p className="hero-subtitle">
            Full-stack task management built with React, TypeScript,
            FastAPI, GraphQL, and PostgreSQL.
          </p>

          <p className="hero-description">
            Create tasks and automatically receive priority and tag
            suggestions to keep your workflow organized.
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
              disabled={creating}
              required
            />

            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              rows={4}
              placeholder="Add any extra details..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={creating}
            />

            <button type="submit" disabled={creating}>
              {creating ? 'Adding...' : 'Add task'}
            </button>

            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

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
              {filteredTasks.length}{' '}
              {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="task-controls">
            <label className="search-label" htmlFor="task-search">
              Search tasks
            </label>

            <input
              id="task-search"
              className="search-input"
              type="search"
              placeholder="Search by title, notes, priority, or tag..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="filter-buttons" aria-label="Filter tasks">
              {(['all', 'active', 'completed'] as TaskFilter[]).map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={
                      taskFilter === filter
                        ? 'filter-button active'
                        : 'filter-button'
                    }
                    onClick={() => setTaskFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ),
              )}
            </div>

            {hasFilters && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={() => {
                  setSearchTerm('')
                  setTaskFilter('all')
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {tasksLoading && <p>Loading tasks...</p>}

          {tasksError && (
            <p className="error-message">
              Could not load tasks: {tasksError.message}
            </p>
          )}

          {actionError && (
            <p className="error-message">{actionError}</p>
          )}

          {!tasksLoading && !tasksError && tasks.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <span>Create your first task above.</span>
            </div>
          )}

          {!tasksLoading &&
            !tasksError &&
            tasks.length > 0 &&
            filteredTasks.length === 0 && (
              <div className="empty-state">
                <p>No matching tasks.</p>
                <span>Try changing your search or filters.</span>
              </div>
            )}

          {!tasksLoading &&
            !tasksError &&
            filteredTasks.length > 0 && (
              <div className="task-list">
                {filteredTasks.map((task) => {
                  const isEditing = editingTaskId === task.id

                  return (
                    <article
                      key={task.id}
                      className={`task-item ${
                        task.completed ? 'task-completed' : ''
                      }`}
                    >
                      {isEditing ? (
                        <div className="edit-task-form">
                          <label htmlFor={`edit-title-${task.id}`}>
                            Title
                          </label>

                          <input
                            id={`edit-title-${task.id}`}
                            type="text"
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            disabled={updating}
                          />

                          <label htmlFor={`edit-notes-${task.id}`}>
                            Notes
                          </label>

                          <textarea
                            id={`edit-notes-${task.id}`}
                            rows={3}
                            value={editingNotes}
                            onChange={(event) =>
                              setEditingNotes(event.target.value)
                            }
                            disabled={updating}
                          />

                          <div className="edit-actions">
                            <button
                              type="button"
                              className="save-button"
                              onClick={() => handleSaveEdit(task.id)}
                              disabled={updating}
                            >
                              {updating ? 'Saving...' : 'Save'}
                            </button>

                            <button
                              type="button"
                              className="cancel-button"
                              onClick={handleCancelEdit}
                              disabled={updating}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="task-item-heading">
                            <div>
                              <h3>{task.title}</h3>

                              <div className="badges">
                                <span
                                  className={`priority priority-${task.priority}`}
                                >
                                  {task.priority}
                                </span>

                                {task.tag && (
                                  <span className="tag">{task.tag}</span>
                                )}
                              </div>
                            </div>

                            <div className="task-actions">
                              <button
                                type="button"
                                className="edit-button"
                                onClick={() => handleStartEdit(task)}
                                disabled={actionInProgress}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleToggle(task.id)}
                                disabled={actionInProgress}
                              >
                                {task.completed ? 'Undo' : 'Complete'}
                              </button>

                              <button
                                type="button"
                                className="danger-button"
                                onClick={() => handleDelete(task.id)}
                                disabled={actionInProgress}
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {task.notes && <p>{task.notes}</p>}
                        </>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
        </section>
      </section>
    </main>
  )
}

export default App