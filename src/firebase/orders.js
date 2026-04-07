// src/firebase/orders.js — all order operations direct to Firestore
import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COL = 'orders'

// ── Place order ───────────────────────────────────────────────────────────
export async function placeOrderFirestore({ customer, address, items, total }) {
  const ref = await addDoc(collection(db, COL), {
    customer,
    address,
    items,
    total,
    status:        'pending',
    paymentStatus: 'unpaid',
    courierName:   '',
    courierTrackingNo: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

// ── Fetch all orders (admin) ──────────────────────────────────────────────
export async function fetchAllOrdersFirestore() {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null }))
}

// ── Fetch by order ID ─────────────────────────────────────────────────────
export async function fetchOrderByIdFirestore(id) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) throw new Error('Order not found')
  const d = snap.data()
  return { id: snap.id, ...d, createdAt: d.createdAt?.toDate?.()?.toISOString() || null }
}

// ── Fetch by email ────────────────────────────────────────────────────────
export async function fetchOrdersByEmailFirestore(email) {
  const snap = await getDocs(query(collection(db, COL), where('customer.email', '==', email), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null }))
}

// ── Update status ─────────────────────────────────────────────────────────
export async function updateOrderStatusFirestore(id, status) {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })
}

// ── Update courier info ───────────────────────────────────────────────────
export async function updateCourierInfoFirestore(id, { courierName, courierTrackingNo }) {
  await updateDoc(doc(db, COL, id), { courierName, courierTrackingNo, updatedAt: serverTimestamp() })
}

// ── Update payment status ─────────────────────────────────────────────────
export async function updatePaymentStatusFirestore(id, paymentStatus) {
  await updateDoc(doc(db, COL, id), { paymentStatus, updatedAt: serverTimestamp() })
}
