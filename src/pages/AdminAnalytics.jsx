// src/pages/AdminAnalytics.jsx
import { useEffect, useState, useMemo } from 'react'
import { fetchAllOrdersFirestore } from '../firebase/orders'
import { fetchAllProductsFromFirestore } from '../firebase/products'
import { TrendingUp, ShoppingBag, Package, IndianRupee, RefreshCw } from 'lucide-react'

const STATUS_COLORS = {
  pending:   '#d97706',
  confirmed: '#2563eb',
  shipped:   '#7c3aed',
  delivered: '#059669',
  cancelled: '#dc2626',
}

// Simple bar chart using divs
function BarChart({ data, color = 'var(--gold)', valuePrefix = '' }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' }}>
          <div style={{ fontSize: '9px', color: 'var(--muted)', textAlign: 'center', minHeight: '14px' }}>
            {d.value > 0 ? `${valuePrefix}${d.value > 999 ? `${(d.value/1000).toFixed(1)}k` : d.value}` : ''}
          </div>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%',
              background: color,
              borderRadius: '4px 4px 0 0',
              minHeight: '3px',
              height: `${(d.value / max) * 100}%`,
              transition: 'height 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: '9px', color: 'var(--muted)', textAlign: 'center' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

// Stat card
function StatCard({ label, value, sub, color = 'var(--brown-deep)', icon }) {
  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(201,168,76,0.15)',
      padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ color: 'var(--gold)', opacity: 0.6 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{sub}</div>}
    </div>
  )
}

