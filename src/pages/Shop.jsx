// src/pages/Shop.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import useCartStore from '../store/cartStore'

const DEFAULT_GRADIENTS = [
  '#f5ecd8','#fef9e7','#f8e8e8','#fff0e0',
  '#e8f5e8','#eef0f8','#fde8e8','#f0f0f8',
]

// ── Inline shop card — same clean style as ProductCard ────────────────────
function ShopCard({ product, index, onClick }) {
  const [imgIdx, setImgIdx] = useState(0)
  const { items, addItem, updateQty } = useCartStore()

  const images  = product.images?.length > 0 ? product.images : null
  const bgColor = product.gradient || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]

  const cartItem = items.find(i => i.id === product.id)
  const qty = cartItem ? cartItem.quantity : 0

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }
  const handleAdd = (e) => { e.stopPropagation(); addItem(product) }
  const handleInc = (e) => { e.stopPropagation(); updateQty(product.id, qty + 1) }
  const handleDec = (e) => { e.stopPropagation(); updateQty(product.id, qty - 1) }

  return (
    <div className="sc" onClick={() => onClick(product.id)}>
      {/* Image */}
      <div className="sc-img" style={{ background: images ? '#f5f0e8' : bgColor }}>
        {images ? (
          <>
            <img src={images[imgIdx]} alt={product.name} className="sc-photo" />
            {images.length > 1 && (
              <>
                <button className="sc-arr sc-arr--l" onClick={prev}><ChevronLeft size={13} /></button>
                <button className="sc-arr sc-arr--r" onClick={next}><ChevronRight size={13} /></button>
                <div className="sc-dots">
                  {images.map((_, i) => (
                    <span key={i} className={`sc-dot${i === imgIdx ? ' sc-dot--on' : ''}`}
                      onClick={e => { e.stopPropagation(); setImgIdx(i) }} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="sc-noimg">{(product.name || 'M')[0]}</div>
        )}
        {product.tag && product.flavour?.toLowerCase().includes('flavoured') && <div className="sc-tag">{product.tag}</div>}
        {product.stock === 0 && <div className="sc-oos">Out of Stock</div>}
        {product.stock > 0 && product.stock < 20 && (
          <div className="sc-low">Only {product.stock} left!</div>
        )}
      </div>

      {/* Body */}
      <div className="sc-body">
        {product.flavour && product.flavour.toLowerCase().includes('flavoured') && <div className="sc-flavour">{product.flavour}</div>}
        <div className="sc-name">{product.name || 'Unnamed Product'}</div>
        {product.description && <p className="sc-desc">{product.description}</p>}
        <div className="sc-foot">
          <div>
            <div className="sc-price">₹{product.price || '—'}</div>
            <div className="sc-weight">{product.weight || '100g'}</div>
          </div>
          {product.stock === 0 ? (
            <button className="sc-btn" disabled style={{ opacity: 0.45 }}>Out of Stock</button>
          ) : qty === 0 ? (
            <button className="sc-btn" onClick={handleAdd}>
              <ShoppingBag size={12} /> Add
            </button>
          ) : (
            <div className="sc-qty" onClick={e => e.stopPropagation()}>
              <button className="sc-qty-btn" onClick={handleDec}><Minus size={12} /></button>
              <span className="sc-qty-val">{qty}</span>
              <button className="sc-qty-btn" onClick={handleInc}><Plus size={12} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const { products, loading } = useProducts()
  const [active, setActive]   = useState('All')
  const navigate = useNavigate()

  const filters = useMemo(() => {
    const flavours = [...new Set(products.map(p => p.flavour).filter(Boolean))]
    return ['All', ...flavours]
  }, [products])

  const filtered = active === 'All' ? products : products.filter(p => p.flavour === active)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--warm-white)' }}>

      {/* Header */}
      <div style={{ background: 'var(--brown-deep)', padding: '3.5rem 4rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow" style={{ color: 'var(--gold)', marginBottom: '0.6rem' }}>Our Range</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--cream)', marginBottom: '0.6rem' }}>
            All Flavours
          </h1>
          <p style={{ color: 'rgba(250,247,242,0.6)', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.6 }}>
            Hand-harvested makhanas in bold flavours — plain, spiced, cheesy and more. No artificial preservatives.
          </p>
        </div>
        <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(201,168,76,0.07)' }} />
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '1.1rem 4rem', background: 'var(--cream)', borderBottom: '1px solid rgba(201,168,76,0.2)', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            padding: '0.42rem 1.1rem', borderRadius: '2rem',
            fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            border: active === f ? '1.5px solid var(--brown-deep)' : '1.5px solid rgba(201,168,76,0.28)',
            background: active === f ? 'var(--brown-deep)' : 'transparent',
            color: active === f ? 'var(--gold-light)' : 'var(--brown)',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '2.5rem 4rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div className="sp-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ background: 'var(--cream)', borderRadius: '14px', height: '340px', animation: 'sp-pulse 1.5s ease infinite', opacity: 0.5, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="sp-grid">
            {filtered.map((p, i) => (
              <ShopCard key={p.id} product={p} index={i} onClick={id => navigate(`/product/${id}`)} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .sp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        @keyframes sp-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.6} }

        /* Shop card */
        .sc { background:white; border-radius:14px; overflow:hidden; border:1px solid rgba(201,168,76,0.18); cursor:pointer; transition:transform 0.28s,box-shadow 0.28s; display:flex; flex-direction:column; }
        .sc:hover { transform:translateY(-6px); box-shadow:0 18px 48px rgba(90,50,20,0.14); border-color:rgba(201,168,76,0.38); }
        .sc-img { height:200px; position:relative; overflow:hidden; flex-shrink:0; }
        .sc-photo { width:100%; height:100%; object-fit:cover; transition:transform 0.38s; display:block; }
        .sc:hover .sc-photo { transform:scale(1.05); }
        .sc-noimg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:3.5rem; font-weight:900; color:var(--brown-deep); opacity:0.18; }
        .sc-arr { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity 0.2s; color:var(--brown-deep); z-index:2; }
        .sc-arr--l { left:7px; }
        .sc-arr--r { right:7px; }
        .sc:hover .sc-arr { opacity:1; }
        .sc-dots { position:absolute; bottom:7px; left:50%; transform:translateX(-50%); display:flex; gap:4px; z-index:2; }
        .sc-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.5); cursor:pointer; }
        .sc-dot--on { background:white; }
        .sc-tag { position:absolute; top:9px; left:9px; z-index:2; background:var(--brown-deep); color:var(--gold-light); font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:3px 8px; border-radius:2rem; }
        .sc-low { position:absolute; top:9px; right:9px; z-index:2; background:#ef4444; color:white; font-size:9px; font-weight:700; padding:3px 8px; border-radius:2rem; }
        .sc-oos { position:absolute; inset:0; z-index:2; background:rgba(0,0,0,0.42); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px; }
        .sc-body { padding:1rem 1.1rem; flex:1; display:flex; flex-direction:column; }
        .sc-flavour { font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); margin-bottom:3px; }
        .sc-name { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:var(--brown-deep); margin-bottom:5px; line-height:1.25; }
        .sc-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:0.8rem; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .sc-foot { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-top:auto; }
        .sc-price { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:var(--brown); line-height:1; }
        .sc-weight { font-size:11px; color:var(--muted); margin-top:2px; }
        .sc-btn { display:flex; align-items:center; gap:4px; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:2rem; padding:7px 14px; font-size:11px; font-weight:700; cursor:pointer; transition:all 0.22s; font-family:inherit; white-space:nowrap; flex-shrink:0; }
        .sc-btn:hover:not(:disabled) { background:var(--gold); color:var(--brown-deep); }
        .sc-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .sc-qty { display:flex; align-items:center; background:var(--brown-deep); border-radius:2rem; overflow:hidden; flex-shrink:0; }
        .sc-qty-btn { background:none; border:none; color:var(--gold-light); cursor:pointer; padding:7px 10px; display:flex; align-items:center; transition:background 0.15s; }
        .sc-qty-btn:hover { background:rgba(255,255,255,0.12); }
        .sc-qty-val { font-size:12px; font-weight:700; color:var(--gold-light); min-width:22px; text-align:center; }

        @media (max-width:900px) {
          .sp-grid { grid-template-columns:repeat(2,1fr); }
          div[style*="padding: '2.5rem 4rem"] { padding:1.5rem !important; }
          div[style*="padding: '1.1rem 4rem"] { padding:0.8rem 1.2rem !important; }
          div[style*="padding: '3.5rem 4rem"] { padding:2.5rem 1.5rem !important; }
        }
        @media (max-width:520px) {
          .sp-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  )
}
