import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar        from './components/Navbar'
import EventsPage    from './pages/EventsPage'
import CategoriesPage from './pages/CategoriesPage'
import DetailPage    from './pages/DetailPage'
import ReportPage    from './pages/ReportPage'
import LoginPage     from './pages/LoginPage'

// Componente guardián para proteger rutas privadas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // Si no hay token, lo redirige al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    // Si hay token, renderiza la página solicitada
    return children;
};

export default function App() {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas Privadas envueltas en el guardián */}
            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <Navbar />
                        <main style={{ flex: 1 }}>
                            <Routes>
                                <Route path="/"           element={<EventsPage />} />
                                <Route path="/categories" element={<CategoriesPage />} />
                                <Route path="/event/:id"  element={<DetailPage />} />
                                <Route path="/report"     element={<ReportPage />} />
                            </Routes>
                        </main>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}