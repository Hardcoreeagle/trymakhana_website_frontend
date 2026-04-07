// src/utils/sendConfirmationEmail.js
// ─────────────────────────────────────────────────────────────────────────────
// Uses EmailJS to send order confirmation emails directly from the browser.
//
// SETUP (one-time, ~5 minutes):
//   1. Go to https://www.emailjs.com and create a free account
//   2. Add an Email Service (Gmail recommended) → copy the SERVICE_ID
//   3. Create an Email Template using the variables listed below → copy TEMPLATE_ID
//   4. Go to Account → API Keys → copy your PUBLIC_KEY
//   5. Paste all three values in the config below
//
// Template variables to use in your EmailJS template:
//   {{to_name}}       — customer's name
//   {{to_email}}      — customer's email (set as "To Email" in template)
//   {{order_id}}      — Firebase order ID
//   {{order_items}}   — formatted list of items
//   {{order_total}}   — total amount
//   {{order_address}} — delivery address
//   {{shop_name}}     — "MakhanaMagic"
// ─────────────────────────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

export async function sendConfirmationEmail({ orderId, customer, address, items, total }) {
  // Dynamically load EmailJS SDK (avoids adding it to bundle if email fails)
  const emailjs = await import('@emailjs/browser')

  const itemsList = items
    .map(i => `${i.name} x${i.quantity} — ₹${i.price * i.quantity}`)
    .join('\n')

  const addressStr = `${address.line}, ${address.city}, ${address.state} — ${address.pincode}`

  const templateParams = {
    to_name:       customer.name,
    to_email:      customer.email,
    order_id:      orderId,
    order_items:   itemsList,
    order_total:   `₹${total}`,
    order_address: addressStr,
    shop_name:     'MakhanaMagic',
  }

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    EMAILJS_PUBLIC_KEY
  )
}
