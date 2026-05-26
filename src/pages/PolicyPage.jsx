// src/pages/PolicyPage.jsx
import { Link } from 'react-router-dom'

export default function PolicyPage({ title, subtitle, lastUpdated, sections }) {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(42,21,8,0.03))',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: '0.9rem',
          }}>
            Policy Center
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            lineHeight: 1.1,
            color: 'var(--brown-deep)',
            marginBottom: '0.75rem',
            fontWeight: 900,
          }}>
            {title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '760px', marginBottom: '0.5rem' }}>
            {subtitle}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        <div style={{ paddingTop: '2rem', display: 'grid', gap: '1rem' }}>
          {sections.map(section => (
            <section key={section.title} style={{
              background: 'white',
              borderRadius: '18px',
              border: '1px solid rgba(201,168,76,0.14)',
              padding: '1.5rem 1.6rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.35rem',
                color: 'var(--brown-deep)',
                marginBottom: '0.75rem',
                fontWeight: 800,
              }}>
                {section.title}
              </h2>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} style={{ color: 'var(--brown)', lineHeight: 1.8, fontSize: '0.96rem' }}>
                    {paragraph}
                  </p>
                ))}
                {section.items?.length ? (
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.55rem', color: 'var(--brown)', lineHeight: 1.7 }}>
                    {section.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}