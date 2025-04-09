import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import {
  Col,
  Row,
  Form,
  InputGroup,
  Button,
  Container,
  Image,
} from 'react-bootstrap'
import { api } from '../../api/axios'

const Profile = ({ user, fetchUser }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
    }
  }, [user])

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0])
  }
  const handleFirstNameChange = (e) => setFirstName(e.target.value)
  const handleLastNameChange = (e) => setLastName(e.target.value)

  const handleSubmit = async () => {
    try {
      const formData = {
        first_name: firstName,
        last_name: lastName,
        avatar: avatar,
      }
      await api.patch('auth/users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      fetchUser()
      toast.success('Profile updated!')
    } catch (error) {
      console.log(error)
      toast.error('Error updating profile:', error)
    }
  }

  const handlePasswordReset = async () => {
    try {
      await api.post('auth/users/reset_password/', { email: user.email })
      toast.info(
        'We have sent you an email with the link to reset your password.'
      )
    } catch (error) {
      toast.error('Error updating profile:', error)
    }
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col xs={4}>
          <h1>Profile</h1>
          <Image src={user.avatar} thumbnail />
          <Form.Label>Input a new avatar</Form.Label>
          <Form.Control type="file" onChange={handleAvatarChange} />
          <p />
          Email: {user.email}
          <p />
          <Form.Label>
            First name: {user.firstName || 'No first name'}
          </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Your new first name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </InputGroup>
          <Form.Label>Last name: {user.lastName || 'No last name'}</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Your new last name"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </InputGroup>
          <Button variant="outline-secondary" onClick={handleSubmit}>
            Save Changes
          </Button>
          <p />
          <Button variant="outline-secondary" onClick={handlePasswordReset}>
            Reset Password
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default Profile
