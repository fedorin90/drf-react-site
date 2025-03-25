import Todo from './Todo'

function TodoList({ todo, deleteTodo, toggleTodo }) {
  return (
    <>
      {todo && todo.length > 0 ? (
        <>
          {todo.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
            />
          ))}
        </>
      ) : (
        <h2>Todo list is empty</h2>
      )}
    </>
  )
}

export default TodoList
