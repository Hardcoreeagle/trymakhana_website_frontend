// src/pages/Admin.jsx
import { useEffect, useState, useMemo } from 'react'
import {
  fetchAllOrdersFirestore, updateOrderStatusFirestore,
  updateCourierInfoFirestore, updatePaymentStatusFirestore,
} from '../firebase/orders'
import {
  RefreshCw, Package, Clock, Truck, CheckCircle,
  XCircle, Search, ChevronDown, ChevronUp,
  BarChart2, TrendingUp, Edit2, Save, X, IndianRupee,
} from 'lucide-react'

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_CFG = {
  pending:   { color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  confirmed: { color: '#2563eb', bg: '#dbeafe', label: 'Confirmed' },
  shipped:   { color: '#7c3aed', bg: '#ede9fe', label: 'Shipped' },
  delivered: { color: '#059669', bg: '#d1fae5', label: 'Delivered' },
  cancelled: { color: '#dc2626', bg: '#fee2e2', label: 'Cancelled' },
}

const COURIERS = ['Delhivery', 'DTDC', 'Bluedart', 'Ekart', 'India Post', 'Xpressbees', 'Other']

// ── Status badge ──────────────────────────────────────────────────────────
function Badge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '2rem',
      fontSize: '11px', fontWeight: 600,
      background: c.bg, color: c.color,
      textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

// ── Courier editor ────────────────────────────────────────────────────────
function CourierEditor({ order, onSave }) {
  const [editing, setEditing] = useState(false)
  const [courier, setCourier] = useState(order.courierName || '')
  const [trackNo, setTrackNo] = useState(order.courierTrackingNo || '')
  const [saving, setSaving]   = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(order.id, { courierName: courier, courierTrackingNo: trackNo })
    setSaving(false)
    setEditing(false)
  }

  if (!editing) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {order.courierTrackingNo
        ? <span style={{ fontSize: '0.82rem', color: 'var(--brown)' }}>
            {order.courierName} · <strong>{order.courierTrackingNo}</strong>
          </span>
        : <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            No courier info yet
          </span>
      }
      <button className="adm-sm-btn" onClick={e => { e.stopPropagation(); setEditing(true) }}>
        <Edit2 size={12} />
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
      <select className="adm-input" value={courier} onChange={e => setCourier(e.target.value)} style={{ flex: '0 0 auto' }}>
        <option value="">Courier…</option>
        {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        className="adm-input"
        placeholder="Tracking number"
        value={trackNo}
        onChange={e => setTrackNo(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        style={{ flex: 1, minWidth: '120px' }}
      />
      <button className="adm-sm-btn adm-sm-btn--green" onClick={handleSave} disabled={saving}>
        <Save size={12} /> {saving ? '…' : 'Save'}
      </button>
      <button className="adm-sm-btn adm-sm-btn--red" onClick={() => setEditing(false)}>
        <X size={12} />
      </button>
    </div>
  )
}

// ── Analytics panel ───────────────────────────────────────────────────────
function Analytics({ orders }) {
  const days = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const label   = d.toLocaleDateString('en-IN', { weekday: 'short' })
      const dateStr = d.toISOString().slice(0, 10)
      const revenue = orders
        .filter(o => o.status !== 'cancelled' && (o.createdAt || '').slice(0, 10) === dateStr)
        .reduce((s, o) => s + (o.total || 0), 0)
      result.push({ label, revenue })
    }
    return result
  }, [orders])

  const maxRev = Math.max(...days.map(d => d.revenue), 1)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
      {/* Revenue chart */}
      <div className="adm-card" style={{ padding: '1.5rem' }}>
        <div className="adm-section-label"><BarChart2 size={13} /> Revenue — Last 7 Days</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '90px', marginTop: '0.8rem' }}>
          {days.map(d => (
            <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', height: '100%' }}>
              <div style={{ fontSize: '9px', color: 'var(--muted)', textAlign: 'center', minHeight: '12px' }}>
                {d.revenue > 0 ? `₹${d.revenue}` : ''}
              </div>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', background: 'var(--gold)', borderRadius: '3px 3px 0 0', minHeight: '3px', height: `${(d.revenue / maxRev) * 100}%`, transition: 'height 0.5s' }} />
              </div>
              <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders by status */}
      <div className="adm-card" style={{ padding: '1.5rem' }}>
        <div className="adm-section-label"><TrendingUp size={13} /> Orders by Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.8rem' }}>
          {ORDER_STATUSES.map(s => {
            const count = orders.filter(o => o.status === s).length
            const pct   = orders.length > 0 ? (count / orders.length) * 100 : 0
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '12px', color: 'var(--brown)', textTransform: 'capitalize', minWidth: '72px' }}>{s}</span>
                <div style={{ flex: 1, height: '7px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: STATUS_CFG[s]?.color, borderRadius: '4px', transition: 'width 0.6s' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brown-deep)', minWidth: '20px', textAlign: 'right' }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Expanded order detail ─────────────────────────────────────────────────
function OrderDetail({ order, onStatusChange, onCourierSave, onPaymentChange }) {
  return (
    <div style={{ padding: '1.2rem 1.4rem', background: 'var(--cream)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>

        {/* Items */}
        <div>
          <div className="adm-section-label">Items Ordered</div>
          {(order.items || []).map((item, i) => (
            <div key={i} style={{ fontSize: '0.82rem', color: 'var(--brown)', marginBottom: '4px' }}>
              · {item.name} × {item.quantity}
              <span style={{ color: 'var(--muted)', marginLeft: '4px' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brown-deep)', marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
            Total: ₹{order.total}
          </div>
        </div>

        {/* Address */}
        <div>
          <div className="adm-section-label">Delivery Address</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--brown)', lineHeight: 1.65 }}>
            {order.address?.line || '—'}<br />
            {order.address?.city}, {order.address?.state}<br />
            Pincode: {order.address?.pincode}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
            📞 {order.customer?.phone || '—'}
          </div>
        </div>

        {/* Courier */}
        <div>
          <div className="adm-section-label">Courier & Tracking</div>
          <CourierEditor order={order} onSave={onCourierSave} />
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.4rem', fontStyle: 'italic', lineHeight: 1.5 }}>
            Customer sees tracking info on the Track Order page.
          </div>
        </div>

        {/* Status + Payment */}
        <div>
          <div className="adm-section-label">Update Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Status buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={e => { e.stopPropagation(); onStatusChange(order.id, s) }}
                  style={{
                    padding: '4px 10px', borderRadius: '2rem', border: 'none',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    background: order.status === s ? STATUS_CFG[s]?.color : 'rgba(90,50,20,0.08)',
                    color: order.status === s ? 'white' : 'var(--brown)',
                    transition: 'all 0.2s', textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Payment toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Payment:</span>
              <button
                onClick={e => { e.stopPropagation(); onPaymentChange(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid') }}
                style={{
                  padding: '3px 10px', borderRadius: '2rem', border: 'none',
                  fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fee2e2',
                  color: order.paymentStatus === 'paid' ? '#059669' : '#dc2626',
                }}
              >
                {order.paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid — click to mark paid'}
              </button>
            </div>

            {/* Timeline */}
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '0.3rem' }}>
              Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────
export default function Admin() {
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [updating, setUpdating]       = useState(null)
  const [expanded, setExpanded]       = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bulkStatus, setBulkStatus]   = useState('')
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [toast, setToast]             = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchAllOrdersFirestore()
      setOrders(data)
    } catch (e) {
      console.error(e)
      showToast('Failed to load orders. Check Firebase config.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      await updateOrderStatusFirestore(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showToast(`Order marked as ${status}`)
    } catch (e) {
      showToast('Failed to update status', 'error')
    }
    setUpdating(null)
  }

  const handleCourierSave = async (id, info) => {
    try {
      await updateCourierInfoFirestore(id, info)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...info } : o))
      showToast('Courier info saved')
    } catch (e) {
      showToast('Failed to save courier info', 'error')
    }
  }

  const handlePaymentChange = async (id, paymentStatus) => {
    try {
      await updatePaymentStatusFirestore(id, paymentStatus)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus } : o))
      showToast(`Payment marked as ${paymentStatus}`)
    } catch (e) {
      showToast('Failed to update payment', 'error')
    }
  }

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedIds.size === 0) return
    setBulkUpdating(true)
    await Promise.all([...selectedIds].map(id => updateOrderStatusFirestore(id, bulkStatus)))
    setOrders(prev => prev.map(o => selectedIds.has(o.id) ? { ...o, status: bulkStatus } : o))
    setSelectedIds(new Set()); setBulkStatus('')
    showToast(`${selectedIds.size} orders updated to ${bulkStatus}`)
    setBulkUpdating(false)
  }

  const filtered = useMemo(() => {
    let list = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(o =>
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, filterStatus, searchQuery])

  const stats = {
    total:     orders.length,
    revenue:   orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
    pending:   orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div className="adm-page">

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 999,
          padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)',
          background: toast.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: toast.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
          fontSize: '0.85rem', fontWeight: 500, boxShadow: 'var(--shadow-md)',
          animation: 'adm-slideIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'white', padding: '1.4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>Dashboard</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: 'var(--brown-deep)' }}>Order Management</h1>
        </div>
        <button className="adm-sm-btn" onClick={load} title="Refresh">
          <RefreshCw size={15} style={{ animation: loading ? 'adm-spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ padding: '1.8rem 2rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Orders', value: stats.total,                          icon: '📦' },
            { label: 'Revenue',      value: `₹${stats.revenue.toLocaleString()}`, icon: '💰' },
            { label: 'Pending',      value: stats.pending,                         icon: '⏳' },
            { label: 'Delivered',    value: stats.delivered,                       icon: '✅' },
          ].map(s => (
            <div key={s.label} className="adm-card" style={{ padding: '1.2rem' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--brown-deep)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Analytics toggle */}
        <button
          onClick={() => setShowAnalytics(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2rem', padding: '0.5rem 1.2rem', fontSize: '0.82rem', fontWeight: 500, color: 'var(--brown)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1rem', transition: 'all 0.2s' }}
        >
          <BarChart2 size={14} />
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          {showAnalytics ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {showAnalytics && <Analytics orders={orders} />}

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', border: '1.5px solid rgba(201,168,76,0.25)', borderRadius: '2rem', fontSize: '0.85rem', fontFamily: 'inherit', background: 'white', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Search by name, email or order ID…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', ...ORDER_STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.78rem',
                  fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  border: '1.5px solid',
                  borderColor: filterStatus === s ? 'var(--brown-deep)' : 'rgba(201,168,76,0.25)',
                  background: filterStatus === s ? 'var(--brown-deep)' : 'white',
                  color: filterStatus === s ? 'var(--gold-light)' : 'var(--brown)',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}
              >
                {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk bar */}
        {selectedIds.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.2rem', background: 'var(--brown-deep)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 500 }}>{selectedIds.size} selected</span>
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(201,168,76,0.3)', fontSize: '0.82rem', background: 'rgba(255,255,255,0.1)', color: 'var(--cream)', fontFamily: 'inherit' }}
            >
              <option value="">Set status…</option>
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || bulkUpdating}
              style={{ padding: '0.4rem 1rem', background: 'var(--gold)', color: 'var(--brown-deep)', border: 'none', borderRadius: '2rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {bulkUpdating ? 'Updating…' : 'Apply'}
            </button>
            <button onClick={() => setSelectedIds(new Set())} style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: 'rgba(250,247,242,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2rem', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear
            </button>
          </div>
        )}

        {/* Orders */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <img src="/makhana-icon.png" alt="" style={{ width: '52px', height: '52px', objectFit: 'contain', marginBottom: '0.8rem', animation: 'adm-bounce 1s ease infinite', mixBlendMode: 'multiply', display: 'block', margin: '0 auto 1rem' }} />
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-md)', color: 'var(--muted)' }}>
            <img src="/makhana-icon.png" alt="" style={{ width: '44px', height: '44px', objectFit: 'contain', opacity: 0.5, mixBlendMode: 'multiply', display: 'block', margin: '0 auto 1rem' }} />
            <p>{searchQuery ? 'No orders match your search.' : 'No orders yet.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map(order => (
              <div
                key={order.id}
                className="adm-card"
                style={{
                  cursor: 'pointer',
                  borderColor: expanded === order.id ? 'var(--gold)' : selectedIds.has(order.id) ? '#3b82f6' : 'rgba(201,168,76,0.15)',
                  background: selectedIds.has(order.id) ? '#f0f7ff' : 'white',
                  overflow: 'hidden',
                }}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {/* Summary row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 1.3rem', flexWrap: 'wrap' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(order.id)}
                    onChange={() => {}}
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedIds(prev => {
                        const n = new Set(prev)
                        n.has(order.id) ? n.delete(order.id) : n.add(order.id)
                        return n
                      })
                    }}
                    style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--gold)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--brown-deep)', fontSize: '0.9rem' }}>{order.customer?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'monospace', marginTop: '2px' }}>#{order.id?.slice(0, 16)}…</div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', minWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {order.customer?.email}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1rem', color: 'var(--brown)', minWidth: '65px' }}>
                    ₹{order.total}
                  </div>
                  <Badge status={order.status} />
                  {/* Quick status select */}
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    disabled={updating === order.id}
                    style={{ padding: '0.32rem 0.6rem', borderRadius: '0.5rem', border: '1.5px solid rgba(201,168,76,0.3)', fontSize: '0.78rem', cursor: 'pointer', background: 'white', fontFamily: 'inherit', opacity: updating === order.id ? 0.5 : 1 }}
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div style={{ color: 'var(--muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    {expanded === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>

                {/* Expanded */}
                {expanded === order.id && (
                  <OrderDetail
                    order={order}
                    onStatusChange={handleStatusChange}
                    onCourierSave={handleCourierSave}
                    onPaymentChange={handlePaymentChange}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .adm-page { min-height:100vh; background:#f8f5f0; font-family:'DM Sans',sans-serif; }
        .adm-card { background:white; border-radius:var(--radius-md); border:1px solid rgba(201,168,76,0.15); transition:border-color 0.2s; }
        .adm-section-label { font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem; }
        .adm-input { padding:0.4rem 0.7rem; border:1.5px solid rgba(201,168,76,0.3); border-radius:0.5rem; font-size:0.8rem; font-family:inherit; background:white; outline:none; }
        .adm-input:focus { border-color:var(--gold); }
        .adm-sm-btn { display:inline-flex; align-items:center; gap:0.35rem; padding:0.38rem 0.85rem; background:white; border:1px solid rgba(201,168,76,0.3); border-radius:var(--radius-sm); font-size:0.8rem; font-weight:500; cursor:pointer; color:var(--brown); font-family:inherit; transition:all 0.2s; }
        .adm-sm-btn:hover { background:var(--cream); }
        .adm-sm-btn--green { border-color:#059669; color:#059669; }
        .adm-sm-btn--green:hover { background:#d1fae5; }
        .adm-sm-btn--red { border-color:#dc2626; color:#dc2626; }
        .adm-sm-btn--red:hover { background:#fee2e2; }
        .adm-sm-btn:disabled { opacity:0.55; cursor:not-allowed; }
        @keyframes adm-spin   { to{transform:rotate(360deg)} }
        @keyframes adm-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes adm-slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @media (max-width:900px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns:repeat(2,1fr) !important; }
          div[style*="padding: '1.8rem 2rem'"] { padding:1.2rem !important; }
        }
      `}</style>
    </div>
  )
}
