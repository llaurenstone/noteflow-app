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
 