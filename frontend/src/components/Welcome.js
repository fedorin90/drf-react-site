import React, { Container } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const jumbotronStyle = {
  padding: '2rem 1rem',
  marginBottom: '2rem',
  backgroundColor: '#e9ecef',
  borderRadius: '.3rem',
}

const Welcome = () => {
  const { user } = useContext(AuthContext)
  return (
    <Container style={jumbotronStyle} className="mt-3">
      <h1>Welcome</h1>
      {user.email ? (
        <p>
          Hi {user.email}. If you see this information you are already
          authorized.
        </p>
      ) : (
        <p>To view content please login</p>
      )}
    </Container>
  )
}

export default Welcome
