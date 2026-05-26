// src/pages/Privacy.jsx
import PolicyPage from './PolicyPage'

export default function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="We respect your privacy and only collect information needed to process orders, improve the website, and provide customer support."
      lastUpdated="May 26, 2026"
      sections={[
        {
          title: 'Information we collect',
          paragraphs: [
            'We may collect your name, phone number, email address, shipping details, order history, and payment-related information that is necessary to complete your purchase.',
            'We may also collect basic device and browser information to keep the website secure and improve performance.',
          ],
        },
        {
          title: 'How we use information',
          paragraphs: [
            'Your information is used to process orders, send confirmations, provide delivery updates, respond to support requests, and improve our products and services.',
            'We do not sell your personal information. We only share it with trusted service providers when needed to operate the business, such as payment, shipping, or communication tools.',
          ],
        },
        {
          title: 'Cookies and analytics',
          paragraphs: [
            'We may use cookies or similar technologies to keep your session active, remember preferences, and understand how visitors use the site.',
            'Any analytics data is used in aggregate form and is not intended to identify you personally.',
          ],
        },
        {
          title: 'Your choices',
          paragraphs: [
            'You may contact us to review, update, or request deletion of your personal information, subject to legal and operational requirements.',
            'If you do not want to receive promotional messages, you can opt out through the message link or by contacting us directly.',
          ],
        },
      ]}
    />
  )
}