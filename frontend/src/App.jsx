import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar        from './components/Navbar/Navbar'
import EventsPage    from './pages/EventsPage/EventsPage'
import CategoriesPage from './pages/CategoriesPage/CategoriesPage'
import DetailPage    from './pages/DetailPage/DetailPage'
import ReportPage    from './pages/ReportPage/ReportPage'
import LoginPage     from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import ProfilePage from './pages/ProfilePage/ProfilePage';

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
                                <Route path="/profile" element={<ProfilePage />} />
                            </Routes>
                        </main>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}