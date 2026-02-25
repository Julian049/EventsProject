import '../styles/styles.css'
import { API_BASE } from '../api/config.js'

const container = document.getElementById('events-container')
let pageNumber = 1

async function loadCategoriesSelect(selectId) {
  try {
    const res = await fetch(`${API_BASE}/category`)
    const categories = await res.json()
    const select = document.getElementById(selectId)
    select.innerHTML = '<option value="">Sin categoría</option>'
    categories.forEach(cat => {
      const option = document.createElement('option')
      option.value = cat.id
      option.textContent = cat.name
      select.appendChild(option)
    })
  } catch (err) {
    console.error('Error cargando categorías:', err)
  }
}

function setMinDate(inputId) {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const min = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  document.getElementById(inputId).min = min
}

async function loadEvents(page = 1) {
  try {
    const res = await fetch(`${API_BASE}/event?page=${page}`)
    const json = await res.json()
    renderEvents(json.data)
  } catch (err) {
    container.innerHTML = '<p>Error loading events</p>'
    console.error(err)
  }
}

function renderEvents(events) {
  container.innerHTML = ''
  if (!events || events.length === 0) {
    container.innerHTML = '<p>No hay eventos disponibles.</p>'
    return
  }
  events.forEach(event => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${event.image}" alt="event image"/>
      <div class="card-content">
        <div class="card-title">${event.name}</div>
        <div class="card-desc">${event.description || ''}</div>
      </div>
    `
    card.addEventListener('click', () => {
      window.location.href = `detail.html?id=${event.id}`
    })
    container.appendChild(card)
  })
}

function openAddModal() {
  loadCategoriesSelect('a-category')
  setMinDate('a-date')
  document.getElementById('add-modal').classList.add('active')
}

function nextPage() {
  pageNumber++
  loadEvents(pageNumber)
}

function viewReport() {
  window.location.href = 'report.html'
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('active')
}

function closeModalOutside(e) {
  if (e.target.id === 'add-modal') closeAddModal()
}

async function handleCreateEvent() {
  const name = document.getElementById('a-name').value.trim()
  if (!name) {
    alert('El nombre es obligatorio.')
    return
  }

  const body = {
    name,
    date:        document.getElementById('a-date').value || null,
    description: document.getElementById('a-description').value || null,
    image:       document.getElementById('a-image').value || null,
    category_id: document.getElementById('a-category').value || null,
    price:       document.getElementById('a-price').value || null,
  }

  try {
    await fetch(`${API_BASE}/event/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    closeAddModal()
    loadEvents()
  } catch (err) {
    console.error('Error al crear:', err)
    alert('Error al crear el evento.')
  }
}

// Expose functions to window for inline HTML handlers
window.openAddModal = openAddModal
window.closeAddModal = closeAddModal
window.closeModalOutside = closeModalOutside
window.handleCreateEvent = handleCreateEvent
window.nextPage = nextPage
window.viewReport = viewReport

loadEvents(pageNumber)
