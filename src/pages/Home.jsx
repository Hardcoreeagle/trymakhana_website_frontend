// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const MARQUEE_ITEMS = [
  'Gluten Free', 'High Protein', 'Low Calorie', 'Vegan Friendly',
  'Ayurvedic Superfood', 'Natural & Clean', 'Bihar Sourced', 'Zero Preservatives',
  'Hand Harvested', 'Slow Roasted',
]

const FEATURES = [
  { icon: '🌾', title: 'Farm to Pouch', desc: "Sourced directly from Mithila's sacred ponds — zero middlemen, zero compromise." },
  { icon: '🔥', title: 'Slow Roasted',  desc: 'Traditional roasting that locks in crunch and flavour the way nature intended.' },
  { icon: '💚', title: 'No Nasties',    desc: 'No preservatives, no artificial colours, no MSG — just honest, clean snacking.' },
  { icon: '📦', title: 'Fast Delivery', desc: 'Pan-India shipping in 2–4 days with real-time order tracking on your phone.' },
]

const BENEFITS = [
  { icon: '🩺', text: 'Good for people with diabetes' },
  { icon: '✨', text: 'Boosts natural anti-ageing' },
  { icon: '🛡️', text: 'Boosts immunity' },
  { icon: '🫐', text: 'Rich in antioxidants' },
  { icon: '⚖️', text: 'Helps in losing weight' },
  { icon: '😴', text: 'Treats insomnia' },
  { icon: '🌟', text: 'Makes your skin glow' },
  { icon: '🦴', text: 'Rich in calcium, protein, fibre' },
  { icon: '❤️', text: 'Good for heart' },
]

