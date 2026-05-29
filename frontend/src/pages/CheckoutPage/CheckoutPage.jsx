import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent } from '../../services/events.service'
import { getEventTicketTypes, createPurchase } from '../../services/checkout.service'
import { usePaymentSocket } from '../../hooks/usePaymentSocket'
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
    const { id } = useParams()
    const navigate = useNavigate()
    const userId = getUserIdFromToken()

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

    // WebSocket
    const [wsEnabled, setWsEnabled] = useState(false)
    const [aiMessage, setAiMessage] = useState(null)
    const [processingPhase, setProcessingPhase] = useState(1) // 1 | 2 | 3

    const { status: wsStatus, message: wsMessage, isError: wsIsError } = usePaymentSocket(userId, wsEnabled)

    // Reaccionar al mensaje de la IA
    useEffect(() => {
        if (wsStatus === 'done' || wsStatus === 'error') {
            setProcessingPhase(3)
            setAiMessage(wsMessage)
            setWsEnabled(false)

            // Transición automática luego de mostrar el mensaje
            setTimeout(() => {
                if (wsIsError) {
                    setError(wsMessage)
                    setStep(2)
                } else {
                    setStep(3)
                }
            }, 3000)
        }
    }, [wsStatus])

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
            return { ...prev, [ttId]: next }
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
        setAiMessage(null)
        setProcessingPhase(1)
        setWsEnabled(true)
        setStep('processing')

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
                franchiseId: parseInt(franchiseId),
            })

            // Fase 2: respuesta de la pasarela recibida
            setProcessingPhase(2)
            const generatedTickets = Array.isArray(response) ? response : []
            setTickets(generatedTickets)

        } catch {
            // El backend publicó el evento de error a RabbitMQ,
            // el mensaje de la IA llegará igual por WebSocket (fase 3)
            setProcessingPhase(2)
        } finally {
            setPurchasing(false)
        }
    }

    if (loading) return <Spinner />

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.header}>
                <button
                    className={styles.backBtn}
                    onClick={() => step === 0 ? navigate(-1) : setStep(s => typeof s === 'number' ? s - 1 : 2)}
                >
                    ← {step === 0 ? 'Volver al evento' : 'Atrás'}
                </button>
                <h1 className={styles.eventName}>{event?.name}</h1>
            </div>

            {/* Stepper */}
            <div className={styles.stepper}>
                {STEPS.map((label, i) => (
                    <div
                        key={i}
                        className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${typeof step === 'number' && i < step ? styles.stepDone : ''}`}
                    >
                        <div className={styles.stepCircle}>{typeof step === 'number' && i < step ? '✓' : i + 1}</div>
                        <span className={styles.stepLabel}>{label}</span>
                        {i < STEPS.length - 1 && <div className={styles.stepLine} />}
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
                                    <div
                                        key={tt.id}
                                        className={`${styles.ticketCard} ${qty > 0 ? styles.ticketCardSelected : ''} ${isSoldOut ? styles.ticketCardSoldOut : ''}`}
                                    >
                                        <div className={styles.ticketCardTop}>
                                            <span className={styles.ticketName}>{tt.name}</span>
                                            {isSoldOut
                                                ? <span className={styles.badgeSoldOut}>Agotado</span>
                                                : <span className={styles.badgeAvail}>{available} disponibles</span>
                                            }
                                        </div>
                                        <div className={styles.ticketPrice}>
                                            ${parseFloat(tt.price).toLocaleString()}
                                        </div>
                                        {!isSoldOut && (
                                            <div className={styles.quantityControl} style={{ marginTop: '0.75rem' }}>
                                                <button onClick={() => setQty(tt.id, -1, available)}>−</button>
                                                <span>{qty}</span>
                                                <button onClick={() => setQty(tt.id, 1, available)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.footerRow}>
                            <span className={styles.totalPreview}>
                                Total: <strong>${total}</strong>
                            </span>
                            <button
                                className={styles.btnPrimary}
                                disabled={!hasSelection}
                                onClick={() => setStep(1)}
                            >
                                Continuar →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1 — Confirmar */}
                {step === 1 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Confirma tu pedido</h2>
                        <div className={styles.confirmCard}>
                            {selectedItems.map(tt => (
                                <div key={tt.id} className={styles.confirmRow}>
                                    <span>{tt.name} × {quantities[tt.id]}</span>
                                    <strong>${(parseFloat(tt.price) * quantities[tt.id]).toLocaleString()}</strong>
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
                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                    {[['1', 'Visa'], ['2', 'Mastercard'], ['3', 'Nu']].map(([val, label]) => (
                                        <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="franchise"
                                                value={val}
                                                checked={franchiseId === val}
                                                onChange={e => setFranchiseId(e.target.value)}
                                            />
                                            {label}
                                        </label>
                                    ))}
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
                            <button className={styles.btnSecondary} onClick={() => { setError(null); setStep(1) }}>
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
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>
                            Procesando tu pago
                        </h2>

                        <div className={styles.processingSteps}>
                            <div className={`${styles.processingStep} ${processingPhase >= 1 ? styles.stepPhaseActive : ''} ${processingPhase >= 2 ? styles.stepPhaseDone : ''}`}>
                                <div className={styles.phaseIcon}>
                                    {processingPhase >= 2 ? '✓' : <span className={styles.phaseDot} />}
                                </div>
                                <div className={styles.phaseText}>
                                    <strong>Enviando a la pasarela de pago</strong>
                                    <span>Conectando de forma segura con el proveedor</span>
                                </div>
                            </div>

                            <div className={`${styles.processingStep} ${processingPhase >= 2 ? styles.stepPhaseActive : ''} ${processingPhase >= 3 ? styles.stepPhaseDone : ''}`}>
                                <div className={styles.phaseIcon}>
                                    {processingPhase >= 3 ? '✓' : processingPhase === 2 ? <span className={styles.phaseDot} /> : <span className={styles.phaseEmpty} />}
                                </div>
                                <div className={styles.phaseText}>
                                    <strong>Respuesta de la pasarela</strong>
                                    <span>Validando la transacción</span>
                                </div>
                            </div>

                            <div className={`${styles.processingStep} ${processingPhase >= 3 ? styles.stepPhaseActive : ''}`}>
                                <div className={styles.phaseIcon}>
                                    {processingPhase === 3 ? '✓' : <span className={styles.phaseEmpty} />}
                                </div>
                                <div className={styles.phaseText}>
                                    <strong>Análisis con inteligencia artificial</strong>
                                    <span>Generando tu respuesta personalizada</span>
                                </div>
                            </div>
                        </div>

                        {processingPhase < 3 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                                <Spinner />
                            </div>
                        )}

                        {aiMessage && (
                            <div className={`${styles.aiMessageCard} ${wsIsError ? styles.aiMessageError : styles.aiMessageSuccess}`}>
                                <span className={styles.aiIcon}>{wsIsError ? '⚠️' : '🎉'}</span>
                                <p className={styles.aiText}>{aiMessage}</p>
                                <span className={styles.aiLabel}>Mensaje generado por IA</span>
                            </div>
                        )}
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

                        {aiMessage && (
                            <div className={`${styles.aiMessageCard} ${styles.aiMessageSuccess}`}>
                                <span className={styles.aiIcon}>🎉</span>
                                <p className={styles.aiText}>{aiMessage}</p>
                                <span className={styles.aiLabel}>Mensaje generado por IA</span>
                            </div>
                        )}

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
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={styles.qrContainer}>
                                        <img src={t.qr_code} alt={`QR Ticket ${i + 1}`} className={styles.qrImage} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.footerRow} style={{ justifyContent: 'center', gap: '1rem' }}>
                            <button className={styles.btnSecondary} onClick={() => navigate('/')}>Ir al inicio</button>
                            <button className={styles.btnPrimary} onClick={() => navigate(`/event/${id}`)}>Ver evento</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}