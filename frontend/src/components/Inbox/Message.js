import { React, useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, InputGroup, Form, Col } from 'react-bootstrap'
import { BiSearchAlt } from 'react-icons/bi'
import { IoIosArrowBack } from 'react-icons/io'

import { toast } from 'react-toastify'

import { api } from '../../api/axios'

import moment from 'moment'

import AuthContext from '../../context/AuthContext'

const Message = ({ lastMessages, searchRes, chatID }) => {
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [searchChat, setSearchChat] = useState({ email: searchRes || '' })

  const searchNewChat = async () => {
    try {
      setUsers([])
      const res = await api.get(`search/${searchChat.email}/`)
      setUsers(res.data)
      navigate(`/inbox/search/${searchChat.email}/`)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //  404
        toast.error('No users found. Please try another query.')
      } else {
        // others
        toast.error(error.message || 'Error searching for the user.')
      }
    }
  }

  useEffect(() => {
    searchRes && searchNewChat()
  }, [])

  return (
    <Col
      xs={12}
      md={5}
      xl={4}
      className="border-end overflow-auto"
      style={{ maxHeight: '100%', height: '100%' }}
    >
      <div className="position-relative px-3 py-2">
        <InputGroup className="my-3">
          <Form.Control
            type="text"
            placeholder="Search..."
            name="email"
            value={searchChat.email}
            onChange={(e) =>
              setSearchChat({
                ...searchChat,
                [e.target.name]: e.target.value,
              })
            }
          />
          <Button variant="primary" id="button-addon2" onClick={searchNewChat}>
            <BiSearchAlt />
          </Button>
        </InputGroup>
        {!searchRes ? (
          lastMessages.map((message) => (
            <Link
              to={`/inbox/${
                message.sender === user.id ? message.receiver : message.sender
              }/`}
              className="list-group-item list-group-item-action border-0 m-3"
              key={message.id}
            >
              <div
                className={`d-flex align-items-start ${
                  chatID === message.receiver || chatID === message.sender
                    ? 'bg-light'
                    : ''
                }`}
              >
                {message.sender !== user.id ? (
                  <img
                    src={message.sender_profile.avatar}
                    className="rounded-circle mr-1"
                    alt="sender_profile"
                    width={40}
                    height={40}
                  />
                ) : (
                  <img
                    src={message.receiver_profile.avatar}
                    className="rounded-circle mr-1"
                    alt="receiver_profile"
                    width={40}
                    height={40}
                  />
                )}
                <div className="flex-grow-1 ms-3">
                  <strong>
                    {message.sender === user.id &&
                      message.receiver_profile.email}
                    {message.sender !== user.id && message.sender_profile.email}
                  </strong>

                  <Card.Text>
                    {message.message.length > 22
                      ? message.message.substring(0, 22) + '...'
                      : message.message}
                  </Card.Text>
                  <div className="text-muted small text-nowrap ">
                    {moment
                      .utc(message.date)
                      .local()
                      .startOf('seconds')
                      .fromNow()}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>
            {' '}
            <Button variant="primary" onClick={() => navigate('/inbox')}>
              <IoIosArrowBack /> Back to chats
            </Button>
            {users.map((searchResult) => (
              <Link
                to={`/inbox/${
                  searchResult.id === user.id ? '' : searchResult.id
                }/`}
                className="list-group-item list-group-item-action border-0 m-3 "
                key={searchResult.id}
              >
                <div className="d-flex align-items-start">
                  <img
                    src={searchResult.avatar}
                    className="rounded-circle mr-1"
                    alt="Vanessa Tucker"
                    width={40}
                    height={40}
                  />

                  <div className="flex-grow-1 ms-3">
                    <strong>
                      {searchResult.id !== user.id && searchResult.email}
                    </strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Col>
  )
}

export default Message
