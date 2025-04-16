import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { api } from './api/axios'
import TodoApp from './components/Todo/TodoApp'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Profile from './components/User/Profile'
import Login from './components/User/Login'
import Register from './components/User/Register'
import VerifyEmail from './components/User/VerifyEmail'
import TermsAndConditions from './components/TermsAndConditions'
import PasswordReset from './components/User/PasswordReset'
import ImagesGallery from './components/Images-Gallery/ImagesGallery'

function App() {
  const defaultUser = {
    email: '',
    isDefault: true,
  }
  const [user, setUser] = useState(defaultUser)
  const [cookies, setCookie] = useCookies(['auth_token'])
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  const fetchUser = async (token = cookies.auth_token) => {
    if (!token || isFetchingUser) return
    setIsFetchingUser(true)
    try {
      const response = await api.get('auth/users/me/')
      setUser({
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        avatar: response.data.avatar,
        isDefault: false,
      })
    } catch (err) {
      console.error('Ошибка при запросе пользователя:', err)

      setUser(defaultUser)
    } finally {
      setIsFetchingUser(false)
    }
  }

  useEffect(() => {
    if (cookies.auth_token && user.isDefault && !isFetchingUser) {
      fetchUser()
    }
  }, [cookies.auth_token])

  const handleLogout = async () => {
    try {
      await api.post('auth/token/logout/')
      setCookie('auth_token', '', { path: '/' })
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
        {!user.isDefault && (
          <>
            <Route path="/todo" element={<TodoApp />} />
            <Route path="/images-gallery" element={<ImagesGallery />} />

            <Route
              path="/profile"
              element={<Profile user={user} fetchUser={fetchUser} />}
            />
          </>
        )}
        <Route path="/" element={<Welcome user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setCookie={setCookie} />} />
        <Route path="/activate/:uid/:token/" element={<VerifyEmail />} />
        <Route
          path="/password-reset/:uid/:token/"
          element={<PasswordReset />}
        />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <ToastContainer hideProgressBar position="top-center" />
    </Router>
  )
}

export default App
