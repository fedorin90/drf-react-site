import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()
const token = cookies.get('auth_token')

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Token ${token}` : '',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.info('Пользователь не авторизован')
      return Promise.resolve(error.response)
    }
    return Promise.reject(error)
  }
)

// Подавляем все сетевые ошибки с кодом 401 в консоли
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.response?.status === 401) {
    event.preventDefault() // Останавливаем логирование
  }
})

export default api
