import { API_BASE, getHeaders } from './config'

export const getEventTicketTypes = (eventId) =>
    fetch(`${API_BASE}/eventTicketType/all/${eventId}`, {
        headers: getHeaders(),
    }).then(r => r.json())

export const createPurchase = (eventId, body) =>
    fetch(`${API_BASE}/purchase/create/${eventId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.message || 'Error al crear la compra')
        return data
    })

export const getTicketsByPurchase = (purchaseId) =>
    fetch(`${API_BASE}/ticket/purchase/${purchaseId}`, {
        headers: getHeaders(),
    }).then(r => r.json())