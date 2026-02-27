import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <span className={styles.brand} onClick={() => navigate('/')}>
        ◈ Eventos
      </span>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Categorías
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Reporte
        </NavLink>
      </nav>
    </header>
  )
}
