import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getEvent} from '../../services/events.service'
import {getEventTicketTypes, createPurchase, updateStatus} from '../../services/checkout.service'
import Spinner from '../../components/Spinner/Spinner'
import styles from './CheckoutPage.module.css'

function getUserIdFromToken() {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        return JSON.parse(atob(token.split('.')[1]))?.id || null
    } catch {
        return null
    }
}

const STEPS = ['Seleccionar', 'Confirmar', 'Pago', 'Tu ticket']

export default function CheckoutPage() {
    const {id} = useParams()
    const navigate = useNavigate()

    const [step, setStep] = useState(0)
    const [event, setEvent] = useState(null)
    const [ticketTypes, setTicketTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const [error, setError] = useState(null)
    const [quantities, setQuantities] = useState({})
    const [tickets, setTickets] = useState([])
    const [cardNumber, setCardNumber] = useState('')
    const [cvv, setCvv] = useState('')
    const [franchiseId, setFranchiseId] = useState('1')

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [ev, types] = await Promise.all([
                    getEvent(id),
                    getEventTicketTypes(id).catch(() => []),
                ])
                setEvent(ev)
                setTicketTypes(Array.isArray(types) ? types : [])
            } catch {
                setError('No se pudo cargar la información del evento.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [id])

    function setQty(ttId, delta, max) {
        setQuantities(prev => {
            const current = prev[ttId] ?? 0
            const next = Math.min(max, Math.max(0, current + delta))
            return {...prev, [ttId]: next}
        })
    }

    const selectedItems = ticketTypes.filter(tt => (quantities[tt.id] ?? 0) > 0)
    const hasSelection = selectedItems.length > 0
    const total = selectedItems
        .reduce((sum, tt) => sum + parseFloat(tt.price) * quantities[tt.id], 0)
        .toFixed(2)

    const isCardValid = cardNumber.replace(/\s/g, '').length >= 16 && cvv.length >= 3

    function handleCardNumberChange(e) {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
        const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw
        setCardNumber(formatted)
    }

    async function handleConfirmPurchase() {
        setPurchasing(true)
        setError(null)
        try {
            const cleanCard = cardNumber.replace(/\s/g, '')

            const items = selectedItems.map(tt => ({
                ticketTypeId: tt.ticketTypeId ?? tt.ticket_type_id ?? tt.id,
                quantity: quantities[tt.id],
            }))

            const response = await createPurchase(id, {
                items,
                cardNumber: cleanCard,
                cvv,
                franchiseId: parseInt(franchiseId)
            })

            setStep('processing')

            const purchaseIds = [...new Set(
                (Array.isArray(response) ? response : []).map(t => t.purchase_id).filter(Boolean)
            )]
            await Promise.all(purchaseIds.map(pid => updateStatus(pid)))

            const generatedTickets = Array.isArray(response) ? response : []
            setTickets(generatedTickets)
            setStep(3)
        } catch (err) {
            setError(err.message || 'Error al procesar la compra.')
            setStep(2)
        } finally {
            setPurchasing(false)
        }
    }

    if (loading) return <Spinner/>

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backBtn}
                        onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}>
                    ← {step === 0 ? 'Volver al evento' : 'Atrás'}
                </button>
                <h1 className={styles.eventName}>{event?.name}</h1>
            </div>

            {/* Stepper */}
            <div className={styles.stepper}>
                {STEPS.map((label, i) => (
                    <div key={i}
                         className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
                        <div className={styles.stepCircle}>{i < step ? '✓' : i + 1}</div>
                        <span className={styles.stepLabel}>{label}</span>
                        {i < STEPS.length - 1 && <div className={styles.stepLine}/>}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className={styles.content}>

                {/* STEP 0 — Seleccionar */}
                {step === 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Elige tus entradas</h2>
                        {ticketTypes.length === 0 && (
                            <p className={styles.empty}>No hay tipos de ticket disponibles para este evento.</p>
                        )}
                        <div className={styles.ticketGrid}>
                            {ticketTypes.map(tt => {
                                const available = parseInt(tt.available_quantity ?? 0)
                                const qty = quantities[tt.id] ?? 0
                                const isSoldOut = available === 0
                                return (
                                    <div key={tt.id}
                                         className={`${styles.ticketCard} ${qty > 0 ? styles.ticketCardSelected : ''} ${isSoldOut ? styles.ticketCardSoldOut : ''}`}>
                                        <div className={styles.ticketCardTop}>
                                            <span className={styles.ticketName}>{tt.name}</span>
                                            {isSoldOut
                                                ? <span className={styles.badgeSoldOut}>Agotado</span>
                                                : <span className={styles.badgeAvail}>{available} disponibles</span>
                                            }
                                        </div>
                                        <div className={styles.ticketPrice}>
                                            ${parseFloat(tt.price).toFixed(2)}
                                        </div>
                                        {!isSoldOut && (
                                            <div className={styles.quantityControl}>
                                                <button onClick={() => setQty(tt.id, -1, available)}>−</button>
                                                <span>{qty}</span>
                                                <button onClick={() => setQty(tt.id, +1, available)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.footerRow}>
                            {hasSelection && (
                                <span className={styles.totalPreview}>Total: <strong>${total}</strong></span>
                            )}
                            <button className={styles.btnPrimary} disabled={!hasSelection} onClick={() => setStep(1)}>
                                Continuar →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1 — Confirmar */}
                {step === 1 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Confirma tu compra</h2>
                        <div className={styles.confirmCard}>
                            <div className={styles.confirmRow}>
                                <span>Evento</span>
                                <strong>{event?.name}</strong>
                            </div>
                            {selectedItems.map(tt => (
                                <div key={tt.id} className={styles.confirmRow}>
                                    <span>{tt.name} × {quantities[tt.id]}</span>
                                    <strong>${(parseFloat(tt.price) * quantities[tt.id]).toFixed(2)}</strong>
                                </div>
                            ))}
                            <div className={`${styles.confirmRow} ${styles.confirmTotal}`}>
                                <span>Total</span>
                                <strong>${total}</strong>
                            </div>
                        </div>
                        <div className={styles.footerRow}>
                            <button className={styles.btnSecondary} onClick={() => setStep(0)}>← Cambiar</button>
                            <button className={styles.btnPrimary} onClick={() => setStep(2)}>
                                Ir a pagar →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Pago */}
                {step === 2 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Datos de pago</h2>
                        <div className={styles.paymentForm}>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Franquicia de la tarjeta</label>
                                <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.5rem'}}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="radio"
                                            name="franchise"
                                            value="1"
                                            checked={franchiseId === '1'}
                                            onChange={(e) => setFranchiseId(e.target.value)}
                                        />
                                        Visa
                                    </label>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="radio"
                                            name="franchise"
                                            value="2"
                                            checked={franchiseId === '2'}
                                            onChange={(e) => setFranchiseId(e.target.value)}
                                        />
                                        Mastercard
                                    </label>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="radio"
                                            name="franchise"
                                            value="3"
                                            checked={franchiseId === '3'}
                                            onChange={(e) => setFranchiseId(e.target.value)}
                                        />
                                        Nu
                                    </label>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Número de tarjeta</label>
                                <input
                                    className={styles.fieldInput}
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={19}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>CVV</label>
                                <input
                                    className={`${styles.fieldInput} ${styles.fieldInputShort}`}
                                    type="password"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.footerRow}>
                            <button className={styles.btnSecondary} onClick={() => {
                                setError(null);
                                setStep(1)
                            }}>
                                ← Atrás
                            </button>
                            <button
                                className={styles.btnPrimary}
                                disabled={!isCardValid || purchasing}
                                onClick={handleConfirmPurchase}
                            >
                                {purchasing ? 'Procesando…' : `Pagar $${total}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP processing */}
                {step === 'processing' && (
                    <div className={styles.section} style={{textAlign: 'center', padding: '3rem 1rem'}}>
                        <div className={styles.processingIcon}>⏳</div>
                        <h2 className={styles.sectionTitle}>Procesando tu pago…</h2>
                        <p className={styles.successSub}>Estamos confirmando tu pago, no cierres esta ventana.</p>
                        <div className={styles.statusBadge}>🟡 Compra pendiente</div>
                        <Spinner/>
                    </div>
                )}

                {/* STEP 3 — Tickets */}
                {step === 3 && (
                    <div className={styles.section}>
                        <div className={styles.successHeader}>
                            <div className={styles.successIcon}>✓</div>
                            <h2 className={styles.sectionTitle}>¡Compra completada!</h2>
                            <p className={styles.successSub}>Guarda tus códigos QR, los necesitarás en la entrada.</p>
                        </div>
                        <div className={styles.ticketsIssued}>
                            {tickets.length === 0 && (
                                <p className={styles.empty}>Tickets generados. Revisa tus compras para verlos.</p>
                            )}
                            {tickets.map((t, i) => (
                                <div key={t.id ?? i} className={styles.ticketIssued}>
                                    <div className={styles.ticketIssuedHeader}>
                                        <span>Ticket #{i + 1}</span>
                                        <span
                                            className={`${styles.ticketStatus} ${t.status === 'Active' ? styles.statusActive : ''}`}>
                                            {t.status || 'Active'}
                                        </span>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                                         className={styles.qrContainer}>
                                        <img src={t.qr_code} alt={`QR Ticket ${i + 1}`} className={styles.qrImage}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.footerRow} style={{justifyContent: 'center', gap: '1rem'}}>
                            <button className={styles.btnSecondary} onClick={() => navigate('/')}>Ir al inicio</button>
                            <button className={styles.btnPrimary} onClick={() => navigate(`/event/${id}`)}>Ver evento
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}