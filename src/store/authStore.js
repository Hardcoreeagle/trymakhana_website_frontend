// src/store/authStore.js
import { create } from 'zustand'
import { subscribeToAuth } from '../firebase/auth'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: () => {
    const unsubscribe = subscribeToAuth((user) => {
      set({ user, loading: false })
    })
    return unsubscribe
  },

  // Call this after login to immediately update store
  setUser: (user) => set({ user, loading: false }),
}))

export default useAuthStore
