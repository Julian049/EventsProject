export const API_BASE = ''

export const getEvents = (page = 1) =>
  fetch(`${API_BASE}/event?page=${page}`).then(r => r.json())

export const getEvent = (id) =>
  fetch(`${API_BASE}/event/${id}`).then(r => r.json())

export const createEvent = (body) =>
  fetch(`${API_BASE}/event/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json())

export const updateEvent = (id, body) =>
  fetch(`${API_BASE}/event/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json())

export const disableEvent = (id) =>
  fetch(`${API_BASE}/event/disable/${id}`, { method: 'PATCH' })

export const registerInterest = (id) =>
  fetch(`${API_BASE}/event/interested/${id}`, { method: 'PATCH' })

export const getAllInterested = () =>
  fetch(`${API_BASE}/event/getAllInterested`).then(r => r.json())

export const getCategories = () =>
  fetch(`${API_BASE}/category`).then(r => r.json())

export const createCategory = (body) =>
  fetch(`${API_BASE}/category/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json())

export const updateCategory = (id, body) =>
  fetch(`${API_BASE}/category/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json())

export const disableCategory = (id) =>
  fetch(`${API_BASE}/category/disable/${id}`, { method: 'PATCH' })
