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
}))

export default useAuthStore
