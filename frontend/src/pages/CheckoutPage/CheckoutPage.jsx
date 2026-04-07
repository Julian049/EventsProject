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

const STEPS = ['Seleccionar', 'Confirmar', 'Tu ticket']

export default function CheckoutPage() {
    const {id} = useParams()
    const navigate = useNavigate()

    const [step, setStep] = useState(0)
    const [event, setEvent] = useState(null)
    const [ticketTypes, setTicketTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const [error, setError] = useState(null)

    const [selectedType, setSelectedType] = useState(null)
    const [quantity, setQuantity] = useState(1)

    const [purchase, setPurchase] = useState(null)
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [ev, types] = await Promise.all([
                    getEvent(id),
                    getEventTicketTypes(id).catch((err) => {
                        return [];
                    }),
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

    async function handleConfirmPurchase() {
        setPurchasing(true)
        setError(null)
        try {
            const response = await createPurchase(id, {
                ticketTypeId: selectedType.ticketTypeId ?? selectedType.ticket_type_id ?? selectedType.id,
                quantity,
            })
            setPurchase(response)

            setStep('processing')

            await new Promise(resolve => setTimeout(resolve, 3000));
            await updateStatus(response[0].purchase_id);

            const generatedTickets = response.tickets || (Array.isArray(response) ? response : [])
            setTickets(generatedTickets)
            setStep(2)
        } catch (err) {
            setError(err.message || 'Error al procesar la compra.')
            setStep(1)
        } finally {
            setPurchasing(false)
        }
    }

    if (loading) return <Spinner/>

    const total = selectedType ? (parseFloat(selectedType.price) * quantity).toFixed(2) : '0.00'

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}>
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

                {/* STEP 0 — Select ticket type */}
                {step === 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Elige tu tipo de entrada</h2>
                        {ticketTypes.length === 0 && (
                            <p className={styles.empty}>No hay tipos de ticket disponibles para este evento.</p>
                        )}
                        <div className={styles.ticketGrid}>
                            {ticketTypes.map(tt => {
                                const available = parseInt(tt.available_quantity ?? 0)
                                const isSelected = selectedType?.id === tt.id
                                const isSoldOut = available === 0
                                return (
                                    <button
                                        key={tt.id}
                                        disabled={isSoldOut}
                                        onClick={() => {
                                            setSelectedType(tt);
                                            setQuantity(1)
                                        }}
                                        className={`${styles.ticketCard} ${isSelected ? styles.ticketCardSelected : ''} ${isSoldOut ? styles.ticketCardSoldOut : ''}`}
                                    >
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
                                    </button>
                                )
                            })}
                        </div>

                        {selectedType && (
                            <div className={styles.quantityRow}>
                                <span className={styles.quantityLabel}>Cantidad</span>
                                <div className={styles.quantityControl}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => {
                                        const max = parseInt(selectedType.availableQuantity ?? selectedType.available_quantity ?? 1)
                                        setQuantity(q => Math.min(max, q + 1))
                                    }}>+
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.footerRow}>
                            {selectedType && (
                                <span className={styles.totalPreview}>Total: <strong>${total}</strong></span>
                            )}
                            <button
                                className={styles.btnPrimary}
                                disabled={!selectedType}
                                onClick={() => setStep(1)}
                            >
                                Continuar →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1 — Confirm */}
                {step === 1 && selectedType && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Confirma tu compra</h2>

                        <div className={styles.confirmCard}>
                            <div className={styles.confirmRow}>
                                <span>Evento</span>
                                <strong>{event?.name}</strong>
                            </div>
                            <div className={styles.confirmRow}>
                                <span>Tipo de entrada</span>
                                <strong>{selectedType.ticketTypeName ?? selectedType.name ?? `Tipo ${selectedType.id}`}</strong>
                            </div>
                            <div className={styles.confirmRow}>
                                <span>Precio unitario</span>
                                <strong>${parseFloat(selectedType.price).toFixed(2)}</strong>
                            </div>
                            <div className={styles.confirmRow}>
                                <span>Cantidad</span>
                                <strong>{quantity}</strong>
                            </div>
                            <div className={`${styles.confirmRow} ${styles.confirmTotal}`}>
                                <span>Total</span>
                                <strong>${total}</strong>
                            </div>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.footerRow}>
                            <button className={styles.btnSecondary} onClick={() => setStep(0)}>
                                ← Cambiar
                            </button>
                            <button
                                className={styles.btnPrimary}
                                disabled={purchasing}
                                onClick={handleConfirmPurchase}
                            >
                                {purchasing ? 'Procesando…' : 'Confirmar compra'}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP processing — Pantalla de espera */}
                {step === 'processing' && (
                    <div className={styles.section} style={{textAlign: 'center', padding: '3rem 1rem'}}>
                        <div className={styles.processingIcon}>⏳</div>
                        <h2 className={styles.sectionTitle}>Procesando tu compra…</h2>
                        <p className={styles.successSub}>Estamos confirmando tu pago, no cierres esta ventana.</p>

                        <div className={styles.statusBadge}>
                            🟡 Compra pendiente
                        </div>

                        <Spinner/>
                    </div>
                )}

                {/* STEP 2 — Tickets / QR */}
                {step === 2 && (
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
                                        <span className={`${styles.ticketStatus} ${t.status === 'Active' ? styles.statusActive : ''}`}>
                                            {t.status || 'Active'}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }} className={styles.qrContainer}>
                                        <img
                                            src={t.qr_code}
                                            alt={`QR Ticket ${i + 1}`}
                                            className={styles.qrImage}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.footerRow} style={{justifyContent: 'center', gap: '1rem'}}>
                            <button className={styles.btnSecondary} onClick={() => navigate('/')}>
                                Ir al inicio
                            </button>
                            <button className={styles.btnPrimary} onClick={() => navigate(`/event/${id}`)}>
                                Ver evento
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}