import React, { Container } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { LuListTodo } from 'react-icons/lu'
import { FaRegImages } from 'react-icons/fa'
import { MdOutlineForwardToInbox } from 'react-icons/md'

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
        <>
          <p>
            Hi <strong>{user.email}</strong>,
          </p>
          <p>
            This is a full-stack web application built with{' '}
            <strong>Django REST Framework</strong> and <strong>React</strong>.
            It was created for educational purposes and as a portfolio project
            to demonstrate my skills in backend and frontend development.
          </p>

          <h2>Features</h2>
          <ul>
            <li>
              <h3>
                <LuListTodo /> Todo App
              </h3>
              <ul>
                <li>Add, edit, and delete tasks</li>
                <li>Mark tasks as completed</li>
                <li>Store tasks per user</li>
              </ul>
            </li>
            <li>
              <h3>
                <FaRegImages /> Image Gallery
              </h3>
              <ul>
                <li>Search for images via the Unsplash API</li>
                <li>Save selected images to your personal gallery</li>
                <li>View your saved collection</li>
              </ul>
            </li>
            <li>
              <h3>
                <MdOutlineForwardToInbox /> Chat App
              </h3>
              <ul>
                <li>Real-time chat using WebSocket</li>
                <li>Built with Django Channels and React</li>
              </ul>
            </li>
          </ul>

          <p>
            <strong>Source code: </strong>
            <a
              href="https://github.com/fedorin90/drf-react-site"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>
          </p>
        </>
      ) : (
        <p>To view content please login</p>
      )}
    </Container>
  )
}

export default Welcome
