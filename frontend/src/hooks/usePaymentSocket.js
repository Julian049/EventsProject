import { useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3250/ws';

/**
 * Hook que abre una conexión WebSocket y espera el mensaje
 * de resultado del pago para el usuario autenticado.
 *
 * @param {string|number} userId  - ID del usuario autenticado
 * @param {boolean}       enabled - Solo conecta cuando es true
 * @returns {{ status, message, isError, isLoading }}
 */
export function usePaymentSocket(userId, enabled) {
    const [status, setStatus]   = useState('idle');     // idle | connecting | waiting | done | error
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!enabled || !userId) return;

        setStatus('connecting');
        const ws = new WebSocket(`${WS_URL}?userId=${userId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus('waiting');
        };

        ws.onmessage = (event) => {
            try {
                const dto = JSON.parse(event.data);
                setMessage(dto.message);
                setIsError(dto.error);
                setStatus(dto.error ? 'error' : 'done');
            } catch {
                setStatus('error');
                setIsError(true);
                setMessage('Error inesperado al procesar la respuesta.');
            } finally {
                ws.close();
            }
        };

        ws.onerror = () => {
            setStatus('error');
            setIsError(true);
            setMessage('No se pudo conectar con el servidor. Intenta de nuevo.');
        };

        ws.onclose = () => {
            wsRef.current = null;
        };

        return () => {
            ws.close();
        };
    }, [userId, enabled]);

    return { status, message, isError, isLoading: status === 'connecting' || status === 'waiting' };
}