export const API_BASE = 'http://localhost:3250';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? {'Authorization': `Bearer ${token}`} : {})
    };
};

export const login = (body) =>
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    }).then(async r => {
        if (!r.ok) throw new Error('Credenciales incorrectas');
        return r.json();
    });

export const register = (body) =>
    fetch(`${API_BASE}/users/create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...body, role: 'Member'}),
    }).then(async r => {
        if (!r.ok) throw new Error('Error al crear la cuenta');
        return r.json();
    });

export const getEvents = (page = 1) =>
    fetch(`${API_BASE}/event?page=${page}`).then(r => r.json());

export const getAllEvents = (page = 1) =>
    fetch(`${API_BASE}/event/all?page=${page}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());

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
    fetch(`${API_BASE}/event/disable/${id}`, {method: 'PATCH', headers: getHeaders()})

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
    fetch(`${API_BASE}/category/disable/${id}`, {method: 'PATCH', headers: getHeaders()})
