import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import api from './api/axios'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'
import VerifyEmail from './components/VerifyEmail'
import TermsAndConditions from './components/TermsAndConditions'

function App() {
  const defaultUser = {
    email: '',
    isDefault: true,
  }
  const [user, setUser] = useState(defaultUser)
  const [cookies, setCookie] = useCookies(['auth_token'])

  const fetchUser = async () => {
    try {
      const response = await api.get('auth/users/me/')
      console.log('Fetched user:', response.data) // Логируем ответ
      setUser({
        email: response.data.email,
        isDefault: false,
      }) // Устанавливаем пользователя
    } catch (err) {
      console.error('Fetch user error:', err) // Логируем ошибку
      //TODO добавить обработчкик 401
      setUser(defaultUser)
    }
  }

  useEffect(() => {
    fetchUser() // Загружаем пользователя при запуске приложения
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('auth/token/logout/')
      setCookie('auth_token', '', { path: '/' }) // Очистить куки
      setUser(defaultUser)
      toast.info('Logged out')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  return (
    <Router>
      <Header user={user} logout={handleLogout} />
      <Routes>
        <Route path="/" element={<Welcome user={user} />} />
        {/* <Route
          path="/profile"
          element={<Profile user={user} fetchUser={fetchUser} />}
        /> */}
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login setCookie={setCookie} user={user} fetchUser={fetchUser} />
          }
        />
        {/* <Route path="/verify/:token" element={<VerifyEmail />} /> */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  )
}

export default App
