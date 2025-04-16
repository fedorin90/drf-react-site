import { Container, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { LuListTodo } from 'react-icons/lu'
import { FaRegImages } from 'react-icons/fa'
import { MdOutlineForwardToInbox } from 'react-icons/md'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Nav from 'react-bootstrap/Nav'
import { ReactComponent as Logo } from '../images/logo.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end me-2">
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
              <Navbar.Text>
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
