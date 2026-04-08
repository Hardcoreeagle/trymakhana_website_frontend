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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
