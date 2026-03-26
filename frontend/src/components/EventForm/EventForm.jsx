// src/components/EventForm.jsx
import { useRef, useEffect } from 'react'
import FormField from '../FormField/FormField'

function setMinDate(ref) {
  if (!ref.current) return
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  ref.current.min = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export default function EventForm({ form, setForm, categories = [], onSubmit, onCancel, saving, submitLabel = 'Guardar' }) {
  const dateRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setMinDate(dateRef), 50)
  }, [])

  return (
    <form onSubmit={onSubmit}>
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

      {/* Solo se muestra si se pasan categorías (crear), se omite en editar si no aplica */}
      {categories.length > 0 && (
        <FormField label="Categoría">
          <select
            className="field-input"
            value={form.category_id || ''}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
          >
            <option value="">Sin categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>
      )}

      <FormField label="Precio">
        <input
          className="field-input"
          type="number"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          placeholder="0"
        />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '0.55rem 1.2rem', border: '1.5px solid var(--border)', borderRadius: '10px', background: 'white', fontWeight: 600, fontSize: '0.875rem' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: '0.55rem 1.4rem', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}