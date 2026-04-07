// src/hooks/useProducts.js
// Fetches products with a 3-tier fallback:
//   1. Backend API (fastest, most up to date)
//   2. Direct Firestore (works without backend — always has live data)
//   3. Static products.js (last resort if Firebase not configured)
import { useState, useEffect } from 'react'
import { fetchProductsPublicAPI } from '../api'
import { fetchPublicProductsFromFirestore } from '../firebase/products'
import { products as staticProducts } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [source, setSource]     = useState(null) // 'api' | 'firestore' | 'static'

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)

      // 1️⃣ Try backend API first
      try {
        const data = await fetchProductsPublicAPI()
        if (!cancelled && data.length >= 0) {
          setProducts(data)
          setSource('api')
          setLoading(false)
          return
        }
      } catch (_) {}

      // 2️⃣ Backend unavailable — go directly to Firestore
      try {
        const data = await fetchPublicProductsFromFirestore()
        if (!cancelled) {
          setProducts(data)
          setSource('firestore')
          setLoading(false)
          return
        }
      } catch (_) {}

      // 3️⃣ Last resort — static file
      if (!cancelled) {
        setProducts(staticProducts)
        setSource('static')
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, loading, source }
}
