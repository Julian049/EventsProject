import { API_BASE, getHeaders } from './config'

export const getCategories = () =>
    fetch(`${API_BASE}/category`).then(r => r.json())

export const createCategory = (body) =>
    fetch(`${API_BASE}/category/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(r => r.json())

export const updateCategory = (id, body) =>
    fetch(`${API_BASE}/category/update/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(r => r.json())

export const disableCategory = (id) =>
    fetch(`${API_BASE}/category/disable/${id}`, { method: 'PATCH', headers: getHeaders() })
