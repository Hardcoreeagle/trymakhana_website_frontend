// src/components/ProductCard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingBag } from 'lucide-react'
import useCartStore from '../store/cartStore'

const DEFAULT_GRADIENTS = [
  '#f5ecd8','#fef9e7','#f8e8e8','#fff0e0',
  '#e8f5e8','#eef0f8','#fde8e8','#f0f0f8',
]

export default function ProductCard({ product, index = 0 }) {
  const [imgIdx, setImgIdx] = useState(0)
  const { items, addItem, updateQty } = useCartStore()
  const navigate = useNavigate()

  const images  = product.images?.length > 0 ? product.images : null
  const bgColor = product.gradient || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]

  // Get current quantity from cart
  const cartItem = items.find(i => i.id === product.id)
  const qty = cartItem ? cartItem.quantity : 0

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem(product)
  }
  const handleInc = (e) => {
    e.stopPropagation()
    updateQty(product.id, qty + 1)
  }
  const handleDec = (e) => {
    e.stopPropagation()
    updateQty(product.id, qty - 1) // updateQty removes item when qty reaches 0
  }

  return (
    <div className="pc" onClick={() => navigate(`/product/${product.id}`)}>

      {/* Image */}
      <div className="pc-img" style={{ background: images ? '#f5f0e8' : bgColor }}>
        {images ? (
          <>
            <img src={images[imgIdx]} alt={product.name} className="pc-photo" />
            {images.length > 1 && (
              <>
                <button className="pc-arr pc-arr--l" onClick={prev}><ChevronLeft size={13} /></button>
                <button className="pc-arr pc-arr--r" onClick={next}><ChevronRight size={13} /></button>
                <div className="pc-dots">
                  {images.map((_, i) => (
                    <span key={i} className={`pc-dot${i === imgIdx ? ' pc-dot--on' : ''}`}
                      onClick={e => { e.stopPropagation(); setImgIdx(i) }} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="pc-noimg">{(product.name || 'P')[0]}</div>
        )}
        {product.tag && <div className="pc-tag">{product.tag}</div>}
        {product.stock === 0 && <div className="pc-oos">Out of Stock</div>}
        {product.stock > 0 && product.stock < 20 && (
          <div className="pc-low">Only {product.stock} left!</div>
        )}
      </div>

      {/* Body */}
      <div className="pc-body">
        {product.flavour && <div className="pc-flavour">{product.flavour}</div>}
        <div className="pc-name">{product.name || 'Unnamed Product'}</div>
        {product.description && <p className="pc-desc">{product.description}</p>}

        <div className="pc-foot">
          <div>
            <div className="pc-price">₹{product.price || '—'}</div>
            <div className="pc-weight">{product.weight || '100g'}</div>
          </div>

          {/* Qty controls — shows +/- if in cart, Add if not */}
          {product.stock === 0 ? (
            <button className="pc-btn" disabled style={{ opacity: 0.45 }}>Out of Stock</button>
          ) : qty === 0 ? (
            <button className="pc-btn" onClick={handleAdd}>
              <ShoppingBag size={12} /> Add
            </button>
          ) : (
            <div className="pc-qty" onClick={e => e.stopPropagation()}>
              <button className="pc-qty-btn" onClick={handleDec}><Minus size={12} /></button>
              <span className="pc-qty-val">{qty}</span>
              <button className="pc-qty-btn" onClick={handleInc}><Plus size={12} /></button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pc { background:#fff; border-radius:14px; overflow:hidden; border:1px solid rgba(201,168,76,0.18); cursor:pointer; transition:transform 0.28s,box-shadow 0.28s; display:flex; flex-direction:column; }
        .pc:hover { transform:translateY(-6px); box-shadow:0 18px 48px rgba(90,50,20,0.14); border-color:rgba(201,168,76,0.38); }
        .pc-img { height:200px; position:relative; overflow:hidden; flex-shrink:0; }
        .pc-photo { width:100%; height:100%; object-fit:cover; transition:transform 0.38s; display:block; }
        .pc:hover .pc-photo { transform:scale(1.05); }
        .pc-noimg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:3.5rem; font-weight:900; color:var(--brown-deep); opacity:0.18; }
        .pc-arr { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.9); border:none; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity 0.2s; color:var(--brown-deep); z-index:2; }
        .pc-arr--l { left:7px; }
        .pc-arr--r { right:7px; }
        .pc:hover .pc-arr { opacity:1; }
        .pc-dots { position:absolute; bottom:7px; left:50%; transform:translateX(-50%); display:flex; gap:4px; z-index:2; }
        .pc-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.5); cursor:pointer; }
        .pc-dot--on { background:white; }
        .pc-tag { position:absolute; top:9px; left:9px; z-index:2; background:var(--brown-deep); color:var(--gold-light); font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:3px 8px; border-radius:2rem; }
        .pc-low { position:absolute; top:9px; right:9px; z-index:2; background:#ef4444; color:white; font-size:9px; font-weight:700; padding:3px 8px; border-radius:2rem; }
        .pc-oos { position:absolute; inset:0; z-index:2; background:rgba(0,0,0,0.42); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px; }
        .pc-body { padding:1rem 1.1rem; flex:1; display:flex; flex-direction:column; }
        .pc-flavour { font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); margin-bottom:3px; }
        .pc-name { font-family:'Playfair Display',serif; font-size:1rem; font-weight:700; color:var(--brown-deep); margin-bottom:5px; line-height:1.25; }
        .pc-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:0.8rem; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .pc-foot { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-top:auto; }
        .pc-price { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:900; color:var(--brown); line-height:1; }
        .pc-weight { font-size:11px; color:var(--muted); margin-top:2px; }
        .pc-btn { display:flex; align-items:center; gap:4px; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:2rem; padding:7px 14px; font-size:11px; font-weight:700; cursor:pointer; transition:all 0.22s; font-family:inherit; white-space:nowrap; flex-shrink:0; }
        .pc-btn:hover:not(:disabled) { background:var(--gold); color:var(--brown-deep); }
        .pc-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .pc-qty { display:flex; align-items:center; background:var(--brown-deep); border-radius:2rem; overflow:hidden; flex-shrink:0; }
        .pc-qty-btn { background:none; border:none; color:var(--gold-light); cursor:pointer; padding:7px 10px; display:flex; align-items:center; transition:background 0.15s; }
        .pc-qty-btn:hover { background:rgba(255,255,255,0.12); }
        .pc-qty-val { font-size:12px; font-weight:700; color:var(--gold-light); min-width:22px; text-align:center; }
      `}</style>
    </div>
  )
}
