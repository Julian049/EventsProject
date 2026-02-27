import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import EventsPage    from './pages/EventsPage'
import CategoriesPage from './pages/CategoriesPage'
import DetailPage    from './pages/DetailPage'
import ReportPage    from './pages/ReportPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"            element={<EventsPage />} />
          <Route path="/categories"  element={<CategoriesPage />} />
          <Route path="/event/:id"   element={<DetailPage />} />
          <Route path="/report"      element={<ReportPage />} />
        </Routes>
      </main>
    </>
  )
}
