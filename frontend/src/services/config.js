const currentHost = window.location.hostname;

export const API_BASE = `http://${currentHost}:3250`;

export const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
}
