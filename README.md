# 🍿 MakhanaMagic — React + Vite + Firebase

A full-featured e-commerce website for a premium makhana (fox nut) business.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + Vite                   |
| Routing     | React Router v6                   |
| State       | Zustand (cart, persisted)         |
| Animations  | CSS animations + Framer Motion    |
| Icons       | Lucide React                      |
| Backend     | Firebase (Firestore + Auth)       |
| Styling     | Plain CSS with CSS Variables      |

---

## Project Structure

```
makhana-magic/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky nav with cart badge
│   │   ├── CartSidebar.jsx     # Slide-out cart drawer
│   │   ├── ProductCard.jsx     # Product card with add-to-cart
│   │   ├── MakhanaParticles.jsx # Floating background particles
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx            # Hero + marquee + products + testimonials
│   │   ├── Shop.jsx            # Full shop with filter tabs
│   │   ├── Checkout.jsx        # Checkout form → Firebase order
│   │   └── Admin.jsx           # Order management dashboard
│   ├── store/
│   │   └── cartStore.js        # Zustand cart store
│   ├── firebase/
│   │   ├── config.js           # Firebase init (add your keys here)
│   │   └── orders.js           # Firestore CRUD for orders
│   ├── data/
│   │   └── products.js         # Product catalogue
│   ├── styles/
│   │   └── global.css          # CSS variables + base styles
│   ├── App.jsx                 # Router + layout
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Setup Instructions

### Step 1 — Install dependencies

```bash
cd makhana-magic
npm install
```

### Step 2 — Set up Firebase

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `makhana-magic`
3. Click the **`</>`** (Web) icon to add a web app
4. Copy the `firebaseConfig` object
5. Open `src/firebase/config.js` and paste your values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

6. In Firebase Console → **Firestore Database** → Create database (start in test mode)
7. *(Optional)* Enable **Authentication → Email/Password** for future admin login

### Step 3 — Run the dev server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## Pages & Features

### `/` — Home
- Animated hero with rotating makhana orb
- Floating makhana particle background
- Scrolling marquee banner
- Featured products (first 4)
- "Why Us" features section
- Customer testimonials
- CTA banner

### `/shop` — Shop
- All 6 products
- Filter tabs by flavour category
- Stock warning badges
- Add to cart with animated feedback

### `/checkout` — Checkout
- Full delivery form with validation
- Live order summary with free shipping threshold
- Places order to **Firebase Firestore** on submit
- Success screen with order ID

### `/admin` — Admin Dashboard
- Stats cards: total orders, revenue, pending, delivered
- Filter orders by status
- Update order status inline (pending → confirmed → shipped → delivered)
- Expand any order to see items + delivery address

---

## 🔥 Firestore Data Structure

```
orders/
  {orderId}/
    customer: { name, email, phone }
    address:  { line, city, state, pincode }
    items:    [{ id, name, price, quantity }]
    total:    Number
    status:   "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    paymentStatus: "unpaid" | "paid"
    createdAt: Timestamp
    updatedAt: Timestamp
```

---

## 🛣️ What to Build Next

- [ ] Razorpay / UPI payment integration
- [ ] Admin login with Firebase Auth (protect `/admin`)
- [ ] Order tracking page for customers (`/track`)
- [ ] Email confirmations (Firebase Functions + Nodemailer)
- [ ] Bulk orders page with custom pricing
- [ ] Customer reviews stored in Firestore
- [ ] Product detail pages
- [ ] Inventory management in admin

---

## Build for Production

```bash
npm run build
npm run preview
```

Deploy to **Firebase Hosting**, **Vercel**, or **Netlify** — all work seamlessly with Vite.

```bash
# Vercel (recommended)
npx vercel

# Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```
