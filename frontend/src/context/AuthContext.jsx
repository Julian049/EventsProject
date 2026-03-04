import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function getRole() {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        return JSON.parse(atob(token.split('.')[1]))?.role || null
    } catch { return null }
}

export function AuthProvider({ children }) {
    const [role, setRole] = useState(() => getRole())

    function refreshRole() {
        setRole(getRole())
    }

    return (
        <AuthContext.Provider value={{ role, refreshRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)