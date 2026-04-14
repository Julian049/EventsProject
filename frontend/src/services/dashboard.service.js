import { API_BASE, getHeaders } from './config'

export const getDashboardMetrics = () =>
    fetch(`${API_BASE}/dashboard/metrics`, {
        headers: getHeaders(),
    }).then(r => r.json())

export const getSalesByEvent = () =>
    fetch(`${API_BASE}/dashboard/sales-by-event`, {
        headers: getHeaders(),
    }).then(r => r.json())