// src/pages/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Loader, AlertCircle } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { placeOrderFirestore } from '../firebase/orders'

const INITIAL = {
  name: '', email: '', phone: '',
  address: '', city: '', state: '', pincode: '',
}

// ── Standalone field component (defined OUTSIDE parent so it never remounts) ──
function Field({ label, field, half, form, errors, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="co-label">{label}</label>
      <input
        className={`co-input${errors[field] ? ' co-input--error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={e => onChange(field, e.target.value)}
        autoComplete="on"
      />
      {errors[field] && <div className="co-err">{errors[field]}</div>}
    </div>
  )
}

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [errors, setErrors] = useState({})
  const [firebaseError, setFirebaseError] = useState(null)

  const total    = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = total >= 499 ? 0 : 49
  const grand    = total + shipping

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                      e.name    = 'Name is required'
    if (!form.email.includes('@'))               e.email   = 'Enter a valid email'
    if (form.phone.replace(/\D/g,'').length < 10) e.phone = 'Enter a valid 10-digit number'
    if (!form.address.trim())                    e.address = 'Address is required'
    if (!form.city.trim())                       e.city    = 'City is required'
    if (!/^\d{6}$/.test(form.pincode))           e.pincode = 'Enter a valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setFirebaseError(null)

    try {
      const id = await placeOrderFirestore({
        customer: { name: form.name, email: form.email, phone: form.phone },
        address:  { line: form.address, city: form.city, state: form.state, pincode: form.pincode },
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, weight: i.weight || '' })),
        total: grand,
      })
      setOrderId(id)
      clearCart()
    } catch (err) {
      console.error('Order error:', err)
      if (err.message === 'TIMEOUT') {
        setFirebaseError('Request timed out. Check your Firebase keys in src/firebase/config.js and make sure Firestore Database is enabled.')
      } else {
        setFirebaseError(`Firebase error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (orderId) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--warm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 3rem' }}>
        <div style={{
          textAlign: 'center', maxWidth: '480px', width: '100%',
          background: 'var(--cream)', padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 20px 60px rgba(90,50,20,0.12)',
        }}>
          <CheckCircle size={56} color="var(--gold)" style={{ marginBottom: '1.2rem' }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--brown-deep)', marginBottom: '0.6rem' }}>
            Order Placed!
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Thank you, <strong style={{ color: 'var(--brown-deep)' }}>{form.name}</strong>! Your order has been received and is being processed.
          </p>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-md)',
            padding: '1rem 1.2rem', marginBottom: '1.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
          }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.4rem' }}>Your Order ID</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brown-deep)', fontSize: '0.88rem', wordBreak: 'break-all' }}>#{orderId}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.35rem' }}>Save this to track your order</div>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', marginBottom: '1.2rem', fontSize: '0.82rem', color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚚 Your order will be delivered within <strong style={{ marginLeft: '3px' }}>5–7 business days</strong>.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }} onClick={() => navigate('/track')}>
              Track My Order →
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.85rem' }} onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="co-center" style={{ flexDirection: 'column', gap: '1rem' }}>
        
        <p className="co-empty-title">Your bag is empty!</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Browse Flavours</button>
      </div>
    )
  }

  return (
    <div className="co-page">
      <div className="co-container">
        <div className="section-eyebrow">Almost there</div>
        <h1 className="co-heading">Complete Your Order</h1>

        <div className="co-layout">
          <div className="co-card">
            <h3 className="co-card-title">Delivery Details</h3>
            <div className="co-grid">
              <Field label="Full Name"    field="name"    placeholder="Your name"           form={form} errors={errors} onChange={handleChange} />
              <Field label="Email"        field="email"   placeholder="you@email.com"       form={form} errors={errors} onChange={handleChange} type="email" half />
              <Field label="Phone"        field="phone"   placeholder="10-digit number"     form={form} errors={errors} onChange={handleChange} type="tel"   half />
              <Field label="Full Address" field="address" placeholder="House no, street, area" form={form} errors={errors} onChange={handleChange} />
              <Field label="City"         field="city"    placeholder="City"                form={form} errors={errors} onChange={handleChange} half />
              <Field label="State"        field="state"   placeholder="State"               form={form} errors={errors} onChange={handleChange} half />
              <Field label="Pincode"      field="pincode" placeholder="6-digit pincode"     form={form} errors={errors} onChange={handleChange} half />
            </div>
            <div className="co-cod-note">
              💳 <strong>Cash on Delivery</strong> available · UPI &amp; card payment at the door
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(90,50,20,0.15)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🚚 <span>All orders delivered within <strong>5–7 business days</strong> after dispatch.</span>
              </div>
            </div>
          </div>

          <div className="co-card co-summary">
            <h3 className="co-card-title">Order Summary</h3>
            <div className="co-items">
              {items.map(item => {
                const imageUrl = item.images?.[0] || item.imageUrl || null
                const bg = item.gradient || '#f5ecd8'
                return (
                  <div key={item.id} className="co-item">
                    <div className="co-item-thumb" style={{ background: imageUrl ? '#f5f0e8' : bg }}>
                      {imageUrl
                        ? <img src={imageUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px', display:'block' }} />
                        : <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:900, color:'var(--brown-deep)', opacity:0.35 }}>{(item.name||'P')[0]}</span>
                      }
                    </div>
                    <div className="co-item-info">
                      <div className="co-item-name">{item.name}</div>
                      <div className="co-item-qty">x{item.quantity}</div>
                    </div>
                    <div className="co-item-price">₹{item.price * item.quantity}</div>
                  </div>
                )
              })}
            </div>
            <div className="co-totals">
              <div className="co-total-row"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="co-total-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#2d6a2d' : 'inherit' }}>{shipping === 0 ? 'FREE' : 'Rs.' + shipping}</span>
              </div>
              <div className="co-grand"><span>Total</span><span>₹{grand}</span></div>
            </div>

            {firebaseError && (
              <div className="co-error-banner">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{firebaseError}</span>
              </div>
            )}

            <button
              className="btn btn-primary co-full"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: '1.2rem', opacity: loading ? 0.75 : 1 }}
            >
              {loading
                ? <><Loader size={15} className="co-spin" /> Placing Order...</>
                : 'Place Order'}
            </button>
            {loading && <p className="co-loading-hint">Connecting to Firebase...</p>}
          </div>
        </div>
      </div>

      <style>{`
        .co-page        { min-height:100vh; padding-top:7rem; padding-bottom:4rem; }
        .co-container   { max-width:1000px; margin:0 auto; padding:0 2rem; }
        .co-heading     { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:var(--brown-deep); margin-bottom:2.5rem; }
        .co-layout      { display:grid; grid-template-columns:1fr 370px; gap:2rem; align-items:start; }
        .co-card        { background:var(--cream); border-radius:var(--radius-md); padding:2rem; border:1px solid rgba(90,50,20,0.18); }
        .co-summary     { position:sticky; top:7rem; }
        .co-card-title  { font-family:'Playfair Display',serif; font-weight:700; font-size:1.1rem; color:var(--brown-deep); margin-bottom:1.5rem; }
        .co-grid        { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .co-center      { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; padding-top:6rem; }
        .co-label       { display:block; font-size:0.78rem; font-weight:500; letter-spacing:0.05em; color:var(--muted); margin-bottom:0.35rem; }
        .co-input       { width:100%; padding:0.75rem 1rem; border:1.5px solid rgba(90,50,20,0.35); border-radius:var(--radius-sm); font-size:0.9rem; font-family:inherit; background:white; color:var(--text); outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .co-input:focus       { border-color:var(--gold); }
        .co-input--error      { border-color:#e05252 !important; }
        .co-err         { font-size:0.72rem; color:#e05252; margin-top:0.25rem; }
        .co-cod-note    { margin-top:1.5rem; padding:1rem; background:rgba(90,50,20,0.1); border-radius:var(--radius-sm); border:1px solid rgba(90,50,20,0.25); font-size:0.83rem; color:var(--muted); }
        .co-items       { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem; }
        .co-item        { display:flex; align-items:center; gap:0.8rem; }
        .co-item-thumb  { width:42px; height:42px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
        .co-item-info   { flex:1; min-width:0; }
        .co-item-name   { font-size:0.84rem; font-weight:600; color:var(--brown-deep); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .co-item-qty    { font-size:0.75rem; color:var(--muted); }
        .co-item-price  { font-weight:600; font-size:0.9rem; color:var(--brown); white-space:nowrap; }
        .co-totals      { border-top:1px solid rgba(90,50,20,0.2); padding-top:1rem; display:flex; flex-direction:column; gap:0.5rem; }
        .co-total-row   { display:flex; justify-content:space-between; font-size:0.88rem; color:var(--muted); }
        .co-total-row span:last-child { font-weight:500; color:var(--text); }
        .co-grand       { display:flex; justify-content:space-between; margin-top:0.5rem; padding-top:0.8rem; border-top:1px solid rgba(90,50,20,0.2); font-family:'Playfair Display',serif; font-size:1.25rem; font-weight:700; color:var(--brown-deep); }
        .co-error-banner{ margin-top:1rem; padding:0.9rem 1rem; background:#fff1f1; border:1px solid #ffcccc; border-radius:var(--radius-sm); color:#c0392b; font-size:0.82rem; display:flex; gap:0.6rem; line-height:1.5; align-items:flex-start; }
        .co-full        { width:100%; justify-content:center; padding:0.9rem; display:flex; align-items:center; gap:0.5rem; }
        .co-loading-hint{ text-align:center; font-size:0.78rem; color:var(--muted); margin-top:0.7rem; }
        .co-spin        { animation:spin 1s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .co-success-card  { text-align:center; max-width:460px; background:var(--cream); padding:3rem; border-radius:var(--radius-lg); border:1px solid rgba(90,50,20,0.2); box-shadow:var(--shadow-lg); }
        .co-success-title { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; color:var(--brown-deep); margin-bottom:0.7rem; }
        .co-success-sub   { color:var(--muted); margin-bottom:1.2rem; }
        .co-order-id-box  { background:var(--cream); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem; }
        .co-order-id-label{ font-size:0.72rem; color:var(--muted); margin-bottom:0.3rem; }
        .co-order-id-val  { font-family:monospace; font-weight:700; color:var(--brown-deep); font-size:0.88rem; word-break:break-all; }
        .co-success-email { font-size:0.85rem; color:var(--muted); margin-bottom:1.5rem; }
        .co-empty-title   { font-family:'Playfair Display',serif; font-size:1.3rem; color:var(--brown-deep); }
        @media (max-width:768px) {
          .co-layout    { grid-template-columns:1fr; }
          .co-summary   { position:static; }
          .co-container { padding:0 1rem; }
          .co-heading   { font-size:1.4rem; margin-bottom:1.5rem; }
          .co-page      { padding-top:5rem; padding-bottom:2rem; }
          .co-grid      { grid-template-columns:1fr; }
          .co-card      { padding:1.2rem; }
          .co-input     { font-size:16px; }
        }
      `}</style>
    </div>
  )
}
