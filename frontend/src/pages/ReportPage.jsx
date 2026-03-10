import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllInterested, getFavoritesReport } from '../api/api'
import Spinner from '../components/Spinner'
import styles from './ReportPage.module.css'

const TOP = 10

export default function ReportPage() {
  const [clickRows, setClickRows]         = useState([])
  const [favoriteRows, setFavoriteRows]   = useState([])
  const [loading, setLoading]             = useState(true)
  const [showAllClicks, setShowAllClicks] = useState(false)
  const [showAllFavs, setShowAllFavs]     = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [interests, favorites] = await Promise.all([
          getAllInterested(),
          getFavoritesReport(),
        ])

        // Reporte clicks: agrupar por event_id
        const countMap = {}
        interests.forEach(i => {
          if (i.type === 'click') {
            countMap[i.event_id] = (countMap[i.event_id] || 0) + 1
          }
        })

        // Usar favorites como fuente de nombres (tiene todos los eventos)
        const clicksSorted = favorites
          .map(ev => ({ ...ev, count: countMap[ev.id] || 0 }))
          .sort((a, b) => b.count - a.count)

        setClickRows(clicksSorted)

        // Reporte favoritos
        setFavoriteRows(favorites.map(ev => ({ ...ev, count: Number(ev.total_favorites) })))

      } catch {
        setClickRows([])
        setFavoriteRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const maxClicks    = clickRows.length    > 0 ? Math.max(...clickRows.map(r => r.count), 1)    : 1
  const maxFavorites = favoriteRows.length > 0 ? Math.max(...favoriteRows.map(r => r.count), 1) : 1

  const RankingTable = ({ rows, maxCount, showAll, onToggle }) => {
    const visible = showAll ? rows : rows.slice(0, TOP)
    return (
      <>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Evento</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
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
        {rows.length > TOP && (
          <button className={styles.btnToggle} onClick={onToggle}>
            {showAll ? `▲ Mostrar solo Top ${TOP}` : `▼ Ver todos (${rows.length})`}
          </button>
        )}
      </>
    )
  }

  return (
    <div className={styles.page}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section>
            <h1 className={styles.heading}>Reporte de Clicks</h1>
            <p className={styles.sub}>Eventos ordenados por cantidad de clicks recibidos</p>
            {clickRows.length === 0
              ? <p className={styles.empty}>No hay datos para mostrar.</p>
              : <RankingTable rows={clickRows} maxCount={maxClicks} showAll={showAllClicks} onToggle={() => setShowAllClicks(v => !v)} />
            }
          </section>

          <section style={{ marginTop: '3rem' }}>
            <h1 className={styles.heading}>Reporte de Favoritos</h1>
            <p className={styles.sub}>Eventos ordenados por cantidad de "Me interesa"</p>
            {favoriteRows.length === 0
              ? <p className={styles.empty}>No hay datos para mostrar.</p>
              : <RankingTable rows={favoriteRows} maxCount={maxFavorites} showAll={showAllFavs} onToggle={() => setShowAllFavs(v => !v)} />
            }
          </section>
        </>
      )}
    </div>
  )
}