import { api } from './axios'

const TODO_API_URL = 'todo-app/todos/'

export const fetchTodos = async () => {
  const response = await api.get(TODO_API_URL)
  return response.data
}

export const createTodo = async (text) => {
  const response = await api.post(TODO_API_URL, { text })
  return response.data
}

export const updateTodo = async (id, is_completed) => {
  const response = await api.patch(`${TODO_API_URL}${id}/`, {
    is_completed: is_completed,
  })
  return response.data
}

export const deleteTodo = async (id) => {
  await api.delete(`${TODO_API_URL}${id}/`)
}

export const deleteAllTodos = async () => {
  const response = await api.delete(`${TODO_API_URL}delete_all/`)
  return response.data
}

export const deleteCompletedTodos = async () => {
  const response = await api.delete(`${TODO_API_URL}delete_completed/`)
  return response.data
}
