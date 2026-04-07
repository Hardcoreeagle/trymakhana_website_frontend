// src/components/LeafDecor.jsx
// Decorative leaf SVGs — inspired by the Valmiki Foods brand imagery.
// Use position:absolute parent with overflow:hidden to clip them.

export function Leaf1({ size = 80, color = '#2d6a2d', opacity = 0.18, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', ...style }}>
      <path
        d="M10 90 C10 90 5 50 40 25 C70 5 95 10 95 10 C95 10 90 40 60 62 C35 80 10 90 10 90Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M10 90 C35 70 60 50 95 10"
        stroke={color} strokeWidth="1.5" strokeOpacity={opacity * 1.5} fill="none"
      />
      <path d="M52 37 C45 50 30 65 10 90" stroke={color} strokeWidth="0.8" strokeOpacity={opacity} fill="none" />
      <path d="M72 22 C65 38 50 58 25 80" stroke={color} strokeWidth="0.8" strokeOpacity={opacity} fill="none" />
    </svg>
  )
}

export function Leaf2({ size = 70, color = '#2d6a2d', opacity = 0.15, style = {} }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 70 100" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', ...style }}>
      <path
        d="M35 5 C55 5 70 25 68 50 C66 75 50 95 35 95 C20 95 4 75 2 50 C0 25 15 5 35 5Z"
        fill={color} opacity={opacity}
      />
      <line x1="35" y1="5" x2="35" y2="95" stroke={color} strokeWidth="1.2" strokeOpacity={opacity * 1.6} />
      <path d="M35 30 C25 35 15 42 8 52" stroke={color} strokeWidth="0.7" strokeOpacity={opacity * 1.2} fill="none" />
      <path d="M35 30 C45 35 55 42 62 52" stroke={color} strokeWidth="0.7" strokeOpacity={opacity * 1.2} fill="none" />
      <path d="M35 55 C22 58 12 65 6 72" stroke={color} strokeWidth="0.7" strokeOpacity={opacity} fill="none" />
      <path d="M35 55 C48 58 58 65 64 72" stroke={color} strokeWidth="0.7" strokeOpacity={opacity} fill="none" />
    </svg>
  )
}

export function Leaf3({ size = 60, color = '#2d6a2d', opacity = 0.14, style = {} }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 120 80" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', ...style }}>
      <path
        d="M5 75 C5 75 20 20 60 8 C95 -2 118 12 118 12 C118 12 100 55 65 65 C35 74 5 75 5 75Z"
        fill={color} opacity={opacity}
      />
      <path d="M5 75 C50 50 90 30 118 12" stroke={color} strokeWidth="1.2" strokeOpacity={opacity * 1.5} fill="none" />
      <path d="M40 22 C35 40 20 58 5 75" stroke={color} strokeWidth="0.7" strokeOpacity={opacity} fill="none" />
      <path d="M70 14 C62 32 48 52 28 70" stroke={color} strokeWidth="0.7" strokeOpacity={opacity} fill="none" />
      <path d="M95 13 C85 30 72 48 55 66" stroke={color} strokeWidth="0.7" strokeOpacity={opacity} fill="none" />
    </svg>
  )
}

export function Leaf4({ size = 50, color = '#2d6a2d', opacity = 0.12, style = {} }) {
  // Small round leaf
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', ...style }}>
      <path
        d="M40 10 C65 10 75 30 70 50 C62 72 40 75 25 65 C8 54 5 32 15 18 C22 8 30 10 40 10Z"
        fill={color} opacity={opacity}
      />
      <path d="M40 10 C38 35 32 55 18 72" stroke={color} strokeWidth="1" strokeOpacity={opacity * 1.4} fill="none" />
    </svg>
  )
}

// Scattered leaf cluster — drop one of these in a section
export function LeafCluster({ position = 'top-right', color = '#2d6a2d', opacity = 0.15 }) {
  const base = { position: 'absolute', pointerEvents: 'none' }

  const positions = {
    'top-right': [
      { comp: Leaf1, style: { ...base, top: '-20px', right: '-15px', transform: 'rotate(-30deg)' }, size: 110 },
      { comp: Leaf3, style: { ...base, top: '40px',  right: '50px',  transform: 'rotate(20deg)' },  size: 70  },
      { comp: Leaf4, style: { ...base, top: '10px',  right: '80px',  transform: 'rotate(-60deg)' }, size: 55  },
    ],
    'top-left': [
      { comp: Leaf1, style: { ...base, top: '-15px', left: '-20px', transform: 'rotate(120deg) scaleX(-1)' }, size: 100 },
      { comp: Leaf2, style: { ...base, top: '30px',  left: '55px',  transform: 'rotate(-20deg)' }, size: 55 },
      { comp: Leaf4, style: { ...base, top: '5px',   left: '80px',  transform: 'rotate(40deg)' },  size: 48 },
    ],
    'bottom-left': [
      { comp: Leaf3, style: { ...base, bottom: '-10px', left: '-10px', transform: 'rotate(160deg)' }, size: 90 },
      { comp: Leaf1, style: { ...base, bottom: '30px',  left: '60px',  transform: 'rotate(200deg)' }, size: 70 },
      { comp: Leaf4, style: { ...base, bottom: '10px',  left: '100px', transform: 'rotate(80deg)' },  size: 44 },
    ],
    'bottom-right': [
      { comp: Leaf1, style: { ...base, bottom: '-15px', right: '-10px', transform: 'rotate(-150deg)' }, size: 95 },
      { comp: Leaf2, style: { ...base, bottom: '25px',  right: '60px',  transform: 'rotate(-30deg)' },  size: 60 },
      { comp: Leaf4, style: { ...base, bottom: '5px',   right: '100px', transform: 'rotate(100deg)' },  size: 45 },
    ],
    'both-sides': [
      { comp: Leaf1, style: { ...base, top: '10px',  left: '-15px',  transform: 'rotate(130deg)' }, size: 90 },
      { comp: Leaf3, style: { ...base, top: '60px',  left: '50px',   transform: 'rotate(10deg)' },  size: 65 },
      { comp: Leaf1, style: { ...base, top: '10px',  right: '-15px', transform: 'rotate(-30deg)' }, size: 90 },
      { comp: Leaf4, style: { ...base, top: '60px',  right: '50px',  transform: 'rotate(-50deg)' }, size: 52 },
    ],
  }

  const leaves = positions[position] || positions['top-right']

  return (
    <>
      {leaves.map(({ comp: LeafComp, style, size }, i) => (
        <LeafComp key={i} size={size} color={color} opacity={opacity} style={style} />
      ))}
    </>
  )
}
