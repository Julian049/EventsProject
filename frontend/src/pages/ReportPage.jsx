import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents, getAllInterested } from '../api/api'
import Spinner from '../components/Spinner'
import styles from './ReportPage.module.css'

export default function ReportPage() {
  const [rows, setRows]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [eventsJson, interests] = await Promise.all([
          getEvents(1),
          getAllInterested(),
        ])

        const countMap = {}
        interests.forEach(i => {
          if (i.type === 'click') {
            countMap[i.event_id] = (countMap[i.event_id] || 0) + 1
          }
        })

        const sorted = [...(eventsJson.data || [])].sort(
          (a, b) => (countMap[b.id] || 0) - (countMap[a.id] || 0)
        )

        setRows(sorted.map(ev => ({ ...ev, count: countMap[ev.id] || 0 })))
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const maxCount = rows.length > 0 ? Math.max(...rows.map(r => r.count), 1) : 1

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Reporte de Intereses</h1>
      <p className={styles.sub}>Eventos ordenados por cantidad de "Me interesa"</p>

      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <p className={styles.empty}>No hay datos para mostrar.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Evento</th>
                <th>Me interesa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td className={styles.rank}>#{i + 1}</td>
                  <td className={styles.name}>
                    <Link to={`/event/${row.id}`}>{row.name}</Link>
                  </td>
                  <td className={styles.barCell}>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.bar}
                        style={{ width: `${Math.max((row.count / maxCount) * 100, row.count > 0 ? 4 : 0)}%` }}
                      />
                      <span className={styles.count}>{row.count}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
