import { useState, useContext } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { Container, Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import AuthContext from '../../context/AuthContext'
import { api, loginWithGoogle } from '../../api/axios'

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const style = {
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '20px 0',
  },
  line: {
    flex: 1,
    borderTop: '1px solid #ccc',
    margin: '0 10px',
  },
}

const Login = () => {
  const { setCookie } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('auth/token/login/', {
        email,
        password,
      })

      const token = response.data.auth_token
      setCookie('auth_token', token, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: false,
        sameSite: 'Strict',
      })

      toast.success(`Login successfull! Welcome, ${email}`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = await loginWithGoogle(credentialResponse.credential)
      await setCookie('auth_token', token, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: false,
        sameSite: 'Strict',
      })
      navigate('/')
      toast.success(`Login successfull! Welcome!`)
    } catch (error) {
      toast.error(error || 'Something went wrong, login failed')
    }
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col xs={4}>
          <h1>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroup.Text
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <p />
            <Button variant="primary" type="submit" style={{ width: '100%' }}>
              Login
            </Button>
            <p />
            <Form.Text>
              Don't have an account? <a href="/register">Sign up</a>
              <div style={style.divider}>
                <div style={style.line}></div>
                OR
                <div style={style.line}></div>
              </div>
            </Form.Text>
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin onSuccess={handleGoogleSuccess} />
            </GoogleOAuthProvider>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default Login
