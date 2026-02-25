import '../styles/styles.css'
import { API_BASE } from '../api/config.js'

const API_URL = `${API_BASE}/category`
const container = document.getElementById('categories-container')

let editingId = null

async function loadCategories() {
  try {
    const res = await fetch(API_URL)
    const categories = await res.json()
    renderCategories(categories)
  } catch (err) {
    container.innerHTML = '<p>Error cargando categorías</p>'
    console.error(err)
  }
}

function renderCategories(categories) {
  container.innerHTML = ''

  if (categories.length === 0) {
    container.innerHTML = "<p style='padding: 20px'>No hay categorías registradas.</p>"
    return
  }

  categories.forEach(category => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <div class="card-content">
        <div class="card-title">${category.name}</div>
        <div class="card-desc">${category.description || 'Sin descripción'}</div>
        <div class="card-actions">
          <button class="btn-edit" data-id="${category.id}" data-name="${category.name}" data-desc="${category.description || ''}">✏️ Editar</button>
          <button class="btn-disable" data-id="${category.id}">🚫 Deshabilitar</button>
        </div>
      </div>
    `
    card.querySelector('.btn-edit').addEventListener('click', (e) => {
      const btn = e.currentTarget
      openEditModal(btn.dataset.id, btn.dataset.name, btn.dataset.desc)
    })
    card.querySelector('.btn-disable').addEventListener('click', (e) => {
      disableCategory(e.currentTarget.dataset.id)
    })
    container.appendChild(card)
  })
}

function openAddModal() {
  editingId = null
  document.getElementById('modal-title').textContent = 'Nueva Categoría'
  document.getElementById('modal-save-btn').textContent = 'Crear'
  document.getElementById('c-name').value = ''
  document.getElementById('c-description').value = ''
  document.getElementById('category-modal').classList.add('active')
}

function openEditModal(id, name, description) {
  editingId = id
  document.getElementById('modal-title').textContent = 'Editar Categoría'
  document.getElementById('modal-save-btn').textContent = 'Guardar'
  document.getElementById('c-name').value = name
  document.getElementById('c-description').value = description
  document.getElementById('category-modal').classList.add('active')
}

function closeModal() {
  document.getElementById('category-modal').classList.remove('active')
}

function closeModalOutside(e) {
  if (e.target.id === 'category-modal') closeModal()
}

async function handleSave() {
  const name = document.getElementById('c-name').value.trim()
  if (!name) {
    alert('El nombre es obligatorio.')
    return
  }

  const body = {
    name,
    description: document.getElementById('c-description').value || null
  }

  try {
    if (editingId) {
      await fetch(`${API_URL}/update/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } else {
      await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    }
    closeModal()
    loadCategories()
  } catch (err) {
    console.error('Error al guardar:', err)
    alert('Error al guardar la categoría.')
  }
}

async function disableCategory(id) {
  if (!confirm('¿Seguro que quieres deshabilitar esta categoría?')) return
  try {
    await fetch(`${API_URL}/disable/${id}`, { method: 'PATCH' })
    loadCategories()
  } catch (err) {
    console.error('Error al deshabilitar:', err)
    alert('Error al deshabilitar la categoría.')
  }
}

// Expose to window for HTML inline handlers
window.openAddModal = openAddModal
window.closeModal = closeModal
window.closeModalOutside = closeModalOutside
window.handleSave = handleSave

document.getElementById('modal-save-btn').addEventListener('click', handleSave)
document.getElementById('category-modal').addEventListener('click', closeModalOutside)

loadCategories()
