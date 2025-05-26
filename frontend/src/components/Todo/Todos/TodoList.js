import Todo from './Todo'
import { ListGroup } from 'react-bootstrap'

function TodoList({ todo, deleteTodo, toggleTodo }) {
  return (
    <>
      {todo && todo.length > 0 ? (
        <ListGroup as="ol" numbered>
          {todo.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
          ))}
        </ListGroup>
      ) : (
        <>
          <br></br>
          <h3>Todo list is empty</h3>
        </>
      )}
    </>
  )
}

export default TodoList
