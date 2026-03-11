import {NavLink, useNavigate} from 'react-router-dom'
import styles from './Navbar.module.css'
import {useAuth} from '../context/AuthContext.jsx'

export default function Navbar() {
    const navigate = useNavigate()
    const {role} = useAuth()
    const token = localStorage.getItem('token')

    function handleLogout() {
        localStorage.removeItem('token')
        sessionStorage.removeItem('guest')
        navigate('/login')
    }

    return (
        <header className={styles.header}>
      <span className={styles.brand} onClick={() => navigate('/')}>
        ◈ Eventos
      </span>
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    end
                    className={({isActive}) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    }
                >
                    Inicio
                </NavLink>
                {token && role === 'Admin' && (
                    <NavLink
                        to="/categories"
                        className={({isActive}) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                    >
                        Categorías
                    </NavLink>
                )}

                {token && role === 'Admin' && (
                    <NavLink
                        to="/report"
                        className={({isActive}) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                    >
                        Reporte
                    </NavLink>
                )}

                {token && role === 'Member' && (
                    <NavLink
                        to="/favorites"
                        className={({isActive}) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                    >
                        Mis favoritos
                    </NavLink>
                )}

                {token && role === 'Member' && (
                    <NavLink
                        to="/profile"
                        className={({isActive}) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                    >
                        Mi perfil
                    </NavLink>
                )}

                {token
                    ? <button className={styles.btnLogin} onClick={handleLogout}>Cerrar sesión</button>
                    : <button className={styles.btnLogin} onClick={() => navigate('/login')}>Iniciar sesión</button>
                }
            </nav>
        </header>
    )
}