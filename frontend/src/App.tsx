import { useState } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

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

          <form className="task-form">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Finish my resume today"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Add any extra details..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
            />

            <button type="submit">Add task</button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Your tasks</h2>
            <span>0 tasks</span>
          </div>

          <div className="empty-state">
            <p>No tasks yet.</p>
            <span>Create your first task above.</span>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App