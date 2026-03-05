import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent, updateEvent, disableEvent, registerInterest, unregisterInterest, getCategories } from '../api/api'
import Modal from '../components/Modal'
import EventForm from '../components/EventForm'
import Spinner from '../components/Spinner'
import styles from './DetailPage.module.css'
import {useAuth} from "../context/AuthContext.jsx";

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [interested, setInterested] = useState(false)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '', date: '', description: '', image: '', price: '', category_id: ''
  })
  const {role} = useAuth()

  async function load() {
    setLoading(true)
    try {
      const [data, cats] = await Promise.all([
        getEvent(id),
        getCategories(),
      ])
      setCategories(cats)
      setEvent(data)
      setForm({
        name:        data.name || '',
        date:        data.date ? data.date.slice(0, 16) : '',
        description: data.description || '',
        image:       data.image || '',
        price:       data.price || '',
        category_id: data.category_id || '',
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
        category_id: form.category_id || null,
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
    if (interested) {
      const res = await unregisterInterest(id)
      console.log('unregister status:', res.status)
    } else {
      const res = await registerInterest(id)
      console.log('register status:', res.status)
    }
    setInterested(prev => !prev)
  } catch (err) {
    console.error('Error completo:', err)
    alert('Error al actualizar el interés.')
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
            {role === 'Admin' && (
                <button className={styles.btnEdit} onClick={() => setModalOpen(true)}>
                  ✏ Editar
                </button>
            )}
            {role === 'Admin' && (
                <button className={styles.btnDisable} onClick={handleDisable}>
                  Deshabilitar
                </button>
            )}
            {(role === 'Member') && (
                <button
                    className={`${styles.btnInterest} ${interested ? styles.btnInterestDone : ''}`}
                    onClick={handleInterest}
                >
                  {interested ? '⭐ ¡Guardado!' : '☆ Me interesa'}
                </button>
            )}
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar Evento">
        <EventForm
          form={form}
          setForm={setForm}
          categories={categories}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          saving={saving}
          submitLabel="Guardar"
        />
      </Modal>
    </div>
  )
}