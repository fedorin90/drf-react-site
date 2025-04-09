import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../Spinner'

import {
  Container,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  ButtonGroup,
} from 'react-bootstrap'
import { RiDeleteBin2Line, RiRefreshLine } from 'react-icons/ri'
import TodoList from './Todos/TodoList'
import styles from './Todos/Todo.module.css'
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
        const res = await fetchTodos()
        setTodos(res || [])
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
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
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
    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col xs={4} xl={6} xxl={8}>
          <h1 className="text-center">Todo App</h1>
          <br />
          <Form onSubmit={onSubmitHandler}>
            <InputGroup className="mb-3 ms-1">
              <Form.Control
                size="lg"
                type="text"
                placeholder="Enter new todo"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              <Button
                className={styles.todoButton}
                variant="none"
                type="submit"
                id="button-addon2"
              >
                Submit
              </Button>
            </InputGroup>
          </Form>
          {todos.length > 0 && (
            <ButtonGroup className="ms-1" size="lg" aria-label="Basic example">
              <Button onClick={resetTodoHandler} variant="danger">
                <RiRefreshLine />
              </Button>
              <Button
                onClick={deleteCompletedTodosHandler}
                disabled={!completedTodoCount}
                variant="warning"
              >
                <RiDeleteBin2Line />
              </Button>
            </ButtonGroup>
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

              {completedTodoCount > 0 && (
                <h2>{`You have completed ${completedTodoCount} ${
                  completedTodoCount > 1 ? 'todos' : 'todo'
                }`}</h2>
              )}
            </>
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default Todo
