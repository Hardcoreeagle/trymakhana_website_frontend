// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const MARQUEE_ITEMS = [
  "Gluten Free",
  "High Protein",
  "Low Calorie",
  "Vegan Friendly",
  "Ayurvedic Superfood",
  "Natural & Clean",
  "Premium Sourced",
  "Zero Preservatives",
  "Hand Harvested",
  "Slow Roasted",
  "No Additives",
  "Fresh Daily",
];

const FEATURES = [
  {
    icon: "🌾",
    title: "Farm to Pouch",
    desc: "Sourced directly from trusted farms — zero middlemen, zero compromise on quality.",
  },
  {
    icon: "🔥",
    title: "Slow Roasted",
    desc: "Traditional roasting that locks in crunch and flavour the way nature intended.",
  },
  {
    icon: "💚",
    title: "No Nasties",
    desc: "No preservatives, no artificial colours, no MSG — just honest, clean snacking.",
  },
  {
    icon: "📦",
    title: "Pan-India Delivery",
    desc: "All orders delivered within 5–7 business days across India, with real-time order tracking on your phone.",
  },
];

const BENEFITS = [
  { icon: "🌰", text: "Rich in healthy fats and plant protein" },
  { icon: "❤️", text: "Supports heart health and lowers cholesterol" },
  { icon: "🧠", text: "Boosts brain function and focus" },
  { icon: "⚡", text: "Natural energy — no sugar crash" },
  { icon: "🛡️", text: "Strengthens immunity naturally" },
  { icon: "🫐", text: "Packed with antioxidants and minerals" },
  { icon: "⚖️", text: "Aids in weight management" },
  { icon: "🌟", text: "Good for skin, hair and bone health" },
];

