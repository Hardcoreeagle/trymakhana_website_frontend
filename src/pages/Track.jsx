// src/pages/Track.jsx
import { useState } from 'react'
import { Search, Package, CheckCircle, Truck, Clock, XCircle, Loader, MapPin, Phone, Mail } from 'lucide-react'
import { fetchOrderByIdFirestore, fetchOrdersByEmailFirestore } from '../firebase/orders'

const STEPS = [
  { key: 'pending',   label: 'Order Placed',  icon: Clock,        desc: 'We have received your order.' },
  { key: 'confirmed', label: 'Confirmed',      icon: CheckCircle,  desc: 'Your order has been confirmed and is being packed.' },
  { key: 'shipped',   label: 'Shipped',        icon: Truck,        desc: 'Your order is on the way!' },
  { key: 'delivered', label: 'Delivered',      icon: Package,      desc: 'Your order has been delivered. Enjoy!' },
]

const STATUS_INDEX = { pending: 0, confirmed: 1, shipped: 2, delivered: 3, cancelled: -1 }

function StatusTracker({ status }) {
  const current = STATUS_INDEX[status] ?? 0
  const isCancelled = status === 'cancelled'

  if (isCancelled) {
    return (
      <div className="tr-cancelled">
        <XCircle size={36} color="#ef4444" />
        <div>
          <div className="tr-cancelled-title">Order Cancelled</div>
          <div className="tr-cancelled-sub">This order has been cancelled. Please contact support for help.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="tr-steps">
      {STEPS.map((step, i) => {
        const done    = i < current
        const active  = i === current
        const pending = i > current
        const Icon    = step.icon
        return (
          <div key={step.key} className="tr-step">
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className={`tr-line ${done || active ? 'tr-line--done' : ''}`} />
            )}
            {/* Circle */}
            <div className={`tr-circle ${done ? 'tr-circle--done' : active ? 'tr-circle--active' : 'tr-circle--pending'}`}>
              {done
                ? <CheckCircle size={18} />
                : <Icon size={18} />
              }
            </div>
            {/* Label */}
            <div className="tr-step-info">
              <div className={`tr-step-label ${active ? 'tr-step-label--active' : pending ? 'tr-step-label--pending' : ''}`}>
                {step.label}
              </div>
              {active && <div className="tr-step-desc">{step.desc}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrderCard({ order }) {
  const createdAt = order.createdAt?.toDate?.()
  const updatedAt = order.updatedAt?.toDate?.()

  return (
    <div className="tr-order-card">
      {/* Order header */}
      <div className="tr-order-header">
        <div>
          <div className="tr-order-id">Order #{order.id}</div>
          {createdAt && (
            <div className="tr-order-date">
              Placed on {createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
        <div className={`tr-status-badge tr-status-${order.status}`}>
          {order.status}
        </div>
      </div>

      {/* Status tracker */}
      <div className="tr-tracker-wrap">
        <StatusTracker status={order.status} />
      </div>

      {/* Items + address row */}
      <div className="tr-details-grid">
        {/* Items */}
        <div className="tr-section">
          <div className="tr-section-title">Items Ordered</div>
          <div className="tr-items">
            {(order.items || []).map((item, i) => (
              <div key={i} className="tr-item">
                <div className="tr-item-dot" />
                <span className="tr-item-name">{item.name}</span>
                <span className="tr-item-qty">×{item.quantity}</span>
                <span className="tr-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="tr-total-row">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="tr-section">
          <div className="tr-section-title">Delivery Details</div>
          <div className="tr-delivery-info">
            {order.customer?.name && (
              <div className="tr-info-row">
                <Package size={14} />
                <span>{order.customer.name}</span>
              </div>
            )}
            {order.customer?.phone && (
              <div className="tr-info-row">
                <Phone size={14} />
                <span>{order.customer.phone}</span>
              </div>
            )}
            {order.customer?.email && (
              <div className="tr-info-row">
                <Mail size={14} />
                <span>{order.customer.email}</span>
              </div>
            )}
            {order.address && (
              <div className="tr-info-row" style={{ alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  {order.address.line}, {order.address.city},<br />
                  {order.address.state} — {order.address.pincode}
                </span>
              </div>
            )}
          </div>

          {/* Delivery timeline note */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div style={{
              marginTop: '1rem', padding: '0.8rem 1rem',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem', color: 'var(--brown)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              🚚 Orders are delivered within <strong style={{ marginLeft: '3px' }}>5–7 business days</strong> after dispatch.
            </div>
          )}

          {order.courierTrackingNo && (
            <div style={{
              marginTop: '1rem', padding: '0.8rem 1rem',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: '0.4rem' }}>
                Courier Tracking
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--brown)', fontWeight: 600 }}>
                🚚 {order.courierName}
              </div>
              <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--brown)', marginTop: '0.2rem' }}>
                {order.courierTrackingNo}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                Use this number on the courier's website to track your shipment
              </div>
            </div>
          )}
          {updatedAt && (
            <div className="tr-last-updated">
              Last updated: {updatedAt.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Track() {
  const [query, setQuery]     = useState('')
  const [mode, setMode]       = useState('id')   // 'id' | 'email'
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    const val = query.trim()
    if (!val) return
    setLoading(true)
    setError(null)
    setOrders([])
    setSearched(true)

    try {
      if (mode === 'id') {
        const order = await fetchOrderByIdFirestore(val)
        setOrders([order])
      } else {
        const results = await fetchOrdersByEmailFirestore(val)
        if (results.length === 0) throw new Error('NO_ORDERS')
        setOrders(results)
      }
    } catch (err) {
      if (err.message === 'Order not found' || err.message === 'NO_ORDERS') {
        setError(mode === 'id'
          ? 'No order found with that ID. Please check and try again.'
          : 'No orders found for that email address.'
        )
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tr-page">
      {/* Hero */}
      <div className="tr-hero">
        <div className="tr-hero-inner">
          <div className="section-eyebrow" style={{ color: 'var(--gold)' }}>Order Tracking</div>
          <h1 className="tr-hero-title">Track Your Order</h1>
          <p className="tr-hero-sub">Enter your order ID or email address to see the latest status of your delivery.</p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="tr-form">
            {/* Mode toggle */}
            <div className="tr-toggle">
              <button
                type="button"
                className={`tr-toggle-btn ${mode === 'id' ? 'tr-toggle-btn--active' : ''}`}
                onClick={() => { setMode('id'); setQuery(''); setOrders([]); setError(null); setSearched(false) }}
              >
                Order ID
              </button>
              <button
                type="button"
                className={`tr-toggle-btn ${mode === 'email' ? 'tr-toggle-btn--active' : ''}`}
                onClick={() => { setMode('email'); setQuery(''); setOrders([]); setError(null); setSearched(false) }}
              >
                Email Address
              </button>
            </div>

            <div className="tr-search-row">
              <input
                className="tr-input"
                type={mode === 'email' ? 'email' : 'text'}
                placeholder={mode === 'id' ? 'Paste your Order ID here…' : 'Enter your email address…'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="tr-search-btn" disabled={loading || !query.trim()}>
                {loading
                  ? <Loader size={18} className="tr-spin" />
                  : <><Search size={18} /> Track</>
                }
              </button>
            </div>
          </form>
        </div>
        <div className="tr-hero-orb" />
      </div>

      {/* Results */}
      <div className="tr-results">
        {/* Error */}
        {error && (
          <div className="tr-error">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* No results yet */}
        {!loading && !error && searched && orders.length === 0 && (
          <div className="tr-empty">
            <img src="/makhana-icon.png" alt="" style={{ width:"44px",height:"44px",objectFit:"contain",opacity:0.5,mixBlendMode:"multiply" }} />
            <p>No orders found.</p>
          </div>
        )}

        {/* Order cards */}
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}

        {/* Idle hint */}
        {!searched && (
          <div className="tr-hint-wrap">
            <div className="tr-hint-card">
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <div className="tr-hint-title">Where's my order?</div>
              <p className="tr-hint-text">
                You can find your <strong>Order ID</strong> in the confirmation screen after placing your order. Or search by the <strong>email</strong> you used at checkout to see all your orders.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .tr-page        { min-height:100vh; padding-top:6rem; background:var(--warm-white); }

        /* Hero */
        .tr-hero        { background:var(--brown-deep); padding:4rem 4rem 5rem; position:relative; overflow:hidden; }
        .tr-hero-inner  { position:relative; z-index:1; max-width:640px; margin:0 auto; text-align:center; }
        .tr-hero-title  { font-family:'Playfair Display',serif; font-size:clamp(2rem,4vw,3rem); font-weight:900; color:var(--cream); margin-bottom:0.8rem; }
        .tr-hero-sub    { font-size:0.95rem; color:rgba(250,247,242,0.6); margin-bottom:2.5rem; line-height:1.7; }
        .tr-hero-orb    { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(90,50,20,0.1),transparent 70%); top:-100px; right:-100px; pointer-events:none; }

        /* Form */
        .tr-form        { display:flex; flex-direction:column; gap:1rem; }
        .tr-toggle      { display:flex; background:rgba(255,255,255,0.08); border-radius:3rem; padding:0.3rem; width:fit-content; margin:0 auto; gap:0.2rem; }
        .tr-toggle-btn  { padding:0.45rem 1.4rem; border-radius:3rem; border:none; cursor:pointer; font-size:0.82rem; font-weight:500; font-family:inherit; background:transparent; color:rgba(250,247,242,0.55); transition:all 0.25s; }
        .tr-toggle-btn--active { background:var(--gold); color:var(--brown-deep); font-weight:600; }
        .tr-search-row  { display:flex; gap:0.8rem; }
        .tr-input       { flex:1; padding:0.85rem 1.2rem; border:1.5px solid rgba(90,50,20,0.25); border-radius:3rem; font-size:0.92rem; font-family:inherit; background:rgba(255,255,255,0.08); color:var(--cream); outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .tr-input::placeholder { color:rgba(250,247,242,0.35); }
        .tr-input:focus { border-color:var(--gold); background:rgba(255,255,255,0.12); }
        .tr-search-btn  { display:flex; align-items:center; gap:0.5rem; padding:0.85rem 1.8rem; background:var(--gold); color:var(--brown-deep); border:none; border-radius:3rem; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.25s; white-space:nowrap; }
        .tr-search-btn:hover:not(:disabled) { background:var(--gold-light); transform:translateY(-1px); }
        .tr-search-btn:disabled { opacity:0.6; cursor:not-allowed; }

        /* Results */
        .tr-results     { max-width:780px; margin:0 auto; padding:3rem 2rem 6rem; display:flex; flex-direction:column; gap:1.5rem; }

        /* Error */
        .tr-error       { display:flex; align-items:center; gap:0.7rem; padding:1rem 1.2rem; background:#fff1f1; border:1px solid #ffcccc; border-radius:var(--radius-md); color:#c0392b; font-size:0.88rem; }

        /* Empty */
        .tr-empty       { text-align:center; padding:3rem; color:var(--muted); display:flex; flex-direction:column; align-items:center; gap:0.8rem; }

        /* Order card */
        .tr-order-card  { background:white; border-radius:var(--radius-md); border:1px solid rgba(90,50,20,0.18); overflow:hidden; box-shadow:var(--shadow-card); }
        .tr-order-header{ display:flex; justify-content:space-between; align-items:flex-start; padding:1.5rem 1.8rem; border-bottom:1px solid rgba(90,50,20,0.12); gap:1rem; flex-wrap:wrap; }
        .tr-order-id    { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:700; color:var(--brown-deep); word-break:break-all; }
        .tr-order-date  { font-size:0.8rem; color:var(--muted); margin-top:0.25rem; }

        /* Status badge */
        .tr-status-badge { padding:0.35rem 1rem; border-radius:2rem; font-size:0.72rem; font-weight:700; text-transform:capitalize; white-space:nowrap; }
        .tr-status-pending   { background:#fef3c7; color:#d97706; }
        .tr-status-confirmed { background:#dbeafe; color:#2563eb; }
        .tr-status-shipped   { background:#ede9fe; color:#7c3aed; }
        .tr-status-delivered { background:#d1fae5; color:#059669; }
        .tr-status-cancelled { background:#fee2e2; color:#dc2626; }

        /* Steps */
        .tr-tracker-wrap { padding:2rem 1.8rem; background:var(--cream); border-bottom:1px solid rgba(90,50,20,0.12); }
        .tr-steps       { display:flex; align-items:flex-start; gap:0; position:relative; }
        .tr-step        { flex:1; display:flex; flex-direction:column; align-items:center; position:relative; }
        .tr-line        { position:absolute; top:18px; left:50%; width:100%; height:2px; background:rgba(90,50,20,0.2); z-index:0; transition:background 0.4s; }
        .tr-line--done  { background:var(--gold); }
        .tr-circle      { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; transition:all 0.3s; flex-shrink:0; }
        .tr-circle--done    { background:var(--gold); color:var(--brown-deep); }
        .tr-circle--active  { background:var(--brown-deep); color:var(--gold); box-shadow:0 0 0 4px rgba(90,50,20,0.25); animation:tr-pulse 2s ease infinite; }
        .tr-circle--pending { background:rgba(90,50,20,0.1); color:var(--muted); border:1.5px dashed rgba(90,50,20,0.3); }
        @keyframes tr-pulse { 0%,100%{box-shadow:0 0 0 4px rgba(90,50,20,0.25)} 50%{box-shadow:0 0 0 8px rgba(90,50,20,0.1)} }
        .tr-step-info   { text-align:center; margin-top:0.6rem; padding:0 0.3rem; }
        .tr-step-label  { font-size:0.75rem; font-weight:600; color:var(--brown); }
        .tr-step-label--active  { color:var(--brown-deep); }
        .tr-step-label--pending { color:var(--muted); font-weight:400; }
        .tr-step-desc   { font-size:0.68rem; color:var(--gold); margin-top:0.2rem; line-height:1.4; }

        /* Cancelled */
        .tr-cancelled       { display:flex; align-items:center; gap:1rem; padding:1.5rem; background:#fff5f5; border-radius:var(--radius-sm); }
        .tr-cancelled-title { font-weight:700; color:#dc2626; font-size:1rem; margin-bottom:0.25rem; }
        .tr-cancelled-sub   { font-size:0.83rem; color:#ef4444; }

        /* Details grid */
        .tr-details-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
        .tr-section      { padding:1.5rem 1.8rem; }
        .tr-section:first-child { border-right:1px solid rgba(90,50,20,0.12); }
        .tr-section-title{ font-size:0.72rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }

        /* Items */
        .tr-items       { display:flex; flex-direction:column; gap:0.5rem; }
        .tr-item        { display:flex; align-items:center; gap:0.6rem; font-size:0.85rem; }
        .tr-item-dot    { width:6px; height:6px; border-radius:50%; background:var(--gold); flex-shrink:0; }
        .tr-item-name   { flex:1; color:var(--brown); }
        .tr-item-qty    { color:var(--muted); font-size:0.8rem; }
        .tr-item-price  { font-weight:600; color:var(--brown-deep); }
        .tr-total-row   { display:flex; justify-content:space-between; padding-top:0.8rem; margin-top:0.3rem; border-top:1px solid rgba(90,50,20,0.2); font-family:'Playfair Display',serif; font-weight:700; font-size:1rem; color:var(--brown-deep); }

        /* Delivery info */
        .tr-delivery-info { display:flex; flex-direction:column; gap:0.7rem; }
        .tr-info-row    { display:flex; align-items:center; gap:0.6rem; font-size:0.85rem; color:var(--brown); }
        .tr-info-row svg { color:var(--gold); flex-shrink:0; }
        .tr-last-updated{ font-size:0.72rem; color:var(--muted); margin-top:1rem; }

        /* Hint */
        .tr-hint-wrap   { display:flex; justify-content:center; }
        .tr-hint-card   { max-width:420px; text-align:center; padding:3rem 2rem; background:var(--cream); border-radius:var(--radius-md); border:1px solid rgba(90,50,20,0.18); display:flex; flex-direction:column; align-items:center; gap:0.8rem; }
        .tr-hint-title  { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:var(--brown-deep); }
        .tr-hint-text   { font-size:0.85rem; color:var(--muted); line-height:1.7; }

        /* Spinner */
        .tr-spin        { animation:tr-spin 1s linear infinite; }
        @keyframes tr-spin { to { transform:rotate(360deg); } }

        /* Responsive */
        @media (max-width:640px) {
          .tr-hero        { padding:3rem 1.5rem 4rem; }
          .tr-results     { padding:2rem 1.2rem 4rem; }
          .tr-search-row  { flex-direction:column; }
          .tr-search-btn  { width:100%; justify-content:center; }
          .tr-details-grid{ grid-template-columns:1fr; }
          .tr-section:first-child { border-right:none; border-bottom:1px solid rgba(90,50,20,0.12); }
          .tr-step-desc   { display:none; }
        }
      `}</style>
    </div>
  )
}
