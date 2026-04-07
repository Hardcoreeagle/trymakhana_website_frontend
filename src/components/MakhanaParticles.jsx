// src/components/MakhanaParticles.jsx
import { useEffect, useRef } from 'react'

export default function MakhanaParticles({ count = 24 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = Array.from({ length: count }, (_, i) => {
      const el = document.createElement('div')
      el.className = 'mk-particle'
      const size = 18 + Math.random() * 52
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -${size}px;
        --float-dur: ${9 + Math.random() * 13}s;
        --float-delay: ${Math.random() * 14}s;
      `
      container.appendChild(el)
      return el
    })

    return () => particles.forEach(p => p.remove())
  }, [count])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
