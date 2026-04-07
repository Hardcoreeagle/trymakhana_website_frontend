// src/pages/ProductDetail.jsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, Check, ArrowLeft, Plus, Minus, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import useCartStore from '../store/cartStore'
import ProductCard from '../components/ProductCard'

// ── Image gallery with thumbnail scroll ───────────────────────────────────
function ProductImageGallery({ product }) {
  const images   = product.images && product.images.length > 0 ? product.images : null
  const gradient = product.gradient || 'linear-gradient(135deg, #fef3d8, #f5d98b)'
  const [active, setActive] = useState(0)

  if (!images) {
    return (
      <div style={{ position: 'sticky', top: '7rem' }}>
        <div style={{
          borderRadius: 'var(--radius-lg)', height: '420px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          background: gradient, boxShadow: 'var(--shadow-lg)',
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '8rem', fontWeight: 900, color: 'var(--brown-deep)', opacity: 0.2, animation: 'pd-float 4s ease-in-out infinite' }}>
            {(product.name || 'V')[0]}
          </span>
          {product.tag && <div className="pd-tag">{product.tag}</div>}
          {product.stock < 20 && product.stock > 0 && (
            <div className="pd-stock-warn">Only {product.stock} left!</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'sticky', top: '7rem' }}>
      {/* Main image */}
      <div style={{
        borderRadius: 'var(--radius-lg)', height: '420px',
        overflow: 'hidden', position: 'relative',
        boxShadow: 'var(--shadow-lg)', background: '#f5f0e8',
      }}>
        <img
          src={images[active]}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
        />
        {product.tag && <div className="pd-tag">{product.tag}</div>}
        {product.stock < 20 && product.stock > 0 && (
          <div className="pd-stock-warn">Only {product.stock} left!</div>
        )}
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(a => (a - 1 + images.length) % images.length)}
              style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setActive(a => (a + 1) % images.length)}
              style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)' }}>
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display:'flex', gap:'0.6rem', marginTop:'0.8rem', overflowX:'auto', paddingBottom:'4px', scrollbarWidth:'thin' }}>
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{
                flexShrink:0, width:'64px', height:'64px',
                borderRadius:'8px', overflow:'hidden', padding:0,
                border: active === i ? '2.5px solid var(--gold)' : '2px solid rgba(201,168,76,0.2)',
                cursor:'pointer', background:'#f5f0e8',
              }}>
              <img src={src} alt={`View ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCartStore()
  const { products, loading } = useProducts()

  const product = products.find(p => p.id === id)
  const related = products.filter(p => p.id !== id).slice(0, 3)

  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab]     = useState('description') // 'description' | 'nutrition' | 'highlights'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/makhana-icon.png" alt="" style={{ width:"52px",height:"52px",objectFit:"contain",animation:"pd-bounce 1s ease infinite",mixBlendMode:"multiply" }} />
        <style>{`@keyframes pd-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pd-notfound">
        <img src="/makhana-icon.png" alt="" style={{ width:"52px",height:"52px",objectFit:"contain",opacity:0.5,mixBlendMode:"multiply" }} />
        <p>Product not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      openCart()
    }, 1200)
  }

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shop">Shop</Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      {/* Main product section */}
      <div className="pd-main">

        {/* Left — Visual */}
        <div className="pd-visual-wrap">
          <ProductImageGallery product={product} />
        </div>

        {/* Right — Info */}
        <div className="pd-info">
          {/* Flavour + name */}
          <div className="pd-flavour">{product.flavour}</div>
          <h1 className="pd-name">{product.name}</h1>

          {/* Rating */}
          <div className="pd-rating">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} size={14} fill={i < 4 ? 'var(--gold)' : 'none'} color="var(--gold)" />
            ))}
            <span className="pd-rating-text">4.8 · 120+ reviews</span>
          </div>

          {/* Price */}
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price}</span>
            <span className="pd-price-per">/ {product.weight}</span>
            <span className="pd-free-ship">🚚 Free shipping above ₹499</span>
          </div>

          {/* Short description */}
          <p className="pd-short-desc">{product.description}</p>

          {/* Benefit pills */}
          <div className="pd-benefits">
            {product.benefits.map(b => (
              <span key={b} className="pd-benefit-pill">{b}</span>
            ))}
          </div>

          {/* Quantity + Add to cart */}
          <div className="pd-actions">
            <div className="pd-qty">
              <button
                className="pd-qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                <Minus size={15} />
              </button>
              <span className="pd-qty-val">{qty}</span>
              <button
                className="pd-qty-btn"
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              className={`pd-add-btn ${added ? 'pd-add-btn--added' : ''}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added
                ? <><Check size={18} /> Added to bag!</>
                : <><ShoppingBag size={18} /> Add to Bag — ₹{product.price * qty}</>
              }
            </button>
          </div>

          {/* Fast delivery note */}
          <div className="pd-delivery-note">
            <Zap size={13} color="var(--gold)" />
            Same-day dispatch if ordered before 2 PM · Delivered in 2–4 days
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            <div className="pd-tab-nav">
              {[
                { key: 'description', label: 'Description' },
                { key: 'highlights',  label: 'Highlights' },
                { key: 'nutrition',   label: 'Nutrition' },
              ].map(t => (
                <button
                  key={t.key}
                  className={`pd-tab-btn ${tab === t.key ? 'pd-tab-btn--active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">
              {tab === 'description' && (
                <p className="pd-long-desc">{product.longDescription}</p>
              )}

              {tab === 'highlights' && (
                <ul className="pd-highlights-list">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="pd-highlight-item">
                      <Check size={14} color="var(--gold)" style={{ flexShrink: 0 }} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'nutrition' && (
                <div className="pd-nutrition">
                  <div className="pd-nutrition-note">Per 100g serving</div>
                  <div className="pd-nutrition-grid">
                    {Object.entries(product.nutrition).map(([key, val]) => (
                      <div key={key} className="pd-nutrition-item">
                        <div className="pd-nutrition-val">{val}</div>
                        <div className="pd-nutrition-key">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="pd-related">
        <div className="section-eyebrow">You Might Also Like</div>
        <h2 className="pd-related-title">More Flavours to Try</h2>
        <div className="pd-related-grid">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <style>{`
        .pd-page        { min-height:100vh; padding-top:6rem; background:var(--warm-white); }

        /* Breadcrumb */
        .pd-breadcrumb  { display:flex; align-items:center; gap:0.5rem; padding:1.2rem 4rem; font-size:0.8rem; color:var(--muted); flex-wrap:wrap; }
        .pd-breadcrumb a{ color:var(--brown); text-decoration:none; transition:color 0.2s; }
        .pd-breadcrumb a:hover { color:var(--gold); }
        .pd-breadcrumb span:last-child { color:var(--brown-deep); font-weight:500; }

        /* Main grid */
        .pd-main        { display:grid; grid-template-columns:1fr 1fr; gap:4rem; padding:2rem 4rem 4rem; max-width:1100px; margin:0 auto; align-items:start; }

        /* Visual */
        .pd-visual-wrap { position:sticky; top:7rem; }
        .pd-visual      { border-radius:var(--radius-lg); height:420px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow:var(--shadow-lg); }
        .pd-emoji       { font-size:8rem; filter:drop-shadow(0 16px 32px rgba(0,0,0,0.15)); animation:pd-float 4s ease-in-out infinite; }
        @keyframes pd-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .pd-tag         { position:absolute; top:16px; left:16px; background:var(--brown-deep); color:var(--gold-light); font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.35rem 0.9rem; border-radius:2rem; }
        .pd-stock-warn  { position:absolute; top:16px; right:16px; background:#ff6b6b; color:white; font-size:0.65rem; font-weight:700; padding:0.3rem 0.7rem; border-radius:2rem; }
        .pd-weight-badge{ display:flex; align-items:baseline; gap:2px; margin-top:1.2rem; justify-content:center; }
        .pd-weight-num  { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:900; color:var(--brown-deep); line-height:1; }
        .pd-weight-unit { font-size:1rem; color:var(--muted); font-weight:500; }

        /* Info */
        .pd-flavour     { font-size:0.72rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:0.4rem; }
        .pd-name        { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3vw,2.6rem); font-weight:900; color:var(--brown-deep); line-height:1.1; margin-bottom:0.8rem; }
        .pd-rating      { display:flex; align-items:center; gap:0.3rem; margin-bottom:1.2rem; }
        .pd-rating-text { font-size:0.82rem; color:var(--muted); margin-left:0.3rem; }
        .pd-price-row   { display:flex; align-items:baseline; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem; }
        .pd-price       { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:var(--brown); }
        .pd-price-per   { font-size:0.85rem; color:var(--muted); }
        .pd-free-ship   { font-size:0.78rem; color:#2d6a2d; font-weight:500; margin-left:auto; }
        .pd-short-desc  { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.1rem; color:var(--muted); line-height:1.65; margin-bottom:1.2rem; }
        .pd-benefits    { display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.8rem; }
        .pd-benefit-pill{ font-size:0.7rem; font-weight:500; background:rgba(138,170,122,0.15); color:var(--sage); padding:0.3rem 0.75rem; border-radius:2rem; border:1px solid rgba(138,170,122,0.3); }

        /* Qty + add */
        .pd-actions     { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
        .pd-qty         { display:flex; align-items:center; gap:0; background:var(--cream); border:1.5px solid rgba(90,50,20,0.3); border-radius:3rem; overflow:hidden; }
        .pd-qty-btn     { background:none; border:none; width:38px; height:42px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--brown); transition:background 0.2s; }
        .pd-qty-btn:hover:not(:disabled) { background:rgba(90,50,20,0.15); }
        .pd-qty-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .pd-qty-val     { font-weight:700; font-size:1rem; min-width:32px; text-align:center; color:var(--brown-deep); }
        .pd-add-btn     { flex:1; display:flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.85rem 1.6rem; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:3rem; font-size:0.92rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.3s; white-space:nowrap; }
        .pd-add-btn:hover:not(:disabled) { background:var(--gold); color:var(--brown-deep); transform:translateY(-2px); box-shadow:0 8px 24px rgba(90,50,20,0.3); }
        .pd-add-btn--added { background:#2d6a2d !important; color:white !important; transform:scale(0.98) !important; }

        /* Delivery note */
        .pd-delivery-note { display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--muted); margin-bottom:2rem; padding:0.7rem 1rem; background:var(--cream); border-radius:var(--radius-sm); border:1px solid rgba(90,50,20,0.18); }

        /* Tabs */
        .pd-tabs        { border-top:1px solid rgba(90,50,20,0.2); padding-top:1.5rem; }
        .pd-tab-nav     { display:flex; gap:0; border-bottom:1px solid rgba(90,50,20,0.15); margin-bottom:1.2rem; }
        .pd-tab-btn     { padding:0.6rem 1.2rem; background:none; border:none; border-bottom:2px solid transparent; font-size:0.85rem; font-weight:500; color:var(--muted); cursor:pointer; font-family:inherit; transition:all 0.2s; margin-bottom:-1px; }
        .pd-tab-btn--active { color:var(--brown-deep); border-bottom-color:var(--gold); font-weight:600; }
        .pd-tab-btn:hover:not(.pd-tab-btn--active) { color:var(--brown); }
        .pd-long-desc   { font-size:0.9rem; color:var(--brown); line-height:1.8; }
        .pd-highlights-list { list-style:none; display:flex; flex-direction:column; gap:0.7rem; }
        .pd-highlight-item  { display:flex; align-items:flex-start; gap:0.6rem; font-size:0.88rem; color:var(--brown); }

        /* Nutrition */
        .pd-nutrition-note  { font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:0.8rem; }
        .pd-nutrition-grid  { display:grid; grid-template-columns:repeat(5,1fr); gap:0.8rem; }
        .pd-nutrition-item  { background:var(--cream); border-radius:var(--radius-sm); padding:0.8rem 0.5rem; text-align:center; border:1px solid rgba(90,50,20,0.15); }
        .pd-nutrition-val   { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:var(--brown-deep); margin-bottom:0.2rem; }
        .pd-nutrition-key   { font-size:0.68rem; color:var(--muted); text-transform:capitalize; }

        /* Related */
        .pd-related       { padding:4rem 4rem 6rem; max-width:1100px; margin:0 auto; }
        .pd-related-title { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:900; color:var(--brown-deep); margin-bottom:2rem; }
        .pd-related-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }

        /* Not found */
        .pd-notfound      { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; padding-top:6rem; }

        /* Responsive */
        @media (max-width:900px) {
          .pd-main        { grid-template-columns:1fr; gap:2rem; padding:1.5rem; }
          .pd-visual-wrap { position:static; }
          .pd-visual      { height:300px; }
          .pd-emoji       { font-size:5rem; }
          .pd-breadcrumb  { padding:1rem 1.5rem; }
          .pd-related     { padding:3rem 1.5rem 4rem; }
          .pd-related-grid{ grid-template-columns:1fr 1fr; }
          .pd-nutrition-grid { grid-template-columns:repeat(3,1fr); }
        }
        @media (max-width:560px) {
          .pd-related-grid{ grid-template-columns:1fr; }
          .pd-add-btn     { font-size:0.82rem; padding:0.8rem 1rem; }
        }
      `}</style>
    </div>
  )
}