const TESTIMONIALS = [
  {
    text: "Honestly the best makhana I've ever had. The peri peri flavour is completely addictive!",
    author: "Priya S.",
    city: "Mumbai",
    rating: 5,
  },
  {
    text: "My whole family switched from chips to Valmiki Foods. Fresh, crunchy, and the dry fruits are top quality too.",
    author: "Rahul M.",
    city: "Delhi",
    rating: 5,
  },
  {
    text: "The dry fruits are so fresh — you can taste the quality. The cashews and almonds are my daily go-to now.",
    author: "Ananya K.",
    city: "Bangalore",
    rating: 5,
  },
  {
    text: "Ordered for my office and everyone loved it. Clean ingredients, great taste, and lovely packaging.",
    author: "Sneha R.",
    city: "Pune",
    rating: 4,
  },
];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  useScrollReveal();
  const { products, loading } = useProducts();

  return (
    <div style={{ background: "var(--warm-white)" }}>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <div
        style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
      >
        {/* Background image */}
        <img
          src="/board.png"
          alt="Valmiki Foods premium dry fruits"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            pointerEvents: "none",
          }}
        />
        {/* Overlay — stronger on left for text, fades right, solid at bottom to hide image text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(8,4,1,0.88) 0%, rgba(8,4,1,0.65) 45%, rgba(8,4,1,0.2) 75%, rgba(8,4,1,0.4) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Bottom fade — covers the image's own text */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background:
              "linear-gradient(to top, rgba(8,4,1,0.75) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "8rem 4rem 4rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--gold-light)",
                marginBottom: "1.4rem",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--gold)",
                  display: "block",
                }}
              />
              Premium Dry Fruits & Makhana
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--gold)",
                  display: "block",
                }}
              />
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                fontWeight: 900,
                lineHeight: 1.06,
                color: "#ffffff",
                marginBottom: "1.2rem",
              }}
            >
              Valmiki Foods:
              <br />
              <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
                Pure Nutrition
              </em>
              <br />
              In Every Bite.
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.65,
                marginBottom: "2.2rem",
                maxWidth: "420px",
              }}
            >
              The finest curated dry fruits and makhanas — naturally sourced,
              carefully roasted, delivered fresh.
            </p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "2.5rem",
              }}
            >
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className="btn btn-outline-light">
                Explore Range
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                "100% Natural",
                "No Preservatives",
                "Premium Quality",
                "Pan-India Delivery",
              ].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.82)",
                    background: "rgba(255,255,255,0.12)",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "2rem",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--brown-deep)",
          overflow: "hidden",
          padding: "1rem 0",
        }}
      >
        <div className="hm-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.7rem",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "var(--gold-light)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>
                ✦
              </span>
              {t}
              <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAKHANA FLAVOURS ────────────────────────────────────── */}
      <section
        style={{ padding: "5rem 4rem", maxWidth: "1200px", margin: "0 auto" }}
        className="reveal"
      >
        <div className="section-eyebrow" style={{ marginBottom: "0.7rem" }}>
          Makhana Range
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 className="section-title">Find Your Favourite Flavour</h2>
          <Link
            to="/shop"
            style={{
              fontSize: "0.85rem",
              color: "var(--gold)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Makhana brand banner */}
        <div className="hm-banner">
          <img
            src="/flavours-banner.png"
            alt="Valmiki Foods makhana flavours"
            className="hm-banner-img"
          />
          <div className="hm-banner-overlay">
            <div className="hm-banner-eyebrow">6 Bold Flavours</div>
            <div className="hm-banner-title">
              Pure Nutrition
              <br />
              In Every Puff.
            </div>
            <Link to="/shop" className="hm-banner-btn">
              Shop Makhana →
            </Link>
          </div>
        </div>

        {/* Makhana 3-col grid — flavoured products */}
        {loading ? (
          <div className="hm-cat-grid">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="hm-skeleton"
                  style={{ animationDelay: `${i * 0.1}s`, height: "340px" }}
                />
              ))}
          </div>
        ) : (
          <div className="hm-cat-grid">
            {products
              .filter(
                (p) =>
                  p.flavour && p.flavour.toLowerCase().includes("flavoured"),
              )
              .slice(0, 6)
              .map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
          </div>
        )}
      </section>

      {/* ── DRY FRUITS CATALOGUE ─────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 4rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid rgba(201,168,76,0.15)",
        }}
        className="reveal"
      >
        <div className="section-eyebrow" style={{ marginBottom: "0.7rem" }}>
          Dry Fruits Range
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 className="section-title">Nature's Finest Selection</h2>
          <Link
            to="/shop"
            style={{
              fontSize: "0.85rem",
              color: "var(--gold)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Dry fruits banner */}
        <div className="hm-banner" style={{ marginBottom: "2rem" }}>
          <img
            src="/dryfruits-banner.png"
            alt="Premium dry fruits"
            className="hm-banner-img"
            style={{ objectPosition: "center 40%" }}
          />
          <div className="hm-banner-overlay">
            <div className="hm-banner-eyebrow">
              Almonds · Cashews · Walnuts · Dates & More
            </div>
            <div className="hm-banner-title">
              The Finest
              <br />
              Curated Dry Fruits.
            </div>
            <Link to="/shop" className="hm-banner-btn">
              Shop Dry Fruits →
            </Link>
          </div>
        </div>

        {/* Dry fruits grid — all non-makhana products, or placeholder if none */}
        {loading ? (
          <div className="hm-cat-grid">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="hm-skeleton"
                  style={{ animationDelay: `${i * 0.1}s`, height: "340px" }}
                />
              ))}
          </div>
        ) : products.filter(
            (p) => p.flavour && !p.flavour.toLowerCase().includes("flavoured"),
          ).length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "var(--cream)",
              borderRadius: "var(--radius-md)",
              border: "1.5px dashed rgba(201,168,76,0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>🌰</div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 700,
                color: "var(--brown-deep)",
                marginBottom: "0.4rem",
              }}
            >
              Dry Fruits Coming Soon
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Our premium dry fruits range is being curated. Check back soon!
            </p>
          </div>
        ) : (
          <div className="hm-cat-grid">
            {products
              .filter(
                (p) =>
                  p.flavour && !p.flavour.toLowerCase().includes("flavoured"),
              )
              .slice(0, 6)
              .map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link to="/shop" className="btn btn-outline">
            Shop All Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--cream)",
          padding: "5rem 4rem",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
        }}
        className="reveal"
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              className="section-eyebrow"
              style={{ justifyContent: "center", marginBottom: "0.8rem" }}
            >
              Why Dry Fruits
            </div>
            <h2 className="section-title">Why Add Dry Fruits to Your Diet?</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  background: "white",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.2rem",
                  border: "1px solid rgba(201,168,76,0.15)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                  {b.icon}
                </span>
                <span
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    color: "var(--brown-deep)",
                  }}
                >
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────────── */}
      <section
        style={{ background: "var(--brown-deep)", padding: "6rem 4rem" }}
        className="reveal"
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            className="section-eyebrow"
            style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}
          >
            Why Valmiki Foods
          </div>
          <h2
            className="section-title"
            style={{ color: "var(--cream)", marginBottom: "3rem" }}
          >
            The Purity Promise
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="hm-feature-card">
                <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                  {f.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--gold-light)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {f.title}
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(250,247,242,0.58)",
                    lineHeight: 1.65,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section style={{ padding: "6rem 4rem" }} className="reveal">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-eyebrow" style={{ marginBottom: "0.8rem" }}>
            Happy Customers
          </div>
          <h2 className="section-title" style={{ marginBottom: "3rem" }}>
            What People Are Saying
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "var(--cream)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  position: "relative",
                  border: "1px solid rgba(201,168,76,0.18)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3.5rem",
                    color: "var(--gold-light)",
                    position: "absolute",
                    top: "0.4rem",
                    left: "1rem",
                    lineHeight: 1,
                  }}
                >
                  "
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    marginTop: "1.2rem",
                    marginBottom: "0.8rem",
                  }}
                >
                  {Array(t.rating)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        size={13}
                        fill="var(--gold)"
                        color="var(--gold)"
                      />
                    ))}
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--brown)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    marginBottom: "1rem",
                  }}
                >
                  {t.text}
                </p>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "var(--brown-deep)",
                  }}
                >
                  {t.author}{" "}
                  <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                    · {t.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--gold) 0%, #e8a82a 100%)",
          padding: "5rem 4rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            color: "var(--brown-deep)",
            marginBottom: "0.8rem",
          }}
        >
          Ready to Snack Smarter?
        </h2>
        <p
          style={{
            color: "rgba(42,21,8,0.72)",
            fontSize: "1rem",
            marginBottom: "2rem",
          }}
        >
          Free shipping on orders above ₹499 · Same-day dispatch before 2 PM
        </p>
        <Link to="/shop" className="btn btn-primary">
          Shop Now <ArrowRight size={16} />
        </Link>
      </section>

      <style>{`
        .hm-marquee-track {
          display:flex; gap:2.5rem;
          animation:hm-marquee 26s linear infinite;
          width:max-content;
        }
        @keyframes hm-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* Flavours banner */
        .hm-banner { border-radius:var(--radius-lg); overflow:hidden; margin-bottom:2.5rem; position:relative; height:260px; }
        .hm-banner-img { width:100%; height:100%; object-fit:cover; object-position:center 42%; display:block; }
        .hm-banner-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(12,6,2,0.72) 0%,rgba(12,6,2,0.35) 55%,rgba(12,6,2,0.05) 100%); display:flex; flex-direction:column; justify-content:center; padding:2.5rem 3rem; }
        .hm-banner-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-light); margin-bottom:0.6rem; }
        .hm-banner-title { font-family:'Playfair Display',serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:900; color:white; line-height:1.15; margin-bottom:1.2rem; }
        .hm-banner-btn { display:inline-block; background:var(--gold); color:var(--brown-deep); font-size:13px; font-weight:700; padding:0.6rem 1.4rem; border-radius:2rem; text-decoration:none; transition:all 0.25s; width:fit-content; }
        .hm-banner-btn:hover { background:var(--brown-deep); color:var(--gold-light); }

        /* 3-col catalogue grid */
        .hm-cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }

        /* Skeleton */
        .hm-skeleton {
          flex:0 0 260px; height:360px;
          background:var(--cream); border-radius:var(--radius-md);
          animation:hm-pulse 1.5s ease infinite;
        }
        @keyframes hm-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }

        /* Feature card */
        .hm-feature-card {
          padding:1.8rem;
          border:1px solid rgba(201,168,76,0.2);
          border-radius:var(--radius-md);
          transition:background 0.3s, border-color 0.3s;
        }
        .hm-feature-card:hover { background:rgba(201,168,76,0.08); border-color:var(--gold); }

        /* Responsive */
        @media(max-width:768px) {
          section { padding-left:1.2rem !important; padding-right:1.2rem !important; padding-top:3rem !important; padding-bottom:3rem !important; }
          .hm-banner { height:220px; border-radius:12px; }
          .hm-banner-overlay { padding:1.2rem 1.5rem; }
          .hm-banner-title { font-size:1.4rem !important; }
          .hm-banner-eyebrow { font-size:10px; }
          .hm-cat-grid { grid-template-columns:repeat(2,1fr); gap:0.8rem; }
          .hm-features-grid { grid-template-columns:1fr 1fr !important; }
          .hm-testimonials-grid { grid-template-columns:1fr !important; }
        }
        @media(max-width:480px) {
          .hm-cat-grid { grid-template-columns:1fr; }
          .hm-banner { height:180px; }
          .hm-features-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}
