import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import TodoApp from './components/Todo/TodoApp'
import Inbox from './components/Inbox/Inbox'
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
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Private urls */}
          <Route element={<PrivateRoute />}>
            <Route path="/todo" element={<TodoApp />} />
            <Route path="/images-gallery" element={<ImagesGallery />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route
              path="/inbox/:id"
              element={<Inbox key={window.location.pathname} />}
            />
            <Route
              path="/inbox/search/:email"
              element={<Inbox key={window.location.pathname} />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* public urls */}
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/activate/:uid/:token/" element={<VerifyEmail />} />
          <Route
            path="/password-reset/:uid/:token/"
            element={<PasswordReset />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
        <ToastContainer hideProgressBar position="top-center" />
      </AuthProvider>
    </Router>
  )
}

export default App
