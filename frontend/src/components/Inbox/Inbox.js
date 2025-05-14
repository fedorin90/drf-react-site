import { React, useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { api } from '../../api/axios'
import MessageDetail from './MessageDetail'
import Message from './Message'
import AuthContext from '../../context/AuthContext'

const Inbox = () => {
  const { user } = useContext(AuthContext)
  const [lastMessages, setLastMessages] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await api.get(`my-inbox/${user.id}/`)
        setLastMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchChats()
    const interval = setInterval(fetchChats, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h2 className="text-center m-5">Inbox</h2>
      <Container
        fluid="md"
        className="my-5 "
        style={{ height: '80vh', overflow: 'hidden' }}
      >
        <Card className="h-100">
          <Row className="h-100">
            {/* Sidebar */}
            {(!params || Object.keys(params).length === 0 || params.id) && (
              <>
                <Message
                  lastMessages={lastMessages}
                  chatID={parseInt(params.id)}
                />
                <MessageDetail
                  chatID={params.id}
                  key={window.location.pathname}
                />
              </>
            )}

            {params.email && (
              <>
                <Message searchRes={params.email} />
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
              </>
            )}
          </Row>
        </Card>
      </Container>
    </>
  )
}

export default Inbox
