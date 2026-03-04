import {useState} from 'react'
import {login} from '../api/api'
import {useNavigate} from 'react-router-dom'
import styles from './LoginPage.module.css'
import {useAuth} from '../context/AuthContext.jsx'

export default function LoginPage({onLogin}) {
    const navigate = useNavigate()
    const [form, setForm] = useState({email: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const {refreshRole} = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!form.email.trim() || !form.password.trim()) {
            setError('Por favor completa todos los campos.')
            return
        }

        setLoading(true)
        try {
            const data = await login({email: form.email, password: form.password})

            localStorage.setItem('token', data.token)
            refreshRole()
            if (onLogin) onLogin()
            navigate('/')
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.root}>
            {/* Panel izquierdo simplificado */}
            <div className={styles.panel}>
                <div className={styles.panelInner}>
                    {/* Solo queda la marca y la animación */}
                    <span className={styles.panelBrand} style={{fontSize: '2.5rem', color: 'white'}}>
            ◈ Eventos
          </span>

                    <div className={styles.dots}>
                        {[...Array(12)].map((_, i) => (
                            <span
                                key={i}
                                className={styles.dot}
                                style={{animationDelay: `${i * 0.12}s`}}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Panel derecho (Formulario) */}
            <div className={styles.formSide}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1 className={styles.title}>Iniciar sesión</h1>
                        <p className={styles.sub}>Bienvenido de vuelta</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Correo electrónico</label>
                            <input
                                className={styles.input}
                                type="text"
                                value={form.email}
                                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                                placeholder="tucorreo@ejemplo.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Contraseña</label>
                            <div className={styles.passWrap}>
                                <input
                                    className={styles.input}
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({...f, password: e.target.value}))}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPass(v => !v)}
                                    tabIndex={-1}
                                    aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPass ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <span>⚠ {error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.btnSubmit}
                            disabled={loading}
                        >
                            {loading ? <span className={styles.spinner}/> : 'Entrar'}
                        </button>

                        <button
                            type="button"
                            className={styles.btnGuest}
                            onClick={() => {
                                sessionStorage.setItem('guest', 'true')
                                navigate('/')
                            }}
                        >
                            Acceder como invitado
                        </button>
                    </form>

                    <p className={styles.hint}>
                        ¿No tienes una cuenta?{' '}
                        <button className={styles.linkBtn} onClick={() => navigate('/register')}>
                            Regístrate
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}