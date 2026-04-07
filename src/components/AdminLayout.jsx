// src/components/AdminLayout.jsx
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Package, BarChart2, LogOut, ExternalLink } from 'lucide-react'
import { logoutAdmin } from '../firebase/auth'
import useAuthStore from '../store/authStore'
import Logo from './Logo'

const NAV_LINKS = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Orders'    },
  { to: '/admin/products',  icon: Package,         label: 'Products'  },
  { to: '/admin/analytics', icon: BarChart2,        label: 'Analytics' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="al-wrap">
      <aside className="al-sidebar">
        {/* Brand — click goes to home */}
        <div className="al-brand">
          <Link to="/" style={{ display: 'block' }}>
            <Logo height={40} style={{ filter: 'brightness(1.1)' }} />
          </Link>
          <div className="al-brand-sub">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav className="al-nav">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `al-nav-link ${isActive ? 'al-nav-link--active' : ''}`}
            >
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="al-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer" className="al-nav-link al-nav-link--muted">
            <ExternalLink size={16} />View Store
          </a>
          {user && (
            <div className="al-user">
              <div className="al-user-avatar">{user.email[0].toUpperCase()}</div>
              <div className="al-user-info">
                <div className="al-user-role">Admin</div>
                <div className="al-user-email">{user.email}</div>
              </div>
            </div>
          )}
          <button className="al-logout" onClick={handleLogout}>
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      <main className="al-main">{children}</main>

      <style>{`
        .al-wrap    { display:flex; min-height:100vh; background:#f8f5f0; font-family:'DM Sans',sans-serif; }
        .al-sidebar { width:220px; flex-shrink:0; background:var(--brown-deep); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100; }
        .al-brand   { padding:1.4rem 1.2rem 1.2rem; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; gap:0.3rem; }
        .al-brand-sub { font-size:0.62rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(250,247,242,0.35); font-family:'DM Sans',sans-serif; font-weight:500; }
        .al-nav     { padding:1.2rem 0.8rem; display:flex; flex-direction:column; gap:0.2rem; flex:1; }
        .al-nav-link { display:flex; align-items:center; gap:0.7rem; padding:0.7rem 0.9rem; border-radius:var(--radius-sm); font-size:0.88rem; font-weight:500; color:rgba(250,247,242,0.55); text-decoration:none; transition:all 0.2s; }
        .al-nav-link:hover { background:rgba(255,255,255,0.06); color:var(--cream); }
        .al-nav-link--active { background:rgba(201,168,76,0.15); color:var(--gold-light); }
        .al-nav-link--active svg { color:var(--gold); }
        .al-nav-link--muted { color:rgba(250,247,242,0.35); font-size:0.82rem; }
        .al-sidebar-bottom { padding:0.8rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; gap:0.5rem; }
        .al-user    { display:flex; align-items:center; gap:0.7rem; padding:0.7rem 0.5rem; }
        .al-user-avatar { width:30px; height:30px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:var(--brown-deep); flex-shrink:0; }
        .al-user-info  { min-width:0; }
        .al-user-role  { font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); font-weight:600; }
        .al-user-email { font-size:0.75rem; color:rgba(250,247,242,0.5); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .al-logout  { display:flex; align-items:center; gap:0.6rem; width:100%; padding:0.65rem 0.9rem; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); border-radius:var(--radius-sm); color:#fca5a5; font-size:0.82rem; font-weight:500; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .al-logout:hover { background:rgba(239,68,68,0.2); }
        .al-main { margin-left:220px; flex:1; min-height:100vh; overflow-y:auto; }
        @media (max-width:768px) {
          .al-sidebar { width:100%; height:56px; bottom:auto; flex-direction:row; align-items:center; padding:0; }
          .al-brand   { padding:0 1rem; border-bottom:none; border-right:1px solid rgba(255,255,255,0.06); }
          .al-brand-sub { display:none; }
          .al-nav     { flex-direction:row; padding:0 0.5rem; gap:0; flex:1; overflow-x:auto; }
          .al-nav-link { padding:0.5rem 0.7rem; font-size:0.78rem; white-space:nowrap; }
          .al-sidebar-bottom { display:none; }
          .al-main    { margin-left:0; padding-top:56px; }
        }
      `}</style>
    </div>
  )
}
