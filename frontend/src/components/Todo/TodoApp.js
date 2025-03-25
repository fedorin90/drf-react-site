import { useState } from 'react'
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
import { v4 as uuidv4 } from 'uuid'
import TodoList from './Todos/TodoList'
import styles from './Todos/Todo.module.css'

function Todo() {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([])

  const addTodoHandler = (text) => {
    const newTodo = {
      text: text,
      isCompleted: false,
      id: uuidv4(),
    }
    setTodos([...todos, newTodo])
  }

  const deleteTodoHandler = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()
    addTodoHandler(inputValue)
    setInputValue('')
  }

  const toggleTodoHandler = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : { ...todo }
      )
    )
  }

  const resetTodoHandler = () => setTodos([])

  const deleteCompletedTodosHandler = () => {
    setTodos(todos.filter((todo) => !todo.isCompleted))
  }

  const completedTodoCount = todos.filter((todo) => todo.isCompleted).length

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
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default Todo
