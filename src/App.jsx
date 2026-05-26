// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import MakhanaParticles from './components/MakhanaParticles'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import AdminProducts from './pages/AdminProducts'
import Track from './pages/Track'
import ProductDetail from './pages/ProductDetail'
import Bulk from './pages/Bulk'
import AdminAnalytics from './pages/AdminAnalytics'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ReturnRefund from './pages/ReturnRefund'
import Shipping from './pages/Shipping'
import useAuthStore from './store/authStore'

export default function App() {
  const init = useAuthStore(s => s.init)

  useEffect(() => {
    const unsubscribe = init()
    return unsubscribe
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Admin routes — own layout, no customer UI ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Admin />} />
                <Route path="products"  element={<AdminProducts />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* ── Customer routes — public UI ── */}
        <Route path="/*" element={
          <>
            <Navbar />
            <CartSidebar />
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/shop"       element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout"   element={<Checkout />} />
              <Route path="/track"      element={<Track />} />
              <Route path="/terms"      element={<Terms />} />
              <Route path="/privacy"    element={<Privacy />} />
              <Route path="/returns"    element={<ReturnRefund />} />
              <Route path="/shipping"   element={<Shipping />} />
              <Route path="/about"      element={<PlaceholderPage title="Our Story"   emoji="🌾" />} />
              <Route path="/bulk"       element={<Bulk />} />
            </Routes>
            <Footer />
          </>
        } />

      </Routes>
    </BrowserRouter>
  )
}

function PlaceholderPage({ title, emoji }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '6rem', gap: '1rem', background: 'var(--warm-white)',
    }}>
      <span style={{ fontSize: '4rem' }}>{emoji}</span>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: 'var(--brown-deep)' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--muted)' }}>Coming soon — we're working on it!</p>
    </div>
  )
}
