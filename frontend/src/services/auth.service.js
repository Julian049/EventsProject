import { API_BASE } from './config'

export const login = (body) =>
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(async r => {
        const text = await r.text()
        const data = text ? JSON.parse(text) : {}
        if (!r.ok || !data.token) throw new Error('Usuario o contraseña incorrectos')
        return data
    })
