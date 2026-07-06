// src/api/index.js
// ─────────────────────────────────────────────────────────────────────────
// All frontend → backend API calls live here.
// Set VITE_API_URL in a .env file in the frontend root:
//   VITE_API_URL=http://localhost:4000
// ─────────────────────────────────────────────────────────────────────────
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const BASE = rawBase.replace(/\/$/, '')

// Gets JWT token from localStorage for authenticated requests
export async function getAuthHeader() {
  const token = localStorage.getItem('admin_token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function request(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(extraHeaders || {}) },
    ...rest,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ── Orders ────────────────────────────────────────────────────────────────

export async function placeOrderAPI({ customer, address, items, total }) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ customer, address, items, total }),
  })
}

export async function fetchAllOrdersAPI() {
  const headers = await getAuthHeader()
  return request('/api/orders', { headers })
}

export async function fetchOrderByIdAPI(orderId) {
  return request(`/api/orders/track/${orderId}`)
}

export async function fetchOrdersByEmailAPI(email) {
  return request(`/api/orders/track/email/${encodeURIComponent(email)}`)
}

export async function updateOrderStatusAPI(orderId, status) {
  const headers = await getAuthHeader()
  return request(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  })
}

export async function updateCourierInfoAPI(orderId, { courierName, courierTrackingNo }) {
  const headers = await getAuthHeader()
  return request(`/api/orders/${orderId}/courier`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ courierName, courierTrackingNo }),
  })
}

export async function markOrderPaidAPI(orderId, paymentId) {
  const headers = await getAuthHeader()
  return request(`/api/orders/${orderId}/payment`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ paymentStatus: 'paid', paymentId }),
  })
}

// ── Products ──────────────────────────────────────────────────────────────

// Public — no auth, only returns active products
export async function fetchProductsPublicAPI() {
  return request('/api/products/public')
}

export async function fetchProductsAPI() {
  const headers = await getAuthHeader()
  return request('/api/products', { headers })
}

export async function saveProductAPI(product) {
  const headers = await getAuthHeader()
  if (product.id) {
    return request(`/api/products/${product.id}`, {
      method: 'PUT', headers,
      body: JSON.stringify(product),
    })
  }
  return request('/api/products', {
    method: 'POST', headers,
    body: JSON.stringify(product),
  })
}

export async function deleteProductAPI(id) {
  const headers = await getAuthHeader()
  return request(`/api/products/${id}`, { method: 'DELETE', headers })
}

export async function toggleProductAPI(id, active) {
  const headers = await getAuthHeader()
  return request(`/api/products/${id}/toggle`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ active }),
  })
}

export async function updatePaymentStatusAPI(orderId, paymentStatus) {
  const headers = await getAuthHeader()
  return request(`/api/orders/${orderId}/payment`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ paymentStatus }),
  })
}
