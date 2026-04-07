// src/pages/Bulk.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Truck, Phone, Mail, CheckCircle } from 'lucide-react'

const TIERS = [
  { qty: '500g – 2kg',   label: 'Starter',    discount: '5% off',  desc: 'Perfect for gifting or small events' },
  { qty: '2kg – 5kg',    label: 'Business',   discount: '10% off', desc: 'Ideal for offices and regular orders' },
  { qty: '5kg – 10kg',   label: 'Wholesale',  discount: '15% off', desc: 'Great for stores and distributors' },
  { qty: '10kg+',        label: 'Enterprise', discount: '20% off', desc: 'Custom pricing for large volumes' },
]

const BENEFITS = [
  { icon: <Package size={22} />,  title: 'Custom Packaging',   desc: 'Branded packaging available for corporate gifting and retail.' },
  { icon: <Truck size={22} />,    title: 'Pan-India Delivery',  desc: 'We deliver bulk orders across India with tracked shipping.' },
  { icon: <CheckCircle size={22} />, title: 'Quality Guaranteed', desc: 'Same premium quality as retail — freshness guaranteed.' },
  { icon: <Phone size={22} />,    title: 'Dedicated Support',  desc: 'A dedicated account manager for all your bulk requirements.' },
]

const INITIAL = { name: '', company: '', email: '', phone: '', product: '', quantity: '', message: '' }

