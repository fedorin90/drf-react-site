import { Container, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { LuListTodo } from 'react-icons/lu'
import { FaRegImages } from 'react-icons/fa'
import { MdOutlineForwardToInbox } from 'react-icons/md'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }
  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/img/logo.svg"
            width="200"
            height="100"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {user.isDefault ? (
            <Navbar.Text>Not signed in</Navbar.Text>
          ) : (
            <>
              <Nav className="me-auto">
                <Nav.Link href="/todo" style={{ fontSize: '20px' }}>
                  <LuListTodo />
                  Todo
                </Nav.Link>
                <Nav.Link href="/images-gallery" style={{ fontSize: '20px' }}>
                  <FaRegImages /> Images Gallery
                </Nav.Link>
                <Nav.Link href="/inbox" style={{ fontSize: '20px' }}>
                  <MdOutlineForwardToInbox /> Inbox
                </Nav.Link>
              </Nav>
              <Navbar.Text className="me-2">
                Signed in as: <a href="/profile">{user.email}</a>
              </Navbar.Text>
            </>
          )}
        </Navbar.Collapse>
        <ButtonGroup aria-label="auth func">
          {user.isDefault ? (
            <>
              <Button href="/login" variant="secondary">
                Log in
              </Button>
              <Button href="/register" variant="secondary">
                Create account
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} variant="secondary">
              Log out
            </Button>
          )}
        </ButtonGroup>
      </Container>
    </Navbar>
  )
}

export default Header
