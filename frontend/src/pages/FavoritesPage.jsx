import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserFavorites, registerClick } from '../api/api'
import Spinner from '../components/Spinner'
import styles from './EventsPage.module.css'

function getUserIdFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))?.id || null
  } catch { return null }
}

export default function FavoritesPage() {
  const navigate = useNavigate()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const userId = getUserIdFromToken()
      if (!userId) return setLoading(false)
      try {
        const data = await getUserFavorites(userId)
        setEvents(data)
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Mis favoritos</h1>
      </div>

      {loading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <p className={styles.empty}>Aún no tienes eventos favoritos.</p>
      ) : (
        <div className={styles.grid}>
          {events.map((ev, i) => (
            <div
              key={ev.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => {
                registerClick(ev.id)
                navigate(`/event/${ev.id}`)
              }}
            >
              <div className={styles.imgWrap}>
                <img
                  src={ev.image || ''}
                  alt={ev.name}
                  onError={e => {
                    e.target.src = 'https://placehold.co/400x220/e2e8f0/94a3b8?text=Sin+imagen'
                  }}
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{ev.name}</p>
                <p className={styles.cardDesc}>{ev.description || ''}</p>
                <div className={styles.cardMeta}>
                  {ev.date && (
                    <span className={styles.badge}>
                      📅 {new Date(ev.date).toLocaleDateString('es-ES')}
                    </span>
                  )}
                  {ev.price && (
                    <span className={styles.badge}>
                      💲{ev.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}