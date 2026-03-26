import { API_BASE } from './config'

export const login = (body) =>
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(async r => {
        if (!r.ok) throw new Error('Credenciales incorrectas')
        return r.json()
    })