export default function AdminAnalytics() {
  const [orders,   setOrders]   = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [range,    setRange]    = useState(30) // days

  const load = async () => {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([
        fetchAllOrdersFirestore(),
        fetchAllProductsFromFirestore(),
      ])
      setOrders(o)
      setProducts(p)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // ── Computed metrics ──────────────────────────────────────────────────────
  const now = new Date()

  const inRange = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - range)
    return orders.filter(o => o.createdAt && new Date(o.createdAt) >= cutoff)
  }, [orders, range])

  const revenue = useMemo(() =>
    inRange.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
  [inRange])

  const avgOrder = inRange.length > 0 ? Math.round(revenue / inRange.filter(o => o.status !== 'cancelled').length) || 0 : 0

  // Revenue by day (last 14 days)
  const revenueByDay = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const label   = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      const dateStr = d.toISOString().slice(0, 10)
      const value   = orders
        .filter(o => o.status !== 'cancelled' && (o.createdAt || '').slice(0, 10) === dateStr)
        .reduce((s, o) => s + (o.total || 0), 0)
      days.push({ label, value })
    }
    return days
  }, [orders])

  // Orders by day (last 14 days)
  const ordersByDay = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const label   = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      const dateStr = d.toISOString().slice(0, 10)
      const value   = orders.filter(o => (o.createdAt || '').slice(0, 10) === dateStr).length
      days.push({ label, value })
    }
    return days
  }, [orders])

  // Orders by status
  const byStatus = ['pending','confirmed','shipped','delivered','cancelled'].map(s => ({
    status: s,
    count:  orders.filter(o => o.status === s).length,
    pct:    orders.length > 0 ? Math.round((orders.filter(o => o.status === s).length / orders.length) * 100) : 0,
  }))

  // Top products by quantity sold
  const topProducts = useMemo(() => {
    const counts = {}
    orders.filter(o => o.status !== 'cancelled').forEach(o => {
      (o.items || []).forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1)
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }))
  }, [orders])

  // Revenue by product
  const revenueByProduct = useMemo(() => {
    const counts = {}
    orders.filter(o => o.status !== 'cancelled').forEach(o => {
      (o.items || []).forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + (item.price * item.quantity)
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, rev]) => ({ name, rev }))
  }, [orders])

  const maxQty = Math.max(...topProducts.map(p => p.qty), 1)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f5f0' }}>
      <img src="/makhana-icon.png" alt="" style={{ width: '52px', height: '52px', objectFit: 'contain', mixBlendMode: 'multiply', animation: 'an-bounce 1s ease infinite' }} />
      <style>{`@keyframes an-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f0', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'white', padding: '1.4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>Admin</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: 'var(--brown-deep)' }}>Analytics</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Range selector */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setRange(d)} style={{
                padding: '0.35rem 0.9rem', borderRadius: '2rem', fontSize: '0.78rem',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                border: '1.5px solid',
                borderColor: range === d ? 'var(--brown-deep)' : 'rgba(201,168,76,0.25)',
                background: range === d ? 'var(--brown-deep)' : 'white',
                color: range === d ? 'var(--gold-light)' : 'var(--brown)',
              }}>
                {d}d
              </button>
            ))}
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.38rem 0.9rem', background: 'white', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--brown)', fontFamily: 'inherit' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: '1.8rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString()}`} sub={`Last ${range} days`} color="#059669" icon={<IndianRupee size={16} />} />
          <StatCard label="Total Orders"  value={inRange.length} sub={`Last ${range} days`} icon={<ShoppingBag size={16} />} />
          <StatCard label="Avg Order Value" value={`₹${avgOrder}`} sub="Excl. cancelled" icon={<TrendingUp size={16} />} />
          <StatCard label="Products Live" value={products.filter(p => p.active).length} sub={`of ${products.length} total`} icon={<Package size={16} />} />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Revenue by day */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>Revenue — Last 14 Days</div>
            <BarChart data={revenueByDay} color="var(--gold)" valuePrefix="₹" />
          </div>

          {/* Orders by day */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>Orders — Last 14 Days</div>
            <BarChart data={ordersByDay} color="var(--brown)" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Orders by status */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>Orders by Status</div>
            {orders.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>No orders yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {byStatus.map(({ status, count, pct }) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--brown)', textTransform: 'capitalize', minWidth: '78px', fontWeight: 500 }}>{status}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[status], borderRadius: '4px', transition: 'width 0.7s ease' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brown-deep)', minWidth: '30px', textAlign: 'right' }}>{count}</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', minWidth: '32px' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top products */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>Top Products by Units Sold</div>
            {topProducts.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>No sales data yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {topProducts.map(({ name, qty }, i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', minWidth: '16px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '12px', color: 'var(--brown)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <div style={{ width: '80px', height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', width: `${(qty / maxQty) * 100}%`, background: 'var(--gold)', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brown-deep)', minWidth: '28px', textAlign: 'right' }}>{qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue by product */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>Revenue by Product</div>
          {revenueByProduct.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>No sales data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {revenueByProduct.map(({ name, rev }, i) => {
                const maxRev = revenueByProduct[0].rev
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--brown)', minWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <div style={{ flex: 1, height: '10px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(rev / maxRev) * 100}%`, background: 'linear-gradient(to right, var(--brown), var(--gold))', borderRadius: '4px', transition: 'width 0.7s ease' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brown-deep)', minWidth: '70px', textAlign: 'right' }}>₹{rev.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent orders table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,168,76,0.15)', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(201,168,76,0.12)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Recent Orders
          </div>
          {orders.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>No orders yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o, i) => (
                  <tr key={o.id} style={{ borderTop: '1px solid rgba(201,168,76,0.08)', background: i % 2 === 0 ? 'white' : 'rgba(250,247,242,0.5)' }}>
                    <td style={{ padding: '0.7rem 1rem', fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>#{o.id?.slice(0, 10)}…</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--brown-deep)', fontWeight: 500 }}>{o.customer?.name || '—'}</td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--muted)' }}>{(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}</td>
                    <td style={{ padding: '0.7rem 1rem', fontFamily: "'Playfair Display',serif", fontWeight: 700, color: 'var(--brown)' }}>₹{o.total}</td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <span style={{ background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status], fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '2rem', textTransform: 'capitalize' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
