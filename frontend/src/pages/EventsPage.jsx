import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents, createEvent, getCategories } from '../api/api'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import Spinner from '../components/Spinner'
import styles from './EventsPage.module.css'

function setMinDate(ref) {
  if (!ref.current) return
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  ref.current.min = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export default function EventsPage() {
  const navigate = useNavigate()
  const [events, setEvents]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [saving, setSaving]       = useState(false)

  const dateRef = useRef(null)

  const [form, setForm] = useState({
    name: '', date: '', description: '', image: '', category_id: '', price: ''
  })

  async function load(p = 1) {
    setLoading(true)
    try {
      const json = await getEvents(p)
      setEvents(json.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  function openModal() {
    getCategories().then(setCategories).catch(() => {})
    setForm({ name: '', date: '', description: '', image: '', category_id: '', price: '' })
    setModalOpen(true)
    setTimeout(() => setMinDate(dateRef), 50)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) return alert('El nombre es obligatorio.')
    setSaving(true)
    try {
      await createEvent({
        name:        form.name,
        date:        form.date || null,
        description: form.description || null,
        image:       form.image || null,
        category_id: form.category_id || null,
        price:       form.price || null,
      })
      setModalOpen(false)
      load(1)
      setPage(1)
    } catch {
      alert('Error al crear el evento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Todos los eventos</h1>
        <button className={styles.btnAdd} onClick={openModal}>+ Añadir evento</button>
      </div>

      {loading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <p className={styles.empty}>No hay eventos disponibles.</p>
      ) : (
        <div className={styles.grid}>
          {events.map((ev, i) => (
            <div
              key={ev.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/event/${ev.id}`)}
            >
              <div className={styles.imgWrap}>
                <img
                  src={ev.image || ''}
                  alt={ev.name}
                  onError={e => { e.target.src = 'https://placehold.co/400x220/e2e8f0/94a3b8?text=Sin+imagen' }}
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{ev.name}</p>
                <p className={styles.cardDesc}>{ev.description || ''}</p>
                {ev.date && (
                  <span className={styles.badge}>
                    📅 {new Date(ev.date).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span className={styles.pageNum}>Página {page}</span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(p => p + 1)}
            disabled={events.length === 0}
          >
            Siguiente →
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Evento">
        <form onSubmit={handleCreate}>
          <FormField label="Nombre *">
            <input
              className="field-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre del evento"
              required
            />
          </FormField>
          <FormField label="Fecha">
            <input
              ref={dateRef}
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
              placeholder="Descripción del evento"
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
          <FormField label="Categoría">
            <select
              className="field-input"
              value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            >
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Precio">
            <input
              className="field-input"
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="0"
            />
          </FormField>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
