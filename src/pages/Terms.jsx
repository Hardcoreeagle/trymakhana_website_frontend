// src/pages/Terms.jsx
import PolicyPage from './PolicyPage'

export default function Terms() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      subtitle="These terms explain how you may use the Valmiki Foods website, place orders, and interact with our services. By using the site, you agree to follow these terms."
      lastUpdated="May 26, 2026"
      sections={[
        {
          title: 'Use of the website',
          paragraphs: [
            'You must use this website for lawful purposes only and must not attempt to disrupt, copy, or misuse any part of the service.',
            'We may update, suspend, or improve the website at any time without prior notice when required for business, security, or technical reasons.',
          ],
        },
        {
          title: 'Orders and pricing',
          paragraphs: [
            'Placing an order is an offer to buy. We may accept, reject, or cancel an order if product availability, payment, or order details are inaccurate.',
            'Prices, offers, and delivery charges may change without notice, but the amount shown at checkout will apply to your confirmed order.',
          ],
        },
        {
          title: 'Intellectual property',
          paragraphs: [
            'All content on this website, including text, images, logos, product descriptions, and design elements, belongs to Valmiki Foods or its licensors.',
            'You may not copy, distribute, or reuse any content without written permission.',
          ],
        },
        {
          title: 'Liability',
          paragraphs: [
            'We work to keep the site accurate and available, but we do not guarantee uninterrupted access or that every detail will always be error-free.',
            'To the extent allowed by law, Valmiki Foods is not responsible for indirect or incidental losses arising from the use of this website.',
          ],
        },
      ]}
    />
  )
}