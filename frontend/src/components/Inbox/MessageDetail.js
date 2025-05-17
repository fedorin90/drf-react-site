import { React, useState, useEffect, useContext, useRef } from 'react'
import { Row, Col, Form, InputGroup, Button, Card } from 'react-bootstrap'
import moment from 'moment'
import { api } from '../../api/axios'
import AuthContext from '../../context/AuthContext'

function MessageDetail({ chatID }) {
  const socketRef = useRef(null)
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [contactProfile, setContactProfile] = useState(null)
  const [newMessage, setNewMessage] = useState({ message: '' })
  const messagesEndRef = useRef(null)
  const hasScrolledRef = useRef(false)

  async function fetchMessages() {
    try {
      if (chatID) {
        const contactData = await api.get(`auth/users/${chatID}/`)
        setContactProfile({
          avatar: contactData.data.avatar,
          email: contactData.data.email,
        })
        const res = await api.get(`get-messages/${user.id}/${chatID}/`)
        setMessages(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (chatID) {
      fetchMessages()
    }
  }, [chatID])

  useEffect(() => {
    if (!chatID) return

    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const baseWs =
      process.env.REACT_APP_WS_SERVER ||
      `${wsScheme}://${window.location.hostname}:8000`
    const socketUrl = `${baseWs}/ws/users/${user.id}/${chatID}/`
    console.log(socketUrl)

    socketRef.current = new WebSocket(socketUrl)

    socketRef.current.onopen = () => {
      console.log('WebSocket connected')
    }

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)

      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data])
        setTimeout(() => messagesEndRef.current?.scrollIntoView(), 100)
      }
    }

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      socketRef.current?.close()
    }
  }, [chatID])

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView()
      hasScrolledRef.current = true
    }
  }, [messages])

  const sendNewMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          user: user.id,
          sender: user.id,
          receiver: chatID,
          message: newMessage.message,
        })
      )

      setNewMessage({ message: '' })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendNewMessage()
    }
  }

  return (
    <>
      {/* Chat Area */}
      {chatID && contactProfile ? (
        <>
          <Col
            xs={12}
            md={7}
            xl={8}
            className="d-flex flex-column"
            style={{ height: '100%' }}
          >
            <div className="py-2 px-4 border-bottom ">
              <div className="d-flex align-items-center py-1">
                <img
                  src={contactProfile.avatar}
                  className="rounded-circle mr-1"
                  alt={contactProfile.email}
                  width={40}
                  height={40}
                />
                <div className="flex-grow-1 ps-3">
                  <strong>{contactProfile.email}</strong>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow-1 overflow-auto p-3">
              {messages.map((m, index) =>
                m.sender === user.id ? (
                  <Row className="pb-4 justify-content-end" key={index}>
                    <Col xs="auto" className="text-end">
                      <img
                        src={user?.avatar}
                        className="rounded-circle"
                        alt="You"
                        width={40}
                        height={40}
                      />
                      <div className="text-muted small text-nowrap mt-2">
                        {moment
                          .utc(m.date)
                          .local()
                          .startOf('seconds')
                          .fromNow()}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className="bg-success text-white rounded py-2 px-3">
                        <div className="fw-bold">You</div>
                        {m.message}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row className="pb-4" key={index}>
                    <Col xs="auto">
                      <img
                        src={contactProfile?.avatar}
                        className="rounded-circle"
                        alt="Another person"
                        width={40}
                        height={40}
                      />
                      <div className="text-muted small text-nowrap mt-2">
                        {moment
                          .utc(m.date)
                          .local()
                          .startOf('seconds')
                          .fromNow()}
                      </div>
                    </Col>
                    <Col>
                      <div className="bg-light rounded py-2 px-3">
                        <div className="fw-bold">{contactProfile?.email}</div>
                        {m.message}
                      </div>
                    </Col>
                  </Row>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <div className="border-top p-3">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type your message"
                  value={newMessage.message}
                  name="message"
                  onKeyDown={handleKeyDown}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <Button onClick={sendNewMessage} variant="primary">
                  Send
                </Button>
              </InputGroup>
            </div>
          </Col>
        </>
      ) : (
        <Col
          xs={12}
          lg={7}
          xl={8}
          className="d-flex align-items-center justify-content-center"
        >
          <strong>
            Select a chat to start messaging or search a new chat.
          </strong>
        </Col>
      )}
    </>
  )
}

export default MessageDetail
