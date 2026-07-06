// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader, AlertCircle, ShieldCheck } from 'lucide-react'
import { loginAdmin } from '../firebase/auth'
import useAuthStore from '../store/authStore'

const getFriendlyError = (msg) => {
  if (msg?.includes('Invalid credentials'))
    return 'Incorrect email or password. Please try again.'
  if (msg?.includes('Too many') || msg?.includes('too-many'))
    return 'Too many attempts. Please wait a few minutes.'
  if (msg?.includes('network') || msg?.includes('Network'))
    return 'Network error. Check your internet connection.'
  return msg || 'Login failed. Please check your credentials.'
}

export default function AdminLogin() {
  const navigate  = useNavigate()
  const setUser   = useAuthStore(s => s.setUser)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter both email and password.'); return }
    setLoading(true)
    setError(null)
    try {
      const user = await loginAdmin(email, password)
      setUser(user)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(getFriendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--warm-white)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:'420px', background:'white', borderRadius:'var(--radius-lg)', padding:'2.5rem', boxShadow:'0 20px 60px rgba(90,50,20,0.12)', border:'1px solid rgba(201,168,76,0.15)' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'56px', height:'56px', background:'var(--brown-deep)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
            <ShieldCheck size={28} color="var(--gold-light)" />
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:900, color:'var(--brown-deep)', marginBottom:'0.3rem' }}>Admin Login</h1>
          <p style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Valmiki Foods Dashboard</p>
        </div>

        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'var(--radius-sm)', padding:'0.8rem 1rem', marginBottom:'1.2rem' }}>
            <AlertCircle size={16} color="#dc2626" style={{ flexShrink:0 }} />
            <span style={{ fontSize:'0.82rem', color:'#dc2626' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
          <div>
            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--brown)', marginBottom:'0.4rem', letterSpacing:'0.05em' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@valmikifoods.com"
              style={{ width:'100%', padding:'0.75rem 1rem', border:'1.5px solid rgba(201,168,76,0.3)', borderRadius:'var(--radius-sm)', fontSize:'0.88rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--brown)', marginBottom:'0.4rem', letterSpacing:'0.05em' }}>Password</label>
            <div style={{ position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width:'100%', padding:'0.75rem 2.8rem 0.75rem 1rem', border:'1.5px solid rgba(201,168,76,0.3)', borderRadius:'var(--radius-sm)', fontSize:'0.88rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position:'absolute', right:'0.8rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:0 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'0.85rem', background:'var(--brown-deep)', color:'var(--gold-light)', border:'none', borderRadius:'var(--radius-sm)', fontSize:'0.92rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'0.5rem', opacity: loading ? 0.7 : 1, transition:'all 0.2s' }}
          >
            {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }} /> Logging in…</> : 'Login'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
