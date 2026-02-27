import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent, updateEvent, disableEvent, registerInterest } from '../api/api'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import Spinner from '../components/Spinner'
import styles from './DetailPage.module.css'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [interested, setInterested] = useState(false)
  const [form, setForm] = useState({
    name: '', date: '', description: '', image: '', price: ''
  })

  async function load() {
    setLoading(true)
    try {
      const data = await getEvent(id)
      setEvent(data)
      setForm({
        name:        data.name || '',
        date:        data.date ? data.date.slice(0, 16) : '',
        description: data.description || '',
        image:       data.image || '',
        price:       data.price || '',
      })
    } catch {
      setEvent(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateEvent(id, {
        name:        form.name,
        date:        form.date || null,
        description: form.description || null,
        image:       form.image || null,
        category_id: null,
        price:       form.price || null,
      })
      setEvent(updated)
      setModalOpen(false)
    } catch {
      alert('Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDisable() {
    if (!confirm('¿Seguro que quieres deshabilitar este evento?')) return
    try {
      await disableEvent(id)
      navigate('/')
    } catch {
      alert('Error al deshabilitar el evento.')
    }
  }

  async function handleInterest() {
    try {
      await registerInterest(id)
      setInterested(true)
    } catch {
      alert('Error al registrar el interés.')
    }
  }

  if (loading) return <Spinner />

  if (!event) return (
    <div className={styles.notFound}>
      <p>Evento no encontrado.</p>
      <button className={styles.btnBack} onClick={() => navigate('/')}>← Volver</button>
    </div>
  )

  return (
    <div className={styles.page}>
      <button className={styles.backLink} onClick={() => navigate(-1)}>← Volver</button>

      <div className={styles.card}>
        <div className={styles.imgWrap}>
          <img
            src={event.image || ''}
            alt={event.name}
            onError={e => { e.target.src = 'https://placehold.co/900x380/e2e8f0/94a3b8?text=Sin+imagen' }}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{event.name}</h1>

          <div className={styles.meta}>
            {event.date && (
              <span className={styles.badge}>
                📅 {new Date(event.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}
              </span>
            )}
            {event.category && (
              <span className={styles.badge}>🏷️ {event.category}</span>
            )}
            {event.price && (
              <span className={`${styles.badge} ${styles.priceBadge}`}>
                💲{event.price}
              </span>
            )}
          </div>

          <p className={styles.desc}>{event.description || 'Sin descripción.'}</p>

          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => setModalOpen(true)}>
              ✏ Editar
            </button>
            <button className={styles.btnDisable} onClick={handleDisable}>
              Deshabilitar
            </button>
            <button
              className={`${styles.btnInterest} ${interested ? styles.btnInterestDone : ''}`}
              onClick={handleInterest}
              disabled={interested}
            >
              {interested ? '⭐ ¡Guardado!' : '☆ Me interesa'}
            </button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar Evento">
        <form onSubmit={handleSave}>
          <FormField label="Nombre">
            <input
              className="field-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Fecha">
            <input
              className="field-input"
              type="datetime-local"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              className="field-input"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </FormField>
          <FormField label="Imagen (URL)">
            <input
              className="field-input"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
            />
          </FormField>
          <FormField label="Precio">
            <input
              className="field-input"
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            />
          </FormField>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancelModal} onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSaveModal} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
