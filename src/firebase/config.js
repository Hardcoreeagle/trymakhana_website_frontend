// // src/firebase/config.js
// // ─────────────────────────────────────────────────────────────────────────────
// // 🔥 SETUP INSTRUCTIONS:
// //   1. Go to https://console.firebase.google.com
// //   2. Create a new project called "makhana-magic"
// //   3. Add a Web App (</> icon)
// //   4. Copy your firebaseConfig values below
// //   5. Enable Firestore Database (in test mode to start)
// //   6. Enable Authentication → Email/Password
// // ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD3hp5QEv4kWv3mksvKJsUgF7H6RwGKR7U",
  authDomain: "makhana-magic-e6ffe.firebaseapp.com",
  projectId: "makhana-magic-e6ffe",
  storageBucket: "makhana-magic-e6ffe.firebasestorage.app",
  messagingSenderId: "64623810448",
  appId: "1:64623810448:web:85b351dd6d2c1362ffc515"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app