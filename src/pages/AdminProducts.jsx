// src/pages/AdminProducts.jsx
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, AlertCircle, CheckCircle, Package, ImagePlus, XCircle } from 'lucide-react'
import {
  fetchAllProductsFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  toggleProductInFirestore,
} from '../firebase/products'

const EMPTY_PRODUCT = {
  name: '', flavour: '', tag: '', price: '', weight: '100g',
  emoji: '', description: '', longDescription: '',
  benefits: '', highlights: '', stock: '',
  gradient: 'linear-gradient(135deg, #fef3d8, #f5d98b)',
  images: [], active: true,
}

const GRADIENTS = [
  { label: 'Gold',   value: 'linear-gradient(135deg, #fef3d8, #f5d98b)' },
  { label: 'Orange', value: 'linear-gradient(135deg, #ffe8d6, #f5b87a)' },
  { label: 'Green',  value: 'linear-gradient(135deg, #e8f5e2, #b5d4a0)' },
  { label: 'Pink',   value: 'linear-gradient(135deg, #fde8e8, #f5a0a0)' },
  { label: 'Cream',  value: 'linear-gradient(135deg, #fff8dc, #f5e0a0)' },
  { label: 'Brown',  value: 'linear-gradient(135deg, #e8d5c4, #b07850)' },
]

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #fef3d8, #f5d98b)',
  'linear-gradient(135deg, #ffe8d6, #f5b87a)',
  'linear-gradient(135deg, #e8f5e2, #b5d4a0)',
  'linear-gradient(135deg, #fde8e8, #f5a0a0)',
  'linear-gradient(135deg, #fff8dc, #f5e0a0)',
  'linear-gradient(135deg, #e8d5c4, #b07850)',
]


