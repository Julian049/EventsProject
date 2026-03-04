import {useState} from 'react'
import {register} from '../api/api'
import {useNavigate} from 'react-router-dom'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({name: '', email: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Por favor completa todos los campos.')
            return
        }

        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        setLoading(true)
        try {
            await register({name: form.name, email: form.email, password: form.password})
            navigate('/login')
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.root}>
            {/* Panel izquierdo decorativo */}
            <div className={styles.panel}>
                <div className={styles.panelInner}>
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
                        <h1 className={styles.title}>Crear cuenta</h1>
                        <p className={styles.sub}>Únete a la plataforma</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Nombre completo</label>
                            <input
                                className={styles.input}
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                                placeholder="Tu nombre"
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Correo electrónico</label>
                            <input
                                className={styles.input}
                                type="email"
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
                                    autoComplete="new-password"
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
                            {loading ? <span className={styles.spinner}/> : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className={styles.hint}>
                        ¿Ya tienes una cuenta?{' '}
                        <button className={styles.linkBtn} onClick={() => navigate('/login')}>
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}