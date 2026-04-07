// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],         // [{ id, name, price, quantity, emoji, flavour }]
      isOpen: false,

      addItem: (product) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter(i => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty < 1) return get().removeItem(id)
        set({ items: get().items.map(i => i.id === id ? { ...i, quantity: qty } : i) })
      },

      clearCart: () => set({ items: [] }),

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Derived
      get totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0) },
      get totalPrice() { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },
    }),
    { name: 'makhana-cart' }
  )
)

export default useCartStore
