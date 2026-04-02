import { API_BASE, getHeaders } from './config'

export const register = (body) =>
    fetch(`${API_BASE}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, role: 'Member' }),
    }).then(async r => {
        if (!r.ok) throw new Error('Error al crear la cuenta')
        return r.json()
    })

export const updateUser = (id, body) =>
    fetch(`${API_BASE}/users/update/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
    }).then(r => r.json())

export const getUsers = () =>
    fetch(`${API_BASE}/users/`, {
        headers: getHeaders(),
    }).then(r => r.json())

export const deleteUser = (id) =>
    fetch(`${API_BASE}/users/delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    }).then(async r => {
        if (!r.ok) throw new Error('Error al intentar eliminar el usuario')
    })