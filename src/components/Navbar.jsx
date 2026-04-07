// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import useCartStore from '../store/cartStore'

const LINKS = [
  { to: '/shop',  label: 'Shop' },
  { to: '/about', label: 'Our Story' },
  { to: '/bulk',  label: 'Bulk Orders' },
  { to: '/track', label: 'Track Order' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { items, toggleCart } = useCartStore()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <>
      <nav className={`nb-nav ${scrolled ? 'nb-nav--scrolled' : ''}`}>

        {/* Logo */}
        <Link to="/" className="nb-logo">
          {/* Makhana image — mix-blend-mode removes black bg */}
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '10px',
            background: 'var(--brown-deep)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img
              src="/makhana-icon.png"
              alt="makhana"
              style={{
                width: '42px', height: '42px',
                objectFit: 'contain',
                mixBlendMode: 'lighten',
              }}
            />
          </div>
          {/* Valmiki Foods logo image */}
          <img
            src="/valmiki-logo.png"
            alt="Valmiki Foods"
            style={{
              height: '38px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="nb-links">
          {LINKS.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`nb-link ${location.pathname === l.to ? 'nb-link--active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="nb-right">
          {/* Cart */}
          <button className="nb-cart" onClick={toggleCart} aria-label="Open cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="nb-cart-badge">{totalItems}</span>
            )}
          </button>

          {/* Admin */}
          <Link to="/admin" className="nb-admin-btn">
            Admin
          </Link>

          {/* Mobile hamburger */}
          <button className="nb-hamburger" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="nb-mobile">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to} className="nb-mobile-link">{l.label}</Link>
          ))}
          <Link to="/admin" className="nb-mobile-link" style={{ color: 'var(--gold)' }}>Admin Panel</Link>
          <button
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            onClick={() => { toggleCart(); setMobileOpen(false) }}
          >
            <ShoppingBag size={16} />
            Cart {totalItems > 0 ? `(${totalItems})` : ''}
          </button>
        </div>
      )}

      <style>{`
        .nb-nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:1rem 4rem;
          background:rgba(250,247,242,0.85);
          backdrop-filter:blur(18px);
          border-bottom:1px solid transparent;
          transition:all 0.35s ease;
        }
        .nb-nav--scrolled {
          background:rgba(250,247,242,0.96);
          border-bottom-color:rgba(201,168,76,0.2);
          box-shadow:0 2px 20px rgba(90,50,20,0.08);
        }

        /* Logo */
        .nb-logo { display:flex; align-items:center; gap:0.75rem; text-decoration:none; }

        /* Links */
        .nb-links { display:flex; list-style:none; gap:0; align-items:center; }
        .nb-link {
          font-size:0.82rem; font-weight:500; letter-spacing:0.07em;
          text-transform:uppercase; color:var(--brown);
          padding:0.5rem 1.1rem; transition:color 0.2s;
          position:relative;
        }
        .nb-link::after {
          content:''; position:absolute; bottom:0; left:1.1rem; right:1.1rem;
          height:1.5px; background:var(--gold);
          transform:scaleX(0); transition:transform 0.25s ease;
        }
        .nb-link:hover, .nb-link--active { color:var(--brown-deep); }
        .nb-link:hover::after, .nb-link--active::after { transform:scaleX(1); }

        /* Right actions */
        .nb-right { display:flex; align-items:center; gap:0.8rem; }

        /* Cart button */
        .nb-cart {
          position:relative; background:none; border:none;
          cursor:pointer; color:var(--brown-deep);
          display:flex; align-items:center; padding:0.4rem;
          transition:color 0.2s;
        }
        .nb-cart:hover { color:var(--gold); }
        .nb-cart-badge {
          position:absolute; top:-6px; right:-6px;
          background:var(--gold); color:var(--brown-deep);
          border-radius:50%; width:18px; height:18px;
          font-size:0.62rem; font-weight:700;
          display:flex; align-items:center; justify-content:center;
          border:2px solid var(--warm-white);
        }

        /* Admin button */
        .nb-admin-btn {
          font-size:0.8rem; font-weight:600; letter-spacing:0.05em;
          color:var(--brown-deep); text-decoration:none;
          padding:0.5rem 1.2rem;
          border:1.5px solid rgba(201,168,76,0.5);
          border-radius:2rem;
          transition:all 0.25s;
          white-space:nowrap;
        }
        .nb-admin-btn:hover {
          background:var(--brown-deep); color:var(--gold-light);
          border-color:var(--brown-deep);
        }

        /* Hamburger */
        .nb-hamburger { display:none; background:none; border:none; color:var(--brown-deep); padding:0.3rem; }

        /* Mobile menu */
        .nb-mobile {
          position:fixed; top:70px; left:0; right:0; z-index:190;
          background:var(--warm-white);
          padding:1.5rem;
          display:flex; flex-direction:column; gap:0.8rem;
          border-bottom:2px solid rgba(201,168,76,0.2);
          box-shadow:0 8px 30px rgba(90,50,20,0.12);
        }
        .nb-mobile-link {
          font-size:1rem; font-weight:600; color:var(--brown-deep);
          padding:0.6rem 0; border-bottom:1px solid rgba(201,168,76,0.15);
          text-decoration:none;
        }

        @media(max-width:900px) {
          .nb-nav { padding:0.9rem 1.5rem; }
          .nb-links { display:none; }
          .nb-admin-btn { display:none; }
          .nb-hamburger { display:flex; }
        }
      `}</style>
    </>
  )
}
