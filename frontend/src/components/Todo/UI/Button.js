import styles from './Button.module.css'

function Button(propps) {
  const { children, disabled = false } = propps
  return (
    <button {...propps} className={styles.button} disabled={disabled}>
      {children}
    </button>
  )
}
export default Button
