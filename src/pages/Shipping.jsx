// src/pages/Shipping.jsx
import PolicyPage from './PolicyPage'

export default function Shipping() {
  return (
    <PolicyPage
      title="Shipping Policy"
      subtitle="We aim to pack and dispatch orders quickly so your snacks arrive fresh, secure, and on time."
      lastUpdated="May 26, 2026"
      sections={[
        {
          title: 'Order processing',
          paragraphs: [
            'Orders are usually processed within 1-2 business days, excluding weekends and public holidays. Processing may take longer during peak order periods.',
            'You will receive order updates through the contact details provided at checkout whenever available.',
          ],
        },
        {
          title: 'Delivery timeline',
          paragraphs: [
            'Delivery time depends on your location and the carrier service used. Most orders are delivered within the standard courier timeline after dispatch.',
            'While we do our best to meet expected timelines, actual delivery may vary due to weather, courier delays, or regional restrictions.',
          ],
        },
        {
          title: 'Shipping charges',
          paragraphs: [
            'Shipping fees, if applicable, are shown at checkout before you place the order. Free shipping offers may apply to selected orders or thresholds.',
            'If any order qualifies for free shipping, the checkout summary will reflect it automatically.',
          ],
        },
        {
          title: 'Undelivered or returned parcels',
          paragraphs: [
            'If a parcel is returned because of an incorrect address, repeated failed delivery attempts, or customer unavailability, we may contact you to arrange re-dispatch.',
            'Additional shipping charges may apply in such cases.',
          ],
        },
      ]}
    />
  )
}