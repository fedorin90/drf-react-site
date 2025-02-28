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
  withCredentials: true, // Для передачи куки на сервер
})

api.interceptors.request.use((config) => {
  const token = cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export default api
