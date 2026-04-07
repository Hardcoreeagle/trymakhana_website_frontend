// src/components/Logo.jsx
// Valmiki Foods logo — used in Navbar, Footer, AdminLayout, AdminLogin
const LOGO_SRC = '/valmiki-logo.png'

export default function Logo({ height = 44, style = {} }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Valmiki Foods"
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', ...style }}
    />
  )
}
