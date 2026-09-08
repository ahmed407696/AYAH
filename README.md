# AYAH — Premium Tech PWA 📱⚡

A modern, mobile-first **Progressive Web App** for the AYAH technology brand. Customers browse a beautiful catalog, save favorites and **order via WhatsApp** (no online payment) — while you manage everything from a built-in **Admin Command Center**. Installable on any phone's home screen, works offline.

---

## 🚀 Quick start

```bash
npm install
npm run dev        # development (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the production build
```

**Live site: https://ahmed407696.github.io/AYAH/** — auto-deploys from `main` via GitHub Actions (`.github/workflows/deploy-pages.yml`). The sandbox preview runs the production build (`npm run preview`) on port 4173.

## 📲 Open it on your phone right now

1. Open the **preview link** on your phone (the sandbox preview URL for port 4173).
2. **iPhone (Safari):** tap the **Share** button → **Add to Home Screen** → **Add**.
3. **Android (Chrome):** tap the **⋮** menu → **Install app** (or use the “Install AYAH” banner on the home page).
4. Launch **AYAH** from your home screen — it opens full-screen like a native app, and the catalog keeps working **offline**.

## 🔐 Admin access

| | |
|---|---|
| URL | open the app → bottom nav → **Admin** (or `#/admin`) |
| Passcode | **`ayah2026`** |
| Change it | Admin → Store settings → Change admin passcode ⚠️ *do this first* |

## 🛠 Add your first product (2 minutes)

1. Open **Admin** → enter the passcode.
2. Tap **Add product**.
3. Fill in: name, price, category, description, **photos** (upload from your phone's camera roll *or* paste image URLs), and specs (label/value pairs).
4. Toggle **Featured** / **In stock** / **Low stock** as you like.
5. Tap **Publish product** — it appears in the store instantly for every customer.

Other commands (all visible in the dashboard): **Manage products** (edit / feature / stock / delete), **Categories**, **Store settings** (WhatsApp number, currency, passcode), **Transfer to another phone** (JSON backup with catalog + settings), **Import backup**, **Reset demo data**, **Setup guide**.

## 💬 Connect your real WhatsApp number

Admin → **Store settings** → *WhatsApp number* → enter digits with country code (e.g. `15551234567`). Every **“Order on WhatsApp”** button then opens a chat with a **pre-filled message** containing the product name, price and item ID.

> Data (products, categories, store settings, favorites, theme) is stored **locally in the browser** via `localStorage` — instant, free, and works offline. Use **Transfer to another phone** and **Import backup** to move the catalog and store settings between devices.

## ✨ Features

**Customer**
- Home: hero, stats, category rail, featured, 🔥 deals, new arrivals, recently viewed
- Shop: live search, sort (featured/newest/price/A–Z), filters (category, max price, in-stock, featured)
- Product: swipeable gallery + lightbox (double-tap zoom, swipe to dismiss), specs table, stock badges
- **Order via WhatsApp** on every product (pre-filled message) + center-of-nav WhatsApp FAB
- Favorites (persistent), **smart “You may also like” recommendations**, share sheet (WhatsApp / copy link / native)
- **Pull-to-refresh**, **skeleton loaders**, page transitions, dark + light mode, haptic feedback, offline banner

**Admin**
- Secure passcode login (session-scoped)
- Dashboard: total products, featured count, out-of-stock/low-stock alerts, catalog value
- Every command visible as a card — nothing hidden
- Add/edit/delete products with multi-image support (upload resizes images automatically)
- Featured / out-of-stock / low-stock toggles, category manager, persistent settings, transfer backup/export/import

**PWA**
- Installable (custom neon circuit-“A” icon, maskable + apple-touch icons, shortcuts)
- Service worker precaches the whole app; images cached at runtime → **full offline browsing**
- Hash-based routing (`#/product/...`) so deep links survive any static host

## 🧱 Tech stack

React 18 · Vite 5 · Tailwind CSS · Zustand (persisted store) · Framer Motion · lucide-react · vite-plugin-pwa (Workbox) · Inter + Space Grotesk variable fonts.

```
src/
├── main.jsx            # entry + service worker registration
├── App.jsx             # routes, theme sync, online/offline, install prompt
├── index.css           # tailwind + custom slider/scrollbar styles
├── store/app.js        # zustand store (products, categories, settings, session)
├── lib/                # constants, formatting, smart recommendations, WhatsApp links
├── components/         # cards, sheets, carousel, lightbox, pull-to-refresh, nav…
└── pages/              # Home, Shop, Product, Favorites, Help, Admin (+ form/categories/settings)
public/
├── icons/              # PWA icons (192/512/maskable/apple-touch/favicon)
└── products/           # demo product photography
branding/               # editable icon master (AI-generated brand mark)
```

## 🌐 Deployment

**Already deployed!** The official site is **https://ahmed407696.github.io/AYAH/** — GitHub Actions builds and publishes automatically on every merge to `main` (workflow: `.github/workflows/deploy-pages.yml`, builds with `DEPLOY_TARGET=pages` so all URLs get the `/AYAH/` base).

To ship an update: push changes to the active feature branch → open a PR to `main` → merge. Live in ~40 seconds; installed apps auto-update on next visit thanks to the service worker.

Alternatives (if you ever move): **Vercel / Netlify** — import the repo, build `npm run build`, publish `dist` (no rewrite rules needed thanks to hash routing).
