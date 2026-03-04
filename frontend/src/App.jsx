import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar        from './components/Navbar'
import EventsPage    from './pages/EventsPage'
import CategoriesPage from './pages/CategoriesPage'
import DetailPage    from './pages/DetailPage'
import ReportPage    from './pages/ReportPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage from "./pages/RegisterPage.jsx";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
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
                            </Routes>
                        </main>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}