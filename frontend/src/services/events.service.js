import { API_BASE, getHeaders } from './config'

export const getEvents = (page = 1) =>
    fetch(`${API_BASE}/event?page=${page}`).then(r => r.json())

export const getAllEvents = (page = 1) =>
    fetch(`${API_BASE}/event/all?page=${page}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())

export const getEvent = (id) =>
    fetch(`${API_BASE}/event/${id}`).then(r => r.json())

export const createEvent = (body) =>
    fetch(`${API_BASE}/event/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(r => r.json())

export const updateEvent = (id, body) =>
    fetch(`${API_BASE}/event/update/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(r => r.json())

export const disableEvent = (id) =>
    fetch(`${API_BASE}/event/disable/${id}`, { method: 'PATCH', headers: getHeaders() })

export const registerInterest = (id) =>
    fetch(`${API_BASE}/event/${id}/favorite`, {
        method: 'POST',
        headers: getHeaders()
    })

export const unregisterInterest = (id) =>
    fetch(`${API_BASE}/event/${id}/favorite`, {
        method: 'DELETE',
        headers: getHeaders()
    })

export const getAllInterested = () =>
    fetch(`${API_BASE}/event/getAllInterested`, {
        headers: getHeaders(),
    }).then(r => r.json())

export const registerClick = (id) =>
    fetch(`${API_BASE}/event/interested/${id}`, { method: 'PATCH' })

export const getUserFavorites = (userId) =>
    fetch(`${API_BASE}/event/favorites/user/${userId}`, {
        headers: getHeaders(),
    }).then(r => r.json())

export const getFavoritesReport = () =>
    fetch(`${API_BASE}/event/favorites/report`, {
        headers: getHeaders(),
    }).then(r => r.json())
