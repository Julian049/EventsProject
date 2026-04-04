import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyPurchases } from '../../services'
import Spinner from '../../components/Spinner/Spinner'
import styles from './MyTicketsPage.module.css'

export default function MyTicketsPage() {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    getMyPurchases()
      .then(data => setPurchases(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>Mis boletas</h1>
      </div>

      {loading ? <Spinner /> : purchases.length === 0 ? (
        <p className={styles.empty}>No tienes compras registradas.</p>
      ) : (
        <div className={styles.list}>
          {purchases.map((p, i) => (
            <div key={p.id} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={styles.cardHeader} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <div className={styles.cardMeta}>
                  <span className={styles.purchaseId}>Compra #{p.id}</span>
                  <span className={`${styles.badge} ${p.status === 'Completed' ? styles.badgeCompleted : styles.badgePending}`}>
                    {p.status}
                  </span>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.amount}>${parseFloat(p.total_amount).toLocaleString('es-CO')}</span>
                  <span className={styles.date}>{new Date(p.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <span className={styles.toggle}>{expanded === p.id ? '▲' : '▼'}</span>
              </div>

              {expanded === p.id && (
                <div className={styles.tickets}>
                  {p.tickets.map((t, j) => (
                    <div key={t.id} className={styles.ticket}>
                      <div className={styles.ticketHeader}>
                        <span>Boleta #{j + 1}</span>
                        <span className={`${styles.badge} ${t.status === 'Active' ? styles.badgeActive : ''}`}>
                          {t.status}
                        </span>
                      </div>
                      <div className={styles.qrWrap}>
                        <img src={t.qr_code} alt={`QR boleta ${t.id}`} className={styles.qr} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}