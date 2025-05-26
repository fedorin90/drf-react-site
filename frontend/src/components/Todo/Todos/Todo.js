import { RiDeleteBin2Line } from 'react-icons/ri'
import { FaCheck } from 'react-icons/fa'
import { ListGroup, ToggleButton, Button } from 'react-bootstrap'

function Todo({ todo, deleteTodo, toggleTodo }) {
  return (
    <ListGroup.Item
      as="li"
      variant={todo.is_completed ? 'dark' : 'light'}
      className="d-flex justify-content-between align-items-center fs-3"
    >
      <span className="text-break mx-1">{todo.text}</span>
      <ToggleButton
        className="ms-auto me-2"
        id={`toggle-check-${todo.id}`}
        type="checkbox"
        variant="outline-primary"
        checked={todo.is_completed}
        value="1"
        onChange={() => {
          toggleTodo(todo.id, todo.is_completed)
        }}
      >
        <FaCheck />
      </ToggleButton>
      <Button
        onClick={() => deleteTodo(todo.id)}
        className="ms-end"
        variant="outline-danger"
      >
        {' '}
        <RiDeleteBin2Line />
      </Button>
    </ListGroup.Item>
  )
}

export default Todo
