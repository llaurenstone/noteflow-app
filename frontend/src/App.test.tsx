import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing/react'
import { describe, expect, test } from 'vitest'
import App from './App'

function renderApp() {
  render(
    <MockedProvider mocks={[]}>
      <App />
    </MockedProvider>,
  )
}

describe('App', () => {
  test('renders the NoteFlow heading', () => {
    renderApp()

    expect(
      screen.getByRole('heading', { name: 'NoteFlow' }),
    ).toBeInTheDocument()
  })

  test('renders the task form', () => {
    renderApp()

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add task' }),
    ).toBeInTheDocument()
  })
})