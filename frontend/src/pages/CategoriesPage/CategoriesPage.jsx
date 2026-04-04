import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, disableCategory, getTicketTypes, createTicketType } from '../../services'
import Modal from '../../components/Modal/Modal'
import FormField from '../../components/FormField/FormField'
import Spinner from '../../components/Spinner/Spinner'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const [tab, setTab] = useState('categories')

  // ── Categorías de eventos ──
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [modalCatOpen, setModalCatOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [savingCat, setSavingCat] = useState(false)
  const [formCat, setFormCat] = useState({ name: '', description: '' })

  // ── Tipos de boleta ──
  const [ticketTypes, setTicketTypes] = useState([])
  const [loadingTT, setLoadingTT] = useState(true)
  const [modalTTOpen, setModalTTOpen] = useState(false)
  const [savingTT, setSavingTT] = useState(false)
  const [formTT, setFormTT] = useState({ name: '' })

  async function loadCategories() {
    setLoadingCats(true)
    try { setCategories(await getCategories()) }
    finally { setLoadingCats(false) }
  }

  async function loadTicketTypes() {
    setLoadingTT(true)
    try { setTicketTypes(await getTicketTypes()) }
    finally { setLoadingTT(false) }
  }

  useEffect(() => { loadCategories() }, [])
  useEffect(() => { if (tab === 'tickets') loadTicketTypes() }, [tab])

  // ── Handlers categorías ──
  function openAddCat() {
    setEditingId(null)
    setFormCat({ name: '', description: '' })
    setModalCatOpen(true)
  }

  function openEditCat(cat) {
    setEditingId(cat.id)
    setFormCat({ name: cat.name, description: cat.description || '' })
    setModalCatOpen(true)
  }

  async function handleSaveCat(e) {
    e.preventDefault()
    if (!formCat.name.trim()) return alert('El nombre es obligatorio.')
    setSavingCat(true)
    try {
      const body = { name: formCat.name, description: formCat.description || null }
      if (editingId) {
        await updateCategory(editingId, body)
      } else {
        await createCategory(body)
      }
      setModalCatOpen(false)
      loadCategories()
    } catch {
      alert('Error al guardar la categoría.')
    } finally {
      setSavingCat(false)
    }
  }

  async function handleDisable(id) {
    if (!confirm('¿Seguro que quieres deshabilitar esta categoría?')) return
    try {
      await disableCategory(id)
      loadCategories()
    } catch {
      alert('Error al deshabilitar la categoría.')
    }
  }

  // ── Handlers tipos de boleta ──
  async function handleSaveTT(e) {
    e.preventDefault()
    if (!formTT.name.trim()) return alert('El nombre es obligatorio.')
    setSavingTT(true)
    try {
      await createTicketType({ name: formTT.name.trim() })
      setModalTTOpen(false)
      setFormTT({ name: '' })
      loadTicketTypes()
    } catch {
      alert('Error al crear el tipo de boleta.')
    } finally {
      setSavingTT(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>
          {tab === 'categories' ? 'Categorías' : 'Tipos de boleta'}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className={styles.tabs}>
            <button
              className={tab === 'categories' ? `${styles.tabBtn} ${styles.tabActive}` : styles.tabBtn}
              onClick={() => setTab('categories')}
            >
              Categorías
            </button>
            <button
              className={tab === 'tickets' ? `${styles.tabBtn} ${styles.tabActive}` : styles.tabBtn}
              onClick={() => setTab('tickets')}
            >
              Tipos de boleta
            </button>
          </div>
          {tab === 'categories'
            ? <button className={styles.btnAdd} onClick={openAddCat}>+ Añadir categoría</button>
            : <button className={styles.btnAdd} onClick={() => { setFormTT({ name: '' }); setModalTTOpen(true) }}>+ Añadir tipo</button>
          }
        </div>
      </div>

      {/* ── Tab categorías ── */}
      {tab === 'categories' && (
        loadingCats ? <Spinner /> : categories.length === 0 ? (
          <p className={styles.empty}>No hay categorías registradas.</p>
        ) : (
          <div className={styles.grid}>
            {categories.map((cat, i) => (
              <div key={cat.id} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>🏷️</span>
                  <div>
                    <p className={styles.cardName}>{cat.name}</p>
                    <p className={styles.cardDesc}>{cat.description || 'Sin descripción'}</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnEdit} onClick={() => openEditCat(cat)}>✏ Editar</button>
                  <button className={styles.btnDisable} onClick={() => handleDisable(cat.id)}>Deshabilitar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Tab tipos de boleta ── */}
      {tab === 'tickets' && (
        loadingTT ? <Spinner /> : ticketTypes.length === 0 ? (
          <p className={styles.empty}>No hay tipos de boleta registrados.</p>
        ) : (
          <div className={styles.grid}>
            {ticketTypes.map((tt, i) => (
              <div key={tt.id} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>🎟️</span>
                  <div>
                    <p className={styles.cardName}>{tt.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Modal categoría ── */}
      <Modal
        open={modalCatOpen}
        onClose={() => setModalCatOpen(false)}
        title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSaveCat}>
          <FormField label="Nombre *">
            <input
              className="field-input"
              value={formCat.name}
              onChange={e => setFormCat(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la categoría"
              required
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              className="field-input"
              rows={3}
              value={formCat.description}
              onChange={e => setFormCat(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción opcional"
            />
          </FormField>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setModalCatOpen(false)}>Cancelar</button>
            <button type="submit" className={styles.btnSave} disabled={savingCat}>
              {savingCat ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal tipo de boleta ── */}
      <Modal
        open={modalTTOpen}
        onClose={() => setModalTTOpen(false)}
        title="Nuevo tipo de boleta"
      >
        <form onSubmit={handleSaveTT}>
          <FormField label="Nombre *">
            <input
              className="field-input"
              value={formTT.name}
              onChange={e => setFormTT({ name: e.target.value })}
              placeholder="Ej: VIP, General, Platino"
              required
            />
          </FormField>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setModalTTOpen(false)}>Cancelar</button>
            <button type="submit" className={styles.btnSave} disabled={savingTT}>
              {savingTT ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}