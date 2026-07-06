// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--brown-deep)',
      color: 'rgba(250,247,242,0.55)',
      padding: '4rem 4rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '2fr 1fr',
        gap: '3rem', marginBottom: '3rem',
      }} className="ft-grid">
        {/* Brand */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'var(--brown-deep)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/makhana-icon.png" alt="makhana" style={{ width: '34px', height: '34px', objectFit: 'contain', mixBlendMode: 'lighten' }} />
            </div>
            <img src="/valmiki-logo.png" alt="Valmiki Foods" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.8, maxWidth: '240px', marginBottom: '1.5rem' }}>
            Premium makhana and dry fruits, sourced fresh and delivered straight to your door.
          </p>
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            {['f', 'ig', 'yt'].map(s => (
              <div key={s} style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', color: 'var(--gold-light)', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 700,
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {[
          { title: 'Shop', links: [['All Flavours','/shop'],['New Arrivals','/shop'],['Bulk Orders','/bulk'],['Track Order','/track']] },
          { title: 'Support', links: [['Terms & Conditions','/terms'],['Privacy Policy','/privacy'],['Return & Refund','/returns'],['Shipping Policy','/shipping'],['Admin Panel','/admin']] },
        ].map(col => (
          <div key={col.title}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem',
            }}>{col.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{
                    fontSize: '0.85rem', color: 'rgba(250,247,242,0.55)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold-light)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(250,247,242,0.55)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        paddingTop: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <p style={{ fontSize: '0.78rem' }}>© 2025 Valmiki Foods. All rights reserved.</p>
        <p style={{ fontSize: '0.78rem' }}>Made with ❤️ for India's healthiest snack</p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; }
          footer { padding: 2.5rem 1.5rem 1.5rem !important; }
        }
      `}</style>
    </footer>
  )
}
