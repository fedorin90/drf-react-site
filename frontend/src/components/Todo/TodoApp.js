import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../Spinner'

import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Card,
  InputGroup,
  ButtonGroup,
} from 'react-bootstrap'
import { MdOutlineDeleteForever, MdDoneOutline } from 'react-icons/md'
import TodoList from './Todos/TodoList'
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  deleteCompletedTodos,
} from '../../api/todoService'

function Todo() {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSavedTodos = async () => {
      setLoading(true)
      try {
        let res = await fetchTodos()

        setTodos(
          res.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) ||
            []
        )
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    getSavedTodos()
  }, [])

  const addTodoHandler = async (text) => {
    try {
      const newTodo = await createTodo(text)
      setTodos([...todos, newTodo])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteTodoHandler = (id) => {
    try {
      deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()
    addTodoHandler(inputValue)
    setInputValue('')
  }

  const toggleTodoHandler = async (id, isCompleted) => {
    const updatedTodo = await updateTodo(id, !isCompleted)
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    )
  }

  const resetTodoHandler = () => {
    try {
      deleteAllTodos()
      setTodos([])
      toast.success('All todos successfully deleted')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCompletedTodosHandler = () => {
    try {
      deleteCompletedTodos()
      toast.success('Completed todos deleted successfully')
      setTodos(todos.filter((todo) => !todo.is_completed))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completedTodoCount = todos.filter((todo) => todo.is_completed).length

  return (
    <>
      <h2 className="text-center m-5">Todo</h2>
      <Container
        fluid="md"
        className="my-5 "
        style={{ height: '80vh', overflow: 'hidden' }}
      >
        <Card className="h-100">
          <Row className="h-100">
            <Col></Col>
            <Col xs={12} md={10} xl={9} className="overflow-auto">
              <div className="position-relative px-3 py-2">
                <Form onSubmit={onSubmitHandler}>
                  <InputGroup className="my-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter new todo"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      required
                    />
                    <Button variant="primary" id="button-addon2" type="submit">
                      Submit
                    </Button>
                  </InputGroup>
                </Form>
              </div>

              {todos.length > 0 && (
                <div className="d-flex justify-content-center">
                  <ButtonGroup className="mb-4">
                    <Button onClick={resetTodoHandler} variant="danger">
                      Remove all <MdOutlineDeleteForever />
                    </Button>
                    <Button
                      onClick={deleteCompletedTodosHandler}
                      disabled={!completedTodoCount}
                      variant="warning"
                    >
                      Remove completed <MdDoneOutline />
                    </Button>
                  </ButtonGroup>
                </div>
              )}
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <TodoList
                    todo={todos}
                    deleteTodo={deleteTodoHandler}
                    toggleTodo={toggleTodoHandler}
                  />
                  <br></br>

                  {completedTodoCount > 0 && (
                    <h3>{`You have completed ${completedTodoCount} ${
                      completedTodoCount > 1 ? 'todos' : 'todo'
                    }`}</h3>
                  )}
                </>
              )}
            </Col>
            <Col></Col>
          </Row>
        </Card>
      </Container>
    </>
  )
}

export default Todo