export default function Bulk() {
  const [form, setForm]       = useState(INITIAL)
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors]   = useState({})

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Required'
    if (!form.email.trim())    e.email    = 'Required'
    if (!form.phone.trim())    e.phone    = 'Required'
    if (!form.quantity.trim()) e.quantity = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    // Simulate a brief delay then show success
    // In production this would call backend or emailjs
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setSending(false)
  }

  const PRODUCTS = ['Plain Makhana', 'Cheese Makhana', 'Masala Makhana', 'Peri-Peri Makhana', 'Himalayan Pink Salt', 'Himalayan Salt & Pepper', 'Pudina Makhana', 'Almonds', 'Cashews', 'Walnuts', 'Pistachios', 'Mixed Dry Fruits', 'Other / Custom Mix']

  return (
    <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--warm-white)' }}>

      {/* Hero */}
      <div style={{ background: 'var(--brown-deep)', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow" style={{ color: 'var(--gold)', marginBottom: '0.8rem' }}>Wholesale & Bulk</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, color: 'var(--cream)', marginBottom: '0.8rem' }}>
            Bulk Orders
          </h1>
          <p style={{ color: 'rgba(250,247,242,0.62)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            Order in bulk for your business, gifting, events or retail store. Get exclusive discounts and dedicated support.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#enquiry-form" className="btn btn-gold">Get a Quote →</a>
            <a href="tel:+91XXXXXXXXXX" className="btn btn-outline-light" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={15} /> Call Us
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(201,168,76,0.07)' }} />
        <div style={{ position: 'absolute', right: '80px', bottom: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(201,168,76,0.05)' }} />
      </div>

      {/* Pricing tiers */}
      <section style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-eyebrow" style={{ marginBottom: '0.7rem' }}>Volume Pricing</div>
        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>The More You Order, The More You Save</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.2rem' }}>
          {TIERS.map((t, i) => (
            <div key={i} style={{
              background: i === 2 ? 'var(--brown-deep)' : 'white',
              border: `1px solid ${i === 2 ? 'var(--gold)' : 'rgba(201,168,76,0.18)'}`,
              borderRadius: 'var(--radius-md)', padding: '1.8rem',
              position: 'relative', overflow: 'hidden',
            }}>
              {i === 2 && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--gold)', color: 'var(--brown-deep)', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '2rem', letterSpacing: '0.08em' }}>
                  POPULAR
                </div>
              )}
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: i === 2 ? 'var(--gold)' : 'var(--gold)', marginBottom: '0.5rem' }}>{t.label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 900, color: i === 2 ? 'var(--cream)' : 'var(--brown-deep)', marginBottom: '0.3rem' }}>{t.discount}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: i === 2 ? 'rgba(250,247,242,0.75)' : 'var(--brown)', marginBottom: '0.6rem' }}>{t.qty}</div>
              <p style={{ fontSize: '0.82rem', color: i === 2 ? 'rgba(250,247,242,0.55)' : 'var(--muted)', lineHeight: 1.55 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '4rem', background: 'var(--cream)', borderTop: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--gold-pale)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: 'var(--brown-deep)', marginBottom: '0.3rem' }}>{b.title}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquiry-form" style={{ padding: '5rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-eyebrow" style={{ marginBottom: '0.7rem' }}>Get in Touch</div>
        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Request a Bulk Quote</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Fill in your requirements and we'll get back to you within 24 hours with a custom quote.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--cream)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <CheckCircle size={48} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: 'var(--brown-deep)', marginBottom: '0.5rem' }}>
              Enquiry Received!
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Thank you, {form.name}! We'll reach out to {form.email} within 24 hours with your custom quote.
            </p>
            <Link to="/shop" className="btn btn-primary">Continue Shopping <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} noValidate>

            {/* Name */}
            <div>
              <label className="bl-label">Full Name *</label>
              <input className={`bl-input${errors.name ? ' bl-input--err' : ''}`} placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <div className="bl-err">{errors.name}</div>}
            </div>

            {/* Company */}
            <div>
              <label className="bl-label">Company / Brand</label>
              <input className="bl-input" placeholder="Company name (optional)" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>

            {/* Email */}
            <div>
              <label className="bl-label">Email Address *</label>
              <input className={`bl-input${errors.email ? ' bl-input--err' : ''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <div className="bl-err">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div>
              <label className="bl-label">Phone Number *</label>
              <input className={`bl-input${errors.phone ? ' bl-input--err' : ''}`} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              {errors.phone && <div className="bl-err">{errors.phone}</div>}
            </div>

            {/* Product */}
            <div>
              <label className="bl-label">Product Required</label>
              <select className="bl-input" value={form.product} onChange={e => set('product', e.target.value)}>
                <option value="">Select product…</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="bl-label">Quantity Required *</label>
              <input className={`bl-input${errors.quantity ? ' bl-input--err' : ''}`} placeholder="e.g. 10kg, 50 packs" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
              {errors.quantity && <div className="bl-err">{errors.quantity}</div>}
            </div>

            {/* Message */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="bl-label">Additional Requirements</label>
              <textarea className="bl-input" rows={3} placeholder="Custom packaging, delivery timeline, specific flavour mix, etc." value={form.message} onChange={e => set('message', e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                {sending ? 'Sending…' : <>Submit Enquiry <ArrowRight size={15} /></>}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: '0.8rem' }}>
                Or reach us directly at <a href="mailto:valmikifoods@gmail.com" style={{ color: 'var(--gold)', fontWeight: 600 }}>valmikifoods@gmail.com</a>
              </p>
            </div>
          </form>
        )}
      </section>

      <style>{`
        .bl-label { display:block; font-size:0.75rem; font-weight:500; letter-spacing:0.05em; color:var(--brown-mid,#7a5030); margin-bottom:0.35rem; }
        .bl-input { width:100%; padding:0.72rem 0.95rem; border:1.5px solid rgba(201,168,76,0.3); border-radius:var(--radius-sm); font-size:0.88rem; font-family:inherit; background:white; color:var(--text); outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .bl-input:focus { border-color:var(--gold); }
        .bl-input--err { border-color:#ef4444 !important; }
        .bl-err { font-size:0.72rem; color:#ef4444; margin-top:0.25rem; }
        @media(max-width:768px) {
          form[style*="grid-template-columns"] { grid-template-columns:1fr !important; }
          div[style*="gridColumn: 'span 2'"] { grid-column:span 1 !important; }
          section[style*="padding: '5rem 4rem'"] { padding:3rem 1.5rem !important; }
          section[style*="padding: '4rem'"] { padding:2.5rem 1.5rem !important; }
          div[style*="padding: '4rem'"] { padding:3rem 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}
