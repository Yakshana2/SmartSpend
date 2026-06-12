import styles from './Modal.module.css'

export default function Modal({ title, children, onClose }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
