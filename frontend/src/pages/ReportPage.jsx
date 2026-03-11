import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllInterested, getFavoritesReport, getUsers } from '../api/api'
import Spinner from '../components/Spinner'
import styles from './ReportPage.module.css'

const TOP = 10
const TABS = [
  { key: 'clicks',    label: '🖱 Clicks' },
  { key: 'favorites', label: '⭐ Favoritos' },
  { key: 'users',     label: '👥 Usuarios' },
]

export default function ReportPage() {
  const [activeTab, setActiveTab]         = useState('clicks')
  const [clickRows, setClickRows]         = useState([])
  const [favoriteRows, setFavoriteRows]   = useState([])
  const [userRows, setUserRows]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [showAllClicks, setShowAllClicks] = useState(false)
  const [showAllFavs, setShowAllFavs]     = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [interests, favorites, users] = await Promise.all([
          getAllInterested(),
          getFavoritesReport(),
          getUsers(),
        ])

        // Clicks
        const countMap = {}
        interests.forEach(i => {
          if (i.type === 'click') {
            countMap[i.event_id] = (countMap[i.event_id] || 0) + 1
          }
        })
        setClickRows(
          favorites
            .map(ev => ({ ...ev, count: countMap[ev.id] || 0 }))
            .sort((a, b) => b.count - a.count)
        )

        // Favoritos
        setFavoriteRows(favorites.map(ev => ({ ...ev, count: Number(ev.total_favorites) })))

        // Usuarios
        setUserRows(users)

      } catch {
        setClickRows([])
        setFavoriteRows([])
        setUserRows([])
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
              <tr><th>#</th><th>Evento</th><th>Total</th></tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={row.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td className={styles.rank}>#{i + 1}</td>
                  <td className={styles.name}><Link to={`/event/${row.id}`}>{row.name}</Link></td>
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

  const UsersTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>#</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
        </thead>
        <tbody>
          {userRows.map((user, i) => (
            <tr key={user.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>
              <td className={styles.rank}>#{user.id}</td>
              <td className={styles.name}>{user.name}</td>
              <td className={styles.name}>{user.email}</td>
              <td>
                <span className={user.role === 'Admin' ? styles.badgeAdmin : styles.badgeMember}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {activeTab === 'clicks' && (
            <>
              <h1 className={styles.heading}>Reporte de Clicks</h1>
              <p className={styles.sub}>Eventos ordenados por cantidad de clicks recibidos</p>
              {clickRows.length === 0
                ? <p className={styles.empty}>No hay datos para mostrar.</p>
                : <RankingTable rows={clickRows} maxCount={maxClicks} showAll={showAllClicks} onToggle={() => setShowAllClicks(v => !v)} />
              }
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              <h1 className={styles.heading}>Reporte de Favoritos</h1>
              <p className={styles.sub}>Eventos ordenados por cantidad de "Me interesa"</p>
              {favoriteRows.length === 0
                ? <p className={styles.empty}>No hay datos para mostrar.</p>
                : <RankingTable rows={favoriteRows} maxCount={maxFavorites} showAll={showAllFavs} onToggle={() => setShowAllFavs(v => !v)} />
              }
            </>
          )}

          {activeTab === 'users' && (
            <>
              <h1 className={styles.heading}>Reporte de Usuarios</h1>
              <p className={styles.sub}>{userRows.length} usuarios registrados en el sistema</p>
              {userRows.length === 0
                ? <p className={styles.empty}>No hay usuarios para mostrar.</p>
                : <UsersTable />
              }
            </>
          )}
        </>
      )}
    </div>
  )
}