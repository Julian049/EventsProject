import '../styles/styles.css'
import '../styles/report.css'
import { API_BASE } from '../api/config.js'

const container = document.getElementById('report-container')

async function loadReport() {
  try {
    const [eventsRes, interestsRes] = await Promise.all([
      fetch(`${API_BASE}/event?page=1`),
      fetch(`${API_BASE}/event/getAllInterested`)
    ])

    const eventsJson = await eventsRes.json()
    const interests  = await interestsRes.json()

    const countMap = {}
    interests.forEach(i => {
      if (i.type === 'click') {
        countMap[i.event_id] = (countMap[i.event_id] || 0) + 1
      }
    })

    renderReport(eventsJson.data, countMap)
  } catch (err) {
    container.innerHTML = '<p>Error cargando el reporte.</p>'
    console.error(err)
  }
}

function renderReport(events, countMap) {
  if (!events || events.length === 0) {
    container.innerHTML = '<p>No hay eventos para mostrar.</p>'
    return
  }

  const sorted = [...events].sort((a, b) =>
    (countMap[b.id] || 0) - (countMap[a.id] || 0)
  )

  const rows = sorted.map((event, index) => {
    const count = countMap[event.id] || 0
    const barWidth = Math.min(count * 10, 100)
    return `
      <tr>
        <td class="rank">#${index + 1}</td>
        <td class="event-name">
          <a href="detail.html?id=${event.id}">${event.name}</a>
        </td>
        <td class="interest-count">
          <div class="bar-wrap">
            <div class="bar" style="width: ${barWidth}%"></div>
            <span>${count}</span>
          </div>
        </td>
      </tr>`
  }).join('')

  container.innerHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Evento</th>
          <th>Me interesa</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

loadReport()