function Toast({ msg, type }) {
  if (!msg) return null
  return (
    <div className={`ap-toast ap-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  )
}

// ── Field — defined OUTSIDE so it never remounts ──────────────────────────
function F({ label, field, type = 'text', placeholder, span2, form, errors, onChange }) {
  return (
    <div style={{ gridColumn: span2 ? 'span 2' : 'span 1' }}>
      <label className="ap-label">{label}</label>
      <input
        className={`ap-input${errors[field] ? ' ap-input--err' : ''}`}
        type={type} placeholder={placeholder}
        value={form[field] ?? ''}
        onChange={e => onChange(field, e.target.value)}
      />
      {errors[field] && <div className="ap-err">{errors[field]}</div>}
    </div>
  )
}

function TA({ label, field, placeholder, rows = 3, form, errors, onChange }) {
  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label className="ap-label">{label}</label>
      <textarea
        className={`ap-input ap-textarea${errors[field] ? ' ap-input--err' : ''}`}
        placeholder={placeholder} rows={rows}
        value={form[field] ?? ''}
        onChange={e => onChange(field, e.target.value)}
      />
      {errors[field] && <div className="ap-err">{errors[field]}</div>}
    </div>
  )
}

// ── Compress image to max 800px wide, ~150KB base64 ──────────────────────
function compressImage(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// ── Image uploader ────────────────────────────────────────────────────────
function ImageUploader({ images = [], onChange }) {
  const [urlInput, setUrlInput]   = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)))
      onChange([...images, ...compressed])
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleUrlAdd = () => {
    const url = urlInput.trim()
    if (!url) return
    onChange([...images, url])
    setUrlInput('')
  }

  const removeImage = (idx) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label className="ap-label">
        Product Images
        <span className="ap-hint-text"> (first image shown on card · images auto-compressed)</span>
      </label>

      {/* Previews */}
      {images.length > 0 && (
        <div className="ap-img-previews">
          {images.map((src, i) => (
            <div key={i} className="ap-img-preview">
              <img src={src} alt={`Product ${i + 1}`} />
              <button type="button" className="ap-img-remove" onClick={() => removeImage(i)} title="Remove">
                <XCircle size={16} />
              </button>
              {i === 0 && <div className="ap-img-primary">Main</div>}
            </div>
          ))}
        </div>
      )}

      <div className="ap-img-actions">
        <label className={`ap-upload-btn ${uploading ? 'ap-upload-btn--loading' : ''}`}>
          <ImagePlus size={15} />
          {uploading ? 'Compressing…' : 'Upload from device'}
          <input
            type="file" accept="image/*" multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
        <div className="ap-url-row">
          <input
            className="ap-input"
            placeholder="Or paste image URL…"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUrlAdd() } }}
            style={{ flex: 1 }}
          />
          <button type="button" className="ap-url-add" onClick={handleUrlAdd}>Add</button>
        </div>
      </div>
    </div>
  )
}

// ── Product Form ──────────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm]     = useState(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (field, val) => {
    setForm(p => ({ ...p, [field]: val }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'Required'
    if (!form.flavour.trim())     e.flavour     = 'Required'
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required'
    if (!form.stock || isNaN(form.stock) || +form.stock < 0)  e.stock = 'Valid stock required'
    if (!form.description.trim()) e.description = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      ...form,
      price:      +form.price,
      stock:      +form.stock,
      images:     form.images || [],
      benefits:   typeof form.benefits === 'string'
                    ? form.benefits.split(',').map(s => s.trim()).filter(Boolean)
                    : (form.benefits || []),
      highlights: typeof form.highlights === 'string'
                    ? form.highlights.split(',').map(s => s.trim()).filter(Boolean)
                    : (form.highlights || []),
    }
    await onSave(payload)
    setSaving(false)
  }

  return (
    <div className="ap-form-wrap">
      <div className="ap-form-header">
        <h3 className="ap-form-title">{initial.id ? 'Edit Product' : 'Add New Product'}</h3>
        <button className="ap-icon-btn" onClick={onCancel}><X size={18} /></button>
      </div>

      <div className="ap-form-grid">
        <F label="Product Name *"       field="name"     placeholder="e.g. Classic Himalayan Salt" span2 form={form} errors={errors} onChange={handleChange} />
        <F label="Flavour / Category *" field="flavour"  placeholder="e.g. Salted"   form={form} errors={errors} onChange={handleChange} />
        <F label="Tag"                  field="tag"      placeholder="e.g. Bestseller" form={form} errors={errors} onChange={handleChange} />
        <F label="Price (₹) *"          field="price"    placeholder="199" type="number" form={form} errors={errors} onChange={handleChange} />
        <F label="Stock (units) *"      field="stock"    placeholder="50"  type="number" form={form} errors={errors} onChange={handleChange} />
        <F label="Weight"               field="weight"   placeholder="100g" form={form} errors={errors} onChange={handleChange} />

        {/* Card colour */}
        <div>
          <label className="ap-label">Card Background Colour</label>
          <div className="ap-gradient-picker">
            {GRADIENTS.map(g => (
              <button
                key={g.value} title={g.label} type="button"
                className={`ap-gradient-swatch ${form.gradient === g.value ? 'ap-gradient-swatch--active' : ''}`}
                style={{ background: g.value }}
                onClick={() => handleChange('gradient', g.value)}
              />
            ))}
          </div>
        </div>

        {/* Image uploader */}
        <ImageUploader
          images={form.images || []}
          onChange={imgs => handleChange('images', imgs)}
        />

        <TA label="Short Description *" field="description"    placeholder="One-line description shown on product card" rows={2} form={form} errors={errors} onChange={handleChange} />
        <TA label="Long Description"    field="longDescription" placeholder="Full description shown on product detail page" rows={4} form={form} errors={errors} onChange={handleChange} />

        <div style={{ gridColumn: 'span 2' }}>
          <label className="ap-label">Benefits <span className="ap-hint-text">(comma separated)</span></label>
          <input
            className="ap-input"
            placeholder="High Protein, Low Calorie, Gluten Free"
            value={typeof form.benefits === 'string' ? form.benefits : (form.benefits || []).join(', ')}
            onChange={e => handleChange('benefits', e.target.value)}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label className="ap-label">Highlights <span className="ap-hint-text">(comma separated)</span></label>
          <input
            className="ap-input"
            placeholder="Hand-harvested, Slow roasted, No preservatives"
            value={typeof form.highlights === 'string' ? form.highlights : (form.highlights || []).join(', ')}
            onChange={e => handleChange('highlights', e.target.value)}
          />
        </div>
      </div>

      <div className="ap-form-actions">
        <button className="ap-cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="ap-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : <><Save size={15} /> {initial.id ? 'Save Changes' : 'Add Product'}</>}
        </button>
      </div>
    </div>
  )
}

// ── Product row ───────────────────────────────────────────────────────────
function ProductRow({ product, index, onEdit, onDelete, onToggle }) {
  const [deleting, setDeleting] = useState(false)
  const gradient = product.gradient || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length]
  const imageUrl = (product.images && product.images[0]) || product.imageUrl || null

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await onDelete(product.id)
  }

  return (
    <div className={`ap-row ${!product.active ? 'ap-row--inactive' : ''}`}>
      {/* Visual thumb */}
      <div className="ap-thumb" style={{ background: imageUrl ? '#f5f0e8' : gradient }}>
        {imageUrl
          ? <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          : <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 900, color: 'var(--brown-deep)', opacity: 0.35 }}>{(product.name || 'P')[0]}</span>
        }
      </div>

      {/* Info */}
      <div className="ap-row-info">
        <div className="ap-row-name">{product.name || '—'}</div>
        <div className="ap-row-meta">{product.flavour || '—'} · {product.weight || '100g'}</div>
      </div>

      {/* Price */}
      <div className="ap-row-price">₹{product.price || '—'}</div>

      {/* Stock */}
      <div className={`ap-row-stock ${product.stock < 20 ? 'ap-row-stock--low' : ''}`}>
        <Package size={13} />
        {product.stock ?? '—'} units
        {product.stock < 20 && product.stock > 0 && <span className="ap-low-badge">Low</span>}
      </div>

      {/* Images count */}
      <div className="ap-row-imgs">
        {(product.images || []).length > 0
          ? `${product.images.length} image${product.images.length > 1 ? 's' : ''}`
          : <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No images</span>
        }
      </div>

      {/* Active toggle */}
      <div className="ap-row-status">
        <button
          className={`ap-toggle ${product.active ? 'ap-toggle--on' : 'ap-toggle--off'}`}
          onClick={() => onToggle(product.id, !product.active)}
          title={product.active ? 'Live — click to hide' : 'Hidden — click to show'}
        >
          {product.active ? <><Eye size={13} /> Live</> : <><EyeOff size={13} /> Hidden</>}
        </button>
      </div>

      {/* Actions */}
      <div className="ap-row-actions">
        <button className="ap-icon-btn ap-icon-btn--edit" onClick={() => onEdit(product)} title="Edit">
          <Edit2 size={14} />
        </button>
        <button className="ap-icon-btn ap-icon-btn--del" onClick={handleDelete} disabled={deleting} title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)
  const [toast, setToast]       = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchAllProductsFromFirestore()
      setProducts(data)
    } catch (e) {
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (payload) => {
    try {
      const saved = await saveProductToFirestore(payload)
      if (payload.id) {
        setProducts(prev => prev.map(p => p.id === payload.id ? { ...p, ...payload } : p))
        showToast('Product updated successfully')
      } else {
        setProducts(prev => [...prev, { ...payload, id: saved.id }])
        showToast('Product added successfully')
      }
      setEditing(null)
    } catch (e) {
      console.error('Save error:', e)
      showToast(`Failed to save: ${e.message}`, 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProductFromFirestore(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      showToast('Product deleted')
    } catch (e) {
      showToast('Failed to delete product', 'error')
    }
  }

  const handleToggle = async (id, active) => {
    try {
      await toggleProductInFirestore(id, active)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active } : p))
      showToast(active ? 'Product is now live in shop' : 'Product hidden from shop')
    } catch (e) {
      showToast('Failed to update product', 'error')
    }
  }

  const lowStockCount = products.filter(p => p.stock < 20 && p.stock > 0 && p.active).length

  return (
    <div className="ap-page">
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* Header */}
      <div className="ap-header">
        <div>
          <div className="ap-eyebrow">Catalogue</div>
          <h1 className="ap-title">Products</h1>
        </div>
        <button className="ap-add-btn" onClick={() => setEditing({ ...EMPTY_PRODUCT })}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="ap-body">
        {/* Low stock alert */}
        {lowStockCount > 0 && (
          <div className="ap-alert">
            <AlertCircle size={15} />
            {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock (under 20 units)
          </div>
        )}

        {/* Stats */}
        <div className="ap-stats">
          {[
            { label: 'Total Products', value: products.length,                         icon: '📦' },
            { label: 'Live in Shop',   value: products.filter(p => p.active).length,   icon: '🟢' },
            { label: 'Hidden',         value: products.filter(p => !p.active).length,  icon: '👁️' },
            { label: 'Low Stock',      value: lowStockCount,                            icon: '⚠️' },
          ].map(s => (
            <div key={s.label} className="ap-stat">
              <span className="ap-stat-icon">{s.icon}</span>
              <span className="ap-stat-val">{s.value}</span>
              <span className="ap-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {editing && (
          <ProductForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* List */}
        {loading ? (
          <div className="ap-loading">
            <img src="/makhana-icon.png" alt="loading" style={{ width:"56px", height:"56px", objectFit:"contain", marginBottom:"0.8rem", animation:"ap-bounce 1s ease infinite", mixBlendMode:"multiply" }} />
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="ap-empty">
            <img src="/makhana-icon.png" alt="" style={{ width:"44px",height:"44px",objectFit:"contain",marginBottom:"0.8rem",opacity:0.5,mixBlendMode:"multiply" }} />
            <p style={{ marginBottom: '1rem' }}>No products yet.</p>
            <button className="ap-add-btn" onClick={() => setEditing({ ...EMPTY_PRODUCT })}>
              <Plus size={15} /> Add your first product
            </button>
          </div>
        ) : (
          <div className="ap-list">
            <div className="ap-list-header">
              <div style={{ flex: '0 0 52px' }} />
              <div style={{ flex: 1 }}>Product</div>
              <div style={{ width: '70px' }}>Price</div>
              <div style={{ width: '110px' }}>Stock</div>
              <div style={{ width: '90px' }}>Images</div>
              <div style={{ width: '100px' }}>Status</div>
              <div style={{ width: '80px' }}>Actions</div>
            </div>
            {products.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                index={i}
                onEdit={p => setEditing({
                  ...p,
                  benefits:   Array.isArray(p.benefits)   ? p.benefits.join(', ')   : (p.benefits || ''),
                  highlights: Array.isArray(p.highlights) ? p.highlights.join(', ') : (p.highlights || ''),
                  images:     p.images || [],
                })}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ap-page  { min-height:100vh; background:#f8f5f0; font-family:'DM Sans',sans-serif; }
        .ap-header{ background:white; padding:1.5rem 2rem; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(201,168,76,0.15); }
        .ap-eyebrow{ font-size:0.68rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:0.2rem; }
        .ap-title { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:900; color:var(--brown-deep); }
        .ap-add-btn { display:flex; align-items:center; gap:0.5rem; padding:0.65rem 1.4rem; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:3rem; font-size:0.88rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .ap-add-btn:hover { background:var(--gold); color:var(--brown-deep); }
        .ap-body  { padding:1.8rem 2rem; }
        .ap-alert { display:flex; align-items:center; gap:0.6rem; padding:0.8rem 1.2rem; background:#fff7ed; border:1px solid #fed7aa; border-radius:var(--radius-sm); color:#c2410c; font-size:0.85rem; margin-bottom:1.2rem; }
        .ap-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
        .ap-stat  { background:white; border-radius:var(--radius-md); padding:1.2rem; border:1px solid rgba(201,168,76,0.15); display:flex; flex-direction:column; gap:0.25rem; }
        .ap-stat-icon { font-size:1.3rem; }
        .ap-stat-val  { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:var(--brown-deep); line-height:1; }
        .ap-stat-label{ font-size:0.75rem; color:var(--muted); }

        /* List */
        .ap-list  { background:white; border-radius:var(--radius-md); border:1px solid rgba(201,168,76,0.15); overflow:hidden; }
        .ap-list-header { display:flex; align-items:center; gap:1rem; padding:0.7rem 1.2rem; background:var(--cream); border-bottom:1px solid rgba(201,168,76,0.15); font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); }
        .ap-row   { display:flex; align-items:center; gap:1rem; padding:1rem 1.2rem; border-bottom:1px solid rgba(201,168,76,0.08); transition:background 0.15s; }
        .ap-row:last-child { border-bottom:none; }
        .ap-row:hover { background:#fdfaf5; }
        .ap-row--inactive { opacity:0.5; }
        .ap-thumb { width:52px; height:52px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
        .ap-row-info  { flex:1; min-width:0; }
        .ap-row-name  { font-weight:700; color:var(--brown-deep); font-size:0.92rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ap-row-meta  { font-size:0.75rem; color:var(--muted); margin-top:0.15rem; }
        .ap-row-price { width:70px; font-family:'Playfair Display',serif; font-weight:700; font-size:1rem; color:var(--brown); }
        .ap-row-stock { width:110px; display:flex; align-items:center; gap:0.4rem; font-size:0.82rem; color:var(--brown); }
        .ap-row-stock--low { color:#d97706; }
        .ap-low-badge { background:#fef3c7; color:#d97706; font-size:0.62rem; font-weight:700; padding:0.15rem 0.45rem; border-radius:2rem; }
        .ap-row-imgs  { width:90px; font-size:0.8rem; color:var(--brown); }
        .ap-row-status{ width:100px; }
        .ap-row-actions{ width:80px; display:flex; gap:0.4rem; justify-content:flex-end; }
        .ap-toggle { display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:2rem; font-size:0.72rem; font-weight:600; cursor:pointer; border:none; font-family:inherit; transition:all 0.2s; }
        .ap-toggle--on  { background:#d1fae5; color:#065f46; }
        .ap-toggle--off { background:#f3f4f6; color:#6b7280; }
        .ap-icon-btn      { background:none; border:1px solid rgba(201,168,76,0.25); border-radius:0.4rem; padding:0.35rem 0.45rem; cursor:pointer; color:var(--brown); display:flex; align-items:center; transition:all 0.2s; }
        .ap-icon-btn:hover{ background:var(--cream); }
        .ap-icon-btn--edit:hover { border-color:var(--gold); color:var(--gold); }
        .ap-icon-btn--del:hover  { border-color:#ef4444; color:#ef4444; }
        .ap-icon-btn--del:disabled{ opacity:0.5; cursor:not-allowed; }

        /* Form */
        .ap-form-wrap   { background:white; border-radius:var(--radius-md); border:1.5px solid var(--gold); padding:2rem; margin-bottom:1.5rem; }
        .ap-form-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
        .ap-form-title  { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:var(--brown-deep); }
        .ap-form-grid   { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; }
        .ap-label       { display:block; font-size:0.75rem; font-weight:500; letter-spacing:0.05em; color:var(--brown-mid); margin-bottom:0.35rem; }
        .ap-hint-text   { font-weight:400; color:var(--muted); }
        .ap-input       { width:100%; padding:0.7rem 0.9rem; border:1.5px solid rgba(201,168,76,0.3); border-radius:var(--radius-sm); font-size:0.88rem; font-family:inherit; background:white; color:var(--text); outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .ap-input:focus { border-color:var(--gold); }
        .ap-input--err  { border-color:#ef4444 !important; }
        .ap-textarea    { resize:vertical; min-height:70px; }
        .ap-err         { font-size:0.72rem; color:#ef4444; margin-top:0.25rem; }
        .ap-form-actions{ display:flex; justify-content:flex-end; gap:0.8rem; }
        .ap-cancel-btn  { padding:0.65rem 1.4rem; background:white; border:1.5px solid rgba(201,168,76,0.3); border-radius:3rem; font-size:0.88rem; font-weight:500; cursor:pointer; font-family:inherit; color:var(--brown); }
        .ap-save-btn    { display:flex; align-items:center; gap:0.5rem; padding:0.65rem 1.6rem; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:3rem; font-size:0.88rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .ap-save-btn:hover:not(:disabled) { background:var(--gold); color:var(--brown-deep); }
        .ap-save-btn:disabled { opacity:0.6; cursor:not-allowed; }

        /* Gradient picker */
        .ap-gradient-picker { display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.3rem; }
        .ap-gradient-swatch { width:32px; height:32px; border-radius:8px; cursor:pointer; border:2px solid transparent; transition:transform 0.15s; }
        .ap-gradient-swatch:hover { transform:scale(1.1); }
        .ap-gradient-swatch--active { border-color:var(--brown-deep); transform:scale(1.1); }

        /* Image uploader */
        .ap-img-previews { display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:0.8rem; overflow-x:auto; padding-bottom:0.3rem; }
        .ap-img-preview  { position:relative; flex-shrink:0; }
        .ap-img-preview img { width:80px; height:80px; object-fit:cover; border-radius:8px; border:2px solid rgba(201,168,76,0.3); display:block; }
        .ap-img-remove   { position:absolute; top:-8px; right:-8px; background:white; border:none; cursor:pointer; color:#ef4444; padding:0; display:flex; border-radius:50%; }
        .ap-img-primary  { position:absolute; bottom:0; left:0; right:0; background:rgba(58,33,18,0.75); color:var(--gold-light); font-size:0.6rem; font-weight:700; text-align:center; border-radius:0 0 6px 6px; padding:2px; }
        .ap-img-actions  { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
        .ap-upload-btn   { display:inline-flex; align-items:center; gap:0.4rem; padding:0.55rem 1.1rem; background:var(--cream); border:1.5px solid rgba(201,168,76,0.35); border-radius:var(--radius-sm); font-size:0.82rem; font-weight:600; color:var(--brown); cursor:pointer; font-family:inherit; transition:all 0.2s; white-space:nowrap; }
        .ap-upload-btn:hover { background:var(--gold-pale); border-color:var(--gold); }
        .ap-upload-btn--loading { opacity:0.65; cursor:not-allowed; }
        .ap-url-row      { display:flex; gap:0.5rem; flex:1; min-width:200px; }
        .ap-url-add      { padding:0.55rem 1rem; background:var(--brown-deep); color:var(--gold-light); border:none; border-radius:var(--radius-sm); font-size:0.82rem; font-weight:600; cursor:pointer; font-family:inherit; white-space:nowrap; }
        .ap-url-add:hover { background:var(--gold); color:var(--brown-deep); }

        /* Toast */
        .ap-toast { position:fixed; top:1.5rem; right:1.5rem; z-index:999; display:flex; align-items:center; gap:0.6rem; padding:0.8rem 1.2rem; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:500; box-shadow:0 4px 20px rgba(0,0,0,0.15); animation:ap-slide-in 0.3s ease; }
        .ap-toast--success { background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; }
        .ap-toast--error   { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }
        @keyframes ap-slide-in { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        .ap-loading       { text-align:center; padding:4rem; color:var(--muted); }
        .ap-loading-emoji { font-size:2rem; margin-bottom:0.8rem; animation:ap-bounce 1s ease infinite; }
        .ap-empty         { text-align:center; padding:4rem; background:white; border-radius:var(--radius-md); color:var(--muted); }
        @keyframes ap-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        @media (max-width:900px) {
          .ap-body  { padding:1.2rem; }
          .ap-stats { grid-template-columns:repeat(2,1fr); }
          .ap-form-grid { grid-template-columns:1fr; }
          .ap-form-grid > div { grid-column:span 1 !important; }
          .ap-list-header { display:none; }
          .ap-row-price, .ap-row-stock, .ap-row-imgs { display:none; }
        }
      `}</style>
    </div>
  )
}
