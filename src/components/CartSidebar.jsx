// src/components/CartSidebar.jsx
import { X, Plus, Minus, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'

const DEFAULT_GRADIENTS = [
  '#f5ecd8','#fef9e7','#f8e8e8','#fff0e0',
  '#e8f5e8','#eef0f8','#fde8e8','#f0f0f8',
]

// Product thumbnail — shows real image or gradient initial
function ItemThumb({ item }) {
  const imageUrl = item.images?.[0] || item.imageUrl || null
  const bg = item.gradient || DEFAULT_GRADIENTS[0]

  if (imageUrl) {
    return (
      <div style={{
        width: '60px', height: '60px', borderRadius: '10px',
        overflow: 'hidden', flexShrink: 0,
        border: '1px solid rgba(201,168,76,0.2)',
      }}>
        <img
          src={imageUrl}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  // Fallback — gradient with name initial
  return (
    <div style={{
      width: '60px', height: '60px', borderRadius: '10px',
      background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(201,168,76,0.2)',
    }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.4rem', fontWeight: 900,
        color: 'var(--brown-deep)', opacity: 0.4,
      }}>
        {(item.name || 'P')[0]}
      </span>
    </div>
  )
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore()
  const navigate = useNavigate()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const freeShipping = total >= 499

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(42,21,8,0.45)',
            backdropFilter: 'blur(4px)',
            animation: 'cs-fade 0.3s ease',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 400,
        width: 'min(420px, 95vw)',
        background: 'var(--warm-white)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(42,21,8,0.15)',
      }}>

        {/* Header */}
        <div style={{
          padding: '1.5rem 1.8rem',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--brown-deep)" />
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem', fontWeight: 700, color: 'var(--brown-deep)',
            }}>
              Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Free shipping bar */}
        {!freeShipping && items.length > 0 && (
          <div style={{ padding: '0.8rem 1.8rem', background: 'var(--cream)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
              Add <strong style={{ color: 'var(--brown-deep)' }}>₹{499 - total}</strong> more for <strong>FREE shipping!</strong>
            </div>
            <div style={{ height: '4px', background: 'rgba(90,50,20,0.15)', borderRadius: '2px' }}>
              <div style={{
                height: '100%', background: 'var(--gold)',
                width: `${Math.min((total / 499) * 100, 100)}%`,
                borderRadius: '2px', transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
        {freeShipping && items.length > 0 && (
          <div style={{
            padding: '0.7rem 1.8rem', background: '#e8f5e2',
            fontSize: '0.8rem', color: '#2d6a2d', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <span style={{ fontSize: '14px' }}>✓</span> You've unlocked FREE shipping!
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.8rem' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--muted)',
              textAlign: 'center',
            }}>
              {/* Cart icon — no emoji */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'var(--cream)', border: '1.5px solid rgba(201,168,76,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingCart size={30} color="var(--muted)" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--brown-deep)', margin: 0 }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: '0.85rem', maxWidth: '200px', margin: 0 }}>
                Add some products to get started!
              </p>
              <button className="btn btn-primary" onClick={closeCart} style={{ marginTop: '0.5rem' }}>
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: '0.9rem', alignItems: 'center',
                  padding: '0.85rem', borderRadius: 'var(--radius-sm)',
                  background: 'var(--cream)',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}>
                  {/* Real product image */}
                  <ItemThumb item={item} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700, fontSize: '0.92rem',
                      color: 'var(--brown-deep)', marginBottom: '2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {item.weight || '100g'}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700, color: 'var(--brown)',
                      fontSize: '0.95rem', marginTop: '3px',
                    }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    {/* Qty controls */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      background: 'white', borderRadius: '2rem',
                      border: '1px solid rgba(90,50,20,0.25)',
                      padding: '3px 6px',
                    }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown)', display: 'flex', alignItems: 'center', padding: '2px' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown)', display: 'flex', alignItems: 'center', padding: '2px' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: '2px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '1.4rem 1.8rem',
            borderTop: '1px solid rgba(90,50,20,0.15)',
            background: 'var(--cream)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Shipping</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: freeShipping ? '#2d6a2d' : 'inherit' }}>
                {freeShipping ? 'FREE' : '₹49'}
              </span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.15rem', fontWeight: 700,
              color: 'var(--brown-deep)', marginBottom: '1.1rem',
              paddingTop: '0.75rem', borderTop: '1px solid rgba(90,50,20,0.15)',
            }}>
              <span>Total</span>
              <span>₹{freeShipping ? total : total + 49}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cs-fade { from{opacity:0} to{opacity:1} }
      `}</style>
    </>
  )
}
