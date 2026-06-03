// src/pages/Terms.jsx
import PolicyPage from './PolicyPage'

export default function Terms() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      subtitle="Welcome to MaaKhana Stores (https://trymaakhanastores.com/). These Terms and Conditions govern your use of our website and the purchase of products or services from us. This website is managed by SITA ENTERPRISES."
      lastUpdated="June 3, 2026"
      sections={[
        {
          title: '1. General Conditions',
          paragraphs: [
            'By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence.',
            'We reserve the right to refuse service to anyone for any reason at any time.',
            'You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service without our express written permission.',
          ],
        },
        {
          title: '2. Accuracy of Information & Products',
          paragraphs: [
            "We strive to display the colors, descriptions, packaging, and details of our products as accurately as possible, but device displays may vary.",
            'Information on this site is provided for general information only; we may modify site content at any time and are not obligated to update it. It is your responsibility to monitor changes to our site.',
          ],
        },
        {
          title: '3. Pricing and Modifications',
          paragraphs: [
            'Prices for our products are subject to change without notice.',
            'We reserve the right to modify or discontinue any product or service (or any part or content thereof) without notice.',
            'We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Service.',
          ],
        },
        {
          title: '4. Orders and Billing Accuracy',
          paragraphs: [
            'We reserve the right to refuse or cancel any order you place with us and may limit or cancel quantities purchased per person, household, or order.',
            'If we change or cancel an order, we will attempt to notify you using the e-mail or phone number provided at the time the order was made.',
            'You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.',
          ],
        },
        {
          title: '5. Shipping and Delivery',
          paragraphs: [
            'Shipping times and costs may vary depending on product availability and your delivery location.',
            'Any delivery dates provided by us are estimates only. MaaKhana Stores is not responsible for delays caused by shipping carriers or other events beyond our control.',
          ],
        },
        {
          title: '6. Return and Refund Policy',
          paragraphs: [
            'Your purchases are subject to our Return and Refund Policy. Please review the specific page on our website for detailed information regarding eligibility, timeframes, and refund processing.',
            'For hygiene and safety reasons, certain perishable items or grocery goods may not be eligible for return unless they arrive damaged or expired.',
          ],
        },
        {
          title: '7. Intellectual Property',
          paragraphs: [
            'All content on this site, such as text, graphics, logos, images, digital downloads, and data compilations, is the property of MaaKhana Stores and is protected by applicable copyright and intellectual property laws.',
          ],
        },
        {
          title: '8. User Comments and Feedback',
          paragraphs: [
            'If you send creative ideas, suggestions, reviews, proposals, or other materials to us, you agree that we may, at any time and without restriction, edit, copy, publish, distribute, and otherwise use any comments that you forward to us.',
          ],
        },
        {
          title: '9. Third-Party Links',
          paragraphs: [
            'Certain content, products, and services available via our website may include materials from third parties. Third-party links may direct you to websites not affiliated with us, and we are not responsible for examining or evaluating the content or accuracy of these external sites.',
          ],
        },
        {
          title: '10. Indemnification',
          paragraphs: [
            'You agree to indemnify, defend, and hold harmless MaaKhana Stores and our partners, officers, directors, agents, contractors, and employees from any claim or demand, including reasonable attorneys’ fees, made by any third party due to or arising out of your breach of these Terms.',
          ],
        },
        {
          title: '11. Governing Law',
          paragraphs: [
            'These Terms and Conditions and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of INDIA.',
          ],
        },
        {
          title: '12. Changes to Terms and Conditions',
          paragraphs: [
            'We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.',
            'You can review the most current version of the Terms and Conditions at any time on this page.',
          ],
        },
        {
          title: '13. Contact Information',
          paragraphs: [
            'Questions about the Terms and Conditions should be sent to us at:',
            'Email: support@trymaakhanastores.com',
            'Contact Number: +91 8278647931',
          ],
        },
      ]}
    />
  )
}