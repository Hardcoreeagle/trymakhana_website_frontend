// src/pages/ReturnRefund.jsx
import PolicyPage from './PolicyPage'

export default function ReturnRefund() {
  return (
    <PolicyPage
      title="Return and Refund Policy"
      subtitle="Because our products are food items, we follow a careful return and refund process focused on safety, freshness, and fair resolution of genuine issues."
      lastUpdated="June 3, 2026"
      sections={[
        {
          title: 'Return eligibility',
          paragraphs: [
            'We generally do not accept returns for opened or consumed food items. Please inspect your package immediately after delivery.',
            'If you receive the wrong product, a damaged package, or an item that is spoiled or missing, contact us promptly with order details and photos.',
          ],
        },
        {
          title: 'Refunds and replacements',
          paragraphs: [
            'Once we verify a valid issue, we may offer a replacement, store credit, or refund depending on the situation and product availability.',
            'Refunds, when approved, are issued to the original payment method whenever possible. Processing times may vary by bank or payment provider.',
            'We offer 2 days return if the product is damaged or defective.',
            'We may offer store credit that will be issued to you within 2 days of receiving returned item and it will be valid till 60 days from the date of issue.',
            'Approved refund will be processed and credited to your original payment method within 5-7 Business days.',
          ],
        },
        {
          title: 'Request timeline',
          paragraphs: [
            'Please raise any delivery or quality issue within 24 hours of receiving the order so we can investigate quickly.',
            'Late claims may be declined if we cannot confirm the condition of the product or shipment.',
          ],
        },
        {
          title: 'How to contact us',
          paragraphs: [
            'Include your order number, a short description of the issue, and clear photos where possible. This helps us resolve the case faster and more accurately.',
          ],
        },
      ]}
    />
  )
}