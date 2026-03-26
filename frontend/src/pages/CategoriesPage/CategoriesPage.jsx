import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, disableCategory } from '../../services'
import Modal from '../../components/Modal/Modal'
import FormField from '../../components/FormField/FormField'
import Spinner from '../../components/Spinner/Spinner'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState({ name: '', description: '' })

  async function load() {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditingId(null)
    setForm({ name: '', description: '' })
    setModalOpen(true)
  }

  function openEdit(cat) {
    setEditingId(cat.id)
    setForm({ name: cat.name, description: cat.description || '' })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return alert('El nombre es obligatorio.')
    setSaving(true)
    try {
      const body = { name: form.name, description: form.description || null }
      if (editingId) {
        await updateCategory(editingId, body)
      } else {
        await createCategory(body)
      }
      setModalOpen(false)
      load()
    } catch {
      alert('Error al guardar la categoría.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDisable(id) {
    if (!confirm('¿Seguro que quieres deshabilitar esta categoría?')) return
    try {
      await disableCategory(id)
      load()
    } catch {
      alert('Error al deshabilitar la categoría.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Categorías</h1>
        <button className={styles.btnAdd} onClick={openAdd}>+ Añadir categoría</button>
      </div>

      {loading ? (
        <Spinner />
      ) : categories.length === 0 ? (
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
                <button className={styles.btnEdit} onClick={() => openEdit(cat)}>✏Editar</button>
                <button className={styles.btnDisable} onClick={() => handleDisable(cat.id)}>Deshabilitar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSave}>
          <FormField label="Nombre *">
            <input
              className="field-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la categoría"
              required
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              className="field-input"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción opcional"
            />
          </FormField>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
