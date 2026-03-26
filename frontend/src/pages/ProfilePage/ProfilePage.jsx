import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../services'
import FormField from '../../components/FormField/FormField'
import styles from '../LoginPage/LoginPage.module.css'

function getDataFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return {}
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch { return {} }
}

export default function ProfilePage() {
  const navigate  = useNavigate()
  const { id, email } = getDataFromToken()

  const [form, setForm]     = useState({ name: '', email: email || '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.name.trim() && !form.email.trim() && !form.password.trim()) {
      setError('Completa al menos un campo para actualizar.')
      return
    }
    if (form.password && form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setSaving(true)
    try {
      const body = { role: 'Member' }
      if (form.name.trim())     body.name     = form.name.trim()
      if (form.email.trim())    body.email    = form.email.trim()
      if (form.password.trim()) body.password = form.password.trim()

      await updateUser(id, body)
      setSuccess(true)
      setForm(f => ({ ...f, password: '' }))
    } catch {
      setError('Error al actualizar los datos.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.formSide} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Mi perfil</h1>
          <p className={styles.sub}>Actualiza tu información</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nuevo nombre</label>
            <input
              className={styles.input}
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Tu nombre"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nuevo correo</label>
            <input
              className={styles.input}
              type="text"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nueva contraseña</label>
            <div className={styles.passWrap}>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
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

          {success && (
            <div className={styles.errorBox} style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}>
              <span>✓ Datos actualizados correctamente.</span>
            </div>
          )}

          <button type="submit" className={styles.btnSubmit} disabled={saving}>
            {saving ? <span className={styles.spinner} /> : 'Guardar cambios'}
          </button>

          <button type="button" className={styles.btnGuest} onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  )
}