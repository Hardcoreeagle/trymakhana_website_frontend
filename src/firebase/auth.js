// src/firebase/auth.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

export async function loginAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logoutAdmin() {
  await signOut(auth)
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