const TESTIMONIALS = [
  { text: "Honestly the best makhana I've ever had. The peri peri flavour is completely addictive — I've already ordered three times!", author: 'Priya S.', city: 'Mumbai', rating: 5 },
  { text: 'My whole family switched from chips to Valmiki Foods. Fresh, crunchy, and ships super fast. Highly recommended.', author: 'Rahul M.', city: 'Delhi', rating: 5 },
  { text: "Ordered the classic salt and herb turmeric — both are phenomenal. Love that they're actually clean ingredients.", author: 'Ananya K.', city: 'Bangalore', rating: 4 },
]

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home() {
  useScrollReveal()
  const { products, loading } = useProducts()

  return (
    <div style={{ background: 'var(--warm-white)' }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Background image */}
        <img
          src="/board.png"
          alt="Valmiki Foods premium dry fruits"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 30%',
            pointerEvents: 'none',
          }}
        />
        {/* Overlay — stronger on left for text, fades right, solid at bottom to hide image text */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(8,4,1,0.88) 0%, rgba(8,4,1,0.65) 45%, rgba(8,4,1,0.2) 75%, rgba(8,4,1,0.4) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Bottom fade — covers the image's own text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
          background: 'linear-gradient(to top, rgba(8,4,1,0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          padding: '8rem 4rem 4rem',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          <div style={{ maxWidth: '560px' }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--gold-light)',
              marginBottom: '1.4rem',
            }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--gold)', display: 'block' }} />
              Premium Dry Fruits & Makhana
              <span style={{ width: '24px', height: '1px', background: 'var(--gold)', display: 'block' }} />
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
              fontWeight: 900, lineHeight: 1.06,
              color: '#ffffff', marginBottom: '1.2rem',
            }}>
              Valmiki Foods:<br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Pure Nutrition</em><br />
              In Every Bite.
            </h1>

            <p style={{
              fontSize: '1.05rem', color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.65, marginBottom: '2.2rem', maxWidth: '420px',
            }}>
              The finest curated dry fruits and makhanas — naturally sourced, carefully roasted, delivered fresh.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className="btn btn-outline-light">
                Explore Range
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['100% Natural', 'No Preservatives', 'Premium Quality', 'Pan-India Delivery'].map(b => (
                <span key={b} style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  color: 'rgba(255,255,255,0.82)',
                  background: 'rgba(255,255,255,0.12)',
                  padding: '0.3rem 0.8rem', borderRadius: '2rem',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--brown-deep)', overflow: 'hidden', padding: '1rem 0' }}>
        <div className="hm-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic', fontSize: '0.95rem',
              color: 'var(--gold-light)', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>✦</span>
              {t}
              <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAKHANA FLAVOURS ────────────────────────────────────── */}
      <section style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto' }} className="reveal">
        <div className="section-eyebrow" style={{ marginBottom: '0.7rem' }}>Makhana Range</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title">Find Your Favourite Flavour</h2>
          <Link to="/shop" style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Makhana brand banner */}
        <div className="hm-banner">
          <img src="/flavours-banner.JPG" alt="Valmiki Foods makhana flavours" className="hm-banner-img" />
          <div className="hm-banner-overlay">
            <div className="hm-banner-eyebrow">6 Bold Flavours</div>
            <div className="hm-banner-title">Pure Nutrition<br/>In Every Puff.</div>
            <Link to="/shop" className="hm-banner-btn">Shop Makhana →</Link>
          </div>
        </div>

        {/* Makhana 3-col grid — flavoured products */}
        {loading ? (
          <div className="hm-cat-grid">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="hm-skeleton" style={{ animationDelay: `${i * 0.1}s`, height: '340px' }} />
            ))}
          </div>
        ) : (
          <div className="hm-cat-grid">
            {products
              .filter(p => p.flavour && p.flavour.toLowerCase().includes('flavoured') || p.flavour === 'Plain')
              .slice(0, 6)
              .map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/shop" className="btn btn-outline">
            View All Makhana Flavours <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── DRY FRUITS ──────────────────────────────────────────── */}
      <section style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(201,168,76,0.15)' }} className="reveal">
        <div className="section-eyebrow" style={{ marginBottom: '0.7rem' }}>Premium Dry Fruits</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title">Nature's Finest Selection</h2>
          <Link to="/shop" style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Dry fruits banner */}
        <div className="hm-banner" style={{ marginBottom: '2.5rem' }}>
          <img src="/dryfruits-banner.jpg" alt="Premium dry fruits" className="hm-banner-img" style={{ objectPosition: 'center 40%' }} />
          <div className="hm-banner-overlay">
            <div className="hm-banner-eyebrow">Almonds · Cashews · Walnuts · Dates & More</div>
            <div className="hm-banner-title">The Finest<br/>Curated Dry Fruits.</div>
            <Link to="/shop" className="hm-banner-btn">Explore Dry Fruits →</Link>
          </div>
        </div>

        {/* Grid — shows products if added, else placeholder cards */}
        {loading ? (
          <div className="hm-cat-grid">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="hm-skeleton" style={{ animationDelay: `${i * 0.1}s`, height: '340px' }} />
            ))}
          </div>
        ) : products.filter(p => p.flavour && !p.flavour.toLowerCase().includes('flavoured') && p.flavour !== 'Plain').length === 0 ? (
          /* Placeholder cards — shown until client adds dry fruit products */
          <div className="hm-cat-grid">
            {['Almonds', 'Cashews', 'Walnuts'].map((name, i) => (
              <div key={name} style={{
                background: 'var(--cream)', borderRadius: '14px',
                overflow: 'hidden', border: '1.5px dashed rgba(201,168,76,0.3)',
              }}>
                <div style={{ height: '200px', background: ['#f5ecd8','#fef9e7','#fff0e0'][i], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', fontWeight: 900, color: 'var(--brown-deep)', opacity: 0.15 }}>{name[0]}</span>
                </div>
                <div style={{ padding: '1rem 1.1rem' }}>
                  <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Coming Soon</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--brown-deep)', marginBottom: '5px' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Premium quality, sourced fresh.</div>
                  <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>Available soon</span>
                    <Link to="/shop" style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>View Shop →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hm-cat-grid">
            {products
              .filter(p => p.flavour && !p.flavour.toLowerCase().includes('flavoured') && p.flavour !== 'Plain')
              .slice(0, 6)
              .map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        )}

        {products.filter(p => p.flavour && !p.flavour.toLowerCase().includes('flavoured') && p.flavour !== 'Plain').length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/shop" className="btn btn-outline">View All Dry Fruits <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--cream)',
        padding: '5rem 4rem',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
      }} className="reveal">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: '0.8rem' }}>Why Makhana</div>
            <h2 className="section-title">Valmiki Makhana Benefits</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                background: 'white', borderRadius: 'var(--radius-md)',
                padding: '1rem 1.2rem',
                border: '1px solid rgba(201,168,76,0.15)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--brown-deep)' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--brown-deep)', padding: '6rem 4rem' }} className="reveal">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '0.8rem' }}>Why Valmiki Foods</div>
          <h2 className="section-title" style={{ color: 'var(--cream)', marginBottom: '3rem' }}>The Purity Promise</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="hm-feature-card">
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.05rem', fontWeight: 700,
                  color: 'var(--gold-light)', marginBottom: '0.5rem',
                }}>{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(250,247,242,0.58)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section style={{ padding: '6rem 4rem' }} className="reveal">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-eyebrow" style={{ marginBottom: '0.8rem' }}>Happy Snackers</div>
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>What People Are Saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: 'var(--cream)', borderRadius: 'var(--radius-md)',
                padding: '2rem', position: 'relative',
                border: '1px solid rgba(201,168,76,0.18)',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '3.5rem', color: 'var(--gold-light)',
                  position: 'absolute', top: '0.4rem', left: '1rem', lineHeight: 1,
                }}>"</div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '1.2rem', marginBottom: '0.8rem' }}>
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={13} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--brown)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1rem' }}>
                  {t.text}
                </p>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--brown-deep)' }}>
                  {t.author} <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· {t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--gold) 0%, #e8a82a 100%)',
        padding: '5rem 4rem', textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          fontWeight: 900, color: 'var(--brown-deep)', marginBottom: '0.8rem',
        }}>
          Ready to Snack Smarter?
        </h2>
        <p style={{ color: 'rgba(42,21,8,0.72)', fontSize: '1rem', marginBottom: '2rem' }}>
          Free shipping on orders above ₹499 · Same-day dispatch before 2 PM
        </p>
        <Link to="/shop" className="btn btn-primary">
          Shop All Flavours <ArrowRight size={16} />
        </Link>
      </section>

      <style>{`
        .hm-marquee-track {
          display:flex; gap:2.5rem;
          animation:hm-marquee 26s linear infinite;
          width:max-content;
        }
        @keyframes hm-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* Flavours banner */
        .hm-banner { border-radius:var(--radius-lg); overflow:hidden; margin-bottom:2.5rem; position:relative; height:260px; }
        .hm-banner-img { width:100%; height:100%; object-fit:cover; object-position:center 42%; display:block; }
        .hm-banner-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(12,6,2,0.72) 0%,rgba(12,6,2,0.35) 55%,rgba(12,6,2,0.05) 100%); display:flex; flex-direction:column; justify-content:center; padding:2.5rem 3rem; }
        .hm-banner-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-light); margin-bottom:0.6rem; }
        .hm-banner-title { font-family:'Playfair Display',serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:900; color:white; line-height:1.15; margin-bottom:1.2rem; }
        .hm-banner-btn { display:inline-block; background:var(--gold); color:var(--brown-deep); font-size:13px; font-weight:700; padding:0.6rem 1.4rem; border-radius:2rem; text-decoration:none; transition:all 0.25s; width:fit-content; }
        .hm-banner-btn:hover { background:var(--brown-deep); color:var(--gold-light); }

        /* 3-col catalogue grid */
        .hm-cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }

        /* Skeleton */
        .hm-skeleton {
          flex:0 0 260px; height:360px;
          background:var(--cream); border-radius:var(--radius-md);
          animation:hm-pulse 1.5s ease infinite;
        }
        @keyframes hm-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }

        /* Feature card */
        .hm-feature-card {
          padding:1.8rem;
          border:1px solid rgba(201,168,76,0.2);
          border-radius:var(--radius-md);
          transition:background 0.3s, border-color 0.3s;
        }
        .hm-feature-card:hover { background:rgba(201,168,76,0.08); border-color:var(--gold); }

        /* Responsive */
        @media(max-width:768px) {
          section[style] { padding-left:1.5rem !important; padding-right:1.5rem !important; }
          div[style*="padding: '8rem 4rem'"] { padding:7rem 1.5rem 3rem !important; }
          .hm-banner { height:200px; }
          .hm-banner-overlay { padding:1.5rem; }
          .hm-cat-grid { grid-template-columns:repeat(2,1fr); gap:1rem; }
        }
        @media(max-width:480px) {
          .hm-cat-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  )
}
