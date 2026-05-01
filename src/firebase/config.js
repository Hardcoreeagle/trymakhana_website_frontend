// src/firebase/config.js
// ─────────────────────────────────────────────────────────────────────────────
// 🔥 SETUP INSTRUCTIONS:
//   1. Go to https://console.firebase.google.com
//   2. Create a new project called "makhana-magic"
//   3. Add a Web App (</> icon)
//   4. Copy your firebaseConfig values below
//   5. Enable Firestore Database (in test mode to start)
//   6. Enable Authentication → Email/Password
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
