// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader, AlertCircle, ShieldCheck } from 'lucide-react'
import { loginAdmin } from '../firebase/auth'

const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes.'
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.'
    default:
      return 'Login failed. Please check your credentials.'
  }
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter both email and password.'); return }
    setLoading(true)
    setError(null)
    try {
      await loginAdmin(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="al-page">
      {/* Left branding panel */}
      <div className="al-left">
        <div className="al-left-inner">
          <div className="al-brand">
            <img src="/valmiki-logo.png" alt="Valmiki Foods" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 className="al-tagline">Your orders,<br /><em>beautifully managed.</em></h2>
          <p className="al-desc">
            Real-time visibility over every order — from placement to doorstep delivery.
          </p>
          <div className="al-features">
            {['📦 Live order management','🚚 One-click status updates','💰 Revenue at a glance','🔒 Secured with Firebase Auth'].map(f => (
              <div key={f} className="al-feature">{f}</div>
            ))}
          </div>
        </div>
        <div className="al-orb al-orb1" />
        <div className="al-orb al-orb2" />
      </div>

      {/* Right form panel */}
      <div className="al-right">
        <div className="al-form-wrap">
          <div className="al-shield"><ShieldCheck size={28} color="var(--gold)" /></div>
          <h1 className="al-form-title">Admin Login</h1>
          <p className="al-form-sub">Sign in to access the dashboard</p>

          <form onSubmit={handleLogin} className="al-form" noValidate>
            {error && (
              <div className="al-error">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="al-field">
              <label className="al-label">Email Address</label>
              <input
                className="al-input"
                type="email"
                placeholder="admin@makhanamagic.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-pw-wrap">
                <input
                  className="al-input al-input-pw"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null) }}
                  autoComplete="current-password"
                />
                <button type="button" className="al-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading
                ? <><Loader size={16} className="al-spin" /> Signing in...</>
                : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div className="al-hint">
            🔑 First time? Go to <strong>Firebase Console → Authentication → Add user</strong> to create your admin account.
          </div>
        </div>
      </div>

      <style>{`
        .al-page  { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; font-family:'DM Sans',sans-serif; }
        .al-left  { background:var(--brown-deep); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; padding:3rem; }
        .al-left-inner { position:relative; z-index:1; max-width:400px; }
        .al-brand { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; color:var(--cream); margin-bottom:2.5rem; }
        .al-brand span { color:var(--gold); font-style:italic; }
        .al-tagline { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3vw,2.6rem); font-weight:900; color:var(--cream); line-height:1.15; margin-bottom:1.2rem; }
        .al-tagline em { color:var(--gold); }
        .al-desc  { font-size:0.9rem; color:rgba(250,247,242,0.55); line-height:1.7; margin-bottom:2.5rem; }
        .al-features { display:flex; flex-direction:column; gap:0.9rem; }
        .al-feature { font-size:0.88rem; color:rgba(250,247,242,0.75); }
        .al-orb   { position:absolute; border-radius:50%; pointer-events:none; }
        .al-orb1  { width:350px; height:350px; background:radial-gradient(circle, rgba(90,50,20,0.12), transparent 70%); top:-80px; right:-80px; }
        .al-orb2  { width:250px; height:250px; background:radial-gradient(circle, rgba(90,50,20,0.08), transparent 70%); bottom:-60px; left:-60px; }
        .al-right { background:var(--warm-white); display:flex; align-items:center; justify-content:center; padding:3rem 2rem; }
        .al-form-wrap { width:100%; max-width:400px; }
        .al-shield { width:56px; height:56px; background:var(--cream); border-radius:16px; display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem; border:1px solid rgba(90,50,20,0.3); }
        .al-form-title { font-family:'Playfair Display',serif; font-size:1.9rem; font-weight:900; color:var(--brown-deep); margin-bottom:0.4rem; }
        .al-form-sub { font-size:0.88rem; color:var(--muted); margin-bottom:2rem; }
        .al-form  { display:flex; flex-direction:column; gap:1.2rem; margin-bottom:1.5rem; }
        .al-field { display:flex; flex-direction:column; gap:0.35rem; }
        .al-label { font-size:0.78rem; font-weight:500; letter-spacing:0.05em; color:var(--muted); }
        .al-input { width:100%; padding:0.8rem 1rem; border:1.5px solid rgba(90,50,20,0.3); border-radius:var(--radius-sm); font-size:0.9rem; font-family:inherit; background:white; color:var(--text); outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .al-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(90,50,20,0.12); }
        .al-input-pw { padding-right:3rem; }
        .al-pw-wrap { position:relative; }
        .al-pw-toggle { position:absolute; right:0.9rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted); display:flex; align-items:center; padding:0; }
        .al-pw-toggle:hover { color:var(--brown); }
        .al-error { display:flex; align-items:flex-start; gap:0.6rem; padding:0.85rem 1rem; background:#fff1f1; border:1px solid #ffcccc; border-radius:var(--radius-sm); color:#c0392b; font-size:0.83rem; line-height:1.5; }
        .al-submit { width:100%; padding:0.9rem; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:3rem; font-size:0.92rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition:all 0.3s; font-family:inherit; }
        .al-submit:hover:not(:disabled) { background:var(--gold); color:var(--brown-deep); transform:translateY(-1px); box-shadow:0 6px 20px rgba(90,50,20,0.3); }
        .al-submit:disabled { opacity:0.7; cursor:not-allowed; }
        .al-hint  { padding:1rem; background:rgba(90,50,20,0.08); border-radius:var(--radius-sm); border:1px solid rgba(90,50,20,0.2); font-size:0.8rem; color:var(--muted); line-height:1.6; }
        .al-spin  { animation:al-spin 1s linear infinite; }
        @keyframes al-spin { to { transform:rotate(360deg); } }
        @media (max-width:768px) {
          .al-page { grid-template-columns:1fr; }
          .al-left { display:none; }
          .al-right { padding:5rem 1.5rem 2rem; }
        }
      `}</style>
    </div>
  )
}
