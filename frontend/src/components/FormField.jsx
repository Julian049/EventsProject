import styles from './FormField.module.css'

export default function FormField({ label, children }) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}
