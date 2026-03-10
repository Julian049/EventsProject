import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar        from './components/Navbar'
import EventsPage    from './pages/EventsPage'
import CategoriesPage from './pages/CategoriesPage'
import DetailPage    from './pages/DetailPage'
import ReportPage    from './pages/ReportPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage from "./pages/RegisterPage.jsx"
import FavoritesPage from './pages/FavoritesPage';

const PrivateRoute = ({ children, guestAllowed = false }) => {
    const token = localStorage.getItem('token');
    const isGuest = sessionStorage.getItem('guest') === 'true';
    if (!token && !isGuest && !guestAllowed) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function App() {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
                                <Route path="/favorites" element={<FavoritesPage />} />
                            </Routes>
                        </main>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}