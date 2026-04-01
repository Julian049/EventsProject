import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateUser, deleteUser } from '../../services'
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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUser(id)
      localStorage.removeItem('token')
      sessionStorage.removeItem('guest')
      navigate('/login', { replace: true })
    } catch {
      setConfirmDelete(false)
      setError('Error al eliminar la cuenta.')
    } finally {
      setDeleting(false)
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

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1.5px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#991b1b',
              border: '1.5px solid #fca5a5',
              borderRadius: '10px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Eliminar cuenta
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            padding: '2rem 2.25rem',
            width: '100%',
            maxWidth: '380px',
            animation: 'fadeUp 0.3s ease both',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>
              ¿Eliminar cuenta?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Esta acción es irreversible. Tu cuenta y todos tus datos serán eliminados permanentemente.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                style={{
                  padding: '0.6rem 1.2rem',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  background: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '0.6rem 1.4rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  opacity: deleting ? 0.6 : 1,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}