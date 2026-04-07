// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1rem', background: 'var(--warm-white)',
      }}>
        <img src="/makhana-icon.png" alt="" style={{ width:"52px",height:"52px",objectFit:"contain",animation:"bounce 1s ease infinite",mixBlendMode:"multiply" }} />
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Checking session...</p>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return children
}
