import { RiTodoFill, RiDeleteBin2Line } from 'react-icons/ri'
import { FaCheck } from 'react-icons/fa'
import styles from './Todo.module.css'

function Todo({ todo, deleteTodo, toggleTodo }) {
  return (
    <div
      className={`${styles.todo} ${
        todo.is_completed ? styles.completedTodo : ''
      }`}
    >
      <RiTodoFill className={styles.todoIcon} />
      <div className={styles.todoText}>{todo.text}</div>
      <RiDeleteBin2Line
        className={styles.deleteIcon}
        onClick={() => deleteTodo(todo.id)}
        style={{ fontSize: '40px' }}
      />
      <FaCheck
        className={styles.checkIcon}
        onClick={() => {
          toggleTodo(todo.id, todo.is_completed)
        }}
        style={{ fontSize: '40px' }}
      />
    </div>
  )
}

export default Todo
