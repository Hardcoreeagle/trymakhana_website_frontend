// src/firebase/products.js
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, query, orderBy,
} from 'firebase/firestore'
import { db } from './config'

const COL = 'products'

export async function fetchPublicProductsFromFirestore() {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'asc')))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.active !== false)
}

export async function fetchAllProductsFromFirestore() {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'asc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function saveProductToFirestore(product) {
  const { id, ...data } = product
  const payload = {
    ...data,
    active:    data.active !== false,
    updatedAt: new Date().toISOString(),
  }
  if (id) {
    await updateDoc(doc(db, COL, id), payload)
    return { id }
  } else {
    payload.createdAt = new Date().toISOString()
    const ref = await addDoc(collection(db, COL), payload)
    return { id: ref.id }
  }
}

export async function deleteProductFromFirestore(id) {
  await deleteDoc(doc(db, COL, id))
}

export async function toggleProductInFirestore(id, active) {
  await updateDoc(doc(db, COL, id), {
    active,
    updatedAt: new Date().toISOString(),
  })
}
