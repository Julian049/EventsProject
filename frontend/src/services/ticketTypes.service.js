import { API_BASE, getHeaders } from './config'

export const getTicketTypes = () =>
    fetch(`${API_BASE}/ticketType/all`).then(r => r.json())

export const createTicketType = (body) =>
    fetch(`${API_BASE}/ticketType/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(async r => {
        if (!r.ok) throw new Error('Error al crear el tipo de boleta')
        return r.json()
    })