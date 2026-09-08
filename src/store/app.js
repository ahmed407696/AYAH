import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEMO_PASSCODE, RECENT_MAX } from '../lib/constants'

export const DEFAULT_CATEGORIES = [
  { slug: 'audio', name: 'Audio', emoji: '🎧' },
  { slug: 'phones', name: 'Phones', emoji: '📱' },
  { slug: 'wearables', name: 'Wearables', emoji: '⌚' },
  { slug: 'laptops', name: 'Laptops', emoji: '💻' },
  { slug: 'gaming', name: 'Gaming', emoji: '🎮' },
  { slug: 'power', name: 'Power', emoji: '🔋' },
  { slug: 'displays', name: 'Displays', emoji: '🖥️' },
  { slug: 'accessories', name: 'Accessories', emoji: '🖱️' }
]

const SEED_PRODUCTS = [
  {
    id: 'pulse-x-headphones',
    name: 'Pulse X Wireless Headphones',
    brand: 'AYAH Audio',
    category: 'audio',
    price: 129,
    oldPrice: 159,
    description:
      'Flagship over-ear headphones with hybrid active noise cancellation, plush memory-foam cushions and a jaw-dropping 60-hour battery. Studio-grade sound tuned by AYAH acoustics engineers.',
    images: ['/products/pulse-1.jpg', '/products/pulse-2.jpg'],
    specs: [
      { k: 'Driver', v: '40 mm dynamic' },
      { k: 'Noise cancelling', v: 'Hybrid ANC, -42 dB' },
      { k: 'Battery life', v: 'Up to 60 hours' },
      { k: 'Bluetooth', v: '5.3 multipoint' },
      { k: 'Weight', v: '268 g' },
      { k: 'Charging', v: 'USB-C fast charge' }
    ],
    featured: true,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'nova-pro-5g',
    name: 'NOVA Pro 5G Smartphone',
    brand: 'AYAH Mobile',
    category: 'phones',
    price: 899,
    oldPrice: null,
    description:
      'A titanium-frame flagship with a 6.7" 120 Hz LTPO display, triple 50 MP camera system and all-day 5000 mAh battery. Built for creators who refuse to compromise.',
    images: ['/products/nova.jpg'],
    specs: [
      { k: 'Display', v: '6.7" LTPO AMOLED 120 Hz' },
      { k: 'Camera', v: '50 MP triple + 12 MP front' },
      { k: 'Battery', v: '5000 mAh, 65 W fast charge' },
      { k: 'Chipset', v: 'Octa-core 4 nm' },
      { k: 'Storage', v: '256 GB' },
      { k: 'Durability', v: 'IP68, titanium frame' }
    ],
    featured: true,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'vista-smartwatch-s',
    name: 'VISTA Smartwatch S',
    brand: 'AYAH Wear',
    category: 'wearables',
    price: 199,
    oldPrice: 229,
    description:
      'Your health companion on the wrist — always-on AMOLED display, dual-band GPS, heart-rate and SpO2 tracking, and 14 days of battery on a single charge.',
    images: ['/products/vista.jpg'],
    specs: [
      { k: 'Display', v: '1.43" AMOLED always-on' },
      { k: 'Battery', v: 'Up to 14 days' },
      { k: 'GPS', v: 'Dual-band' },
      { k: 'Sensors', v: 'HR, SpO2, sleep, stress' },
      { k: 'Water resistance', v: '5 ATM' },
      { k: 'Strap', v: 'Quick-release fluoroelastomer' }
    ],
    featured: true,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'vertex-14-laptop',
    name: 'VERTEX 14 Ultrabook',
    brand: 'AYAH Compute',
    category: 'laptops',
    price: 1299,
    oldPrice: null,
    description:
      'Feather-light 1.2 kg aluminum unibody with a 14" 2.8K display, 18-hour battery and silent vapor-cool performance. The ultimate machine for work anywhere.',
    images: ['/products/vertex.jpg'],
    specs: [
      { k: 'Display', v: '14" 2.8K 120 Hz' },
      { k: 'Processor', v: 'Latest gen 8-core' },
      { k: 'Memory', v: '16 GB LPDDR5' },
      { k: 'Storage', v: '1 TB NVMe SSD' },
      { k: 'Battery', v: 'Up to 18 hours' },
      { k: 'Weight', v: '1.2 kg' }
    ],
    featured: true,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 11
  },
  {
    id: 'drift-buds',
    name: 'DRIFT Buds',
    brand: 'AYAH Audio',
    category: 'audio',
    price: 59,
    oldPrice: null,
    description:
      'Compact true-wireless earbuds with rich, punchy sound, crystal-clear calls and pocket-sized charging case. Your everyday soundtrack, untangled.',
    images: ['/products/drift.jpg'],
    specs: [
      { k: 'Driver', v: '11 mm' },
      { k: 'Battery', v: '7 h + 24 h case' },
      { k: 'Bluetooth', v: '5.3' },
      { k: 'Water resistance', v: 'IPX5' },
      { k: 'Charging', v: 'USB-C' }
    ],
    featured: false,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 14
  },
  {
    id: 'arc-sport-buds',
    name: 'ARC Sport Buds',
    brand: 'AYAH Audio',
    category: 'audio',
    price: 79,
    oldPrice: 99,
    description:
      'Secure over-ear hooks, energizing sound and IPX7 sweat proofing — engineered to never fall out mid-workout. Push harder, hear everything.',
    images: ['/products/arc.jpg'],
    specs: [
      { k: 'Driver', v: '13 mm' },
      { k: 'Battery', v: '9 h + 21 h case' },
      { k: 'Water resistance', v: 'IPX7' },
      { k: 'Fit', v: 'Flexible ear hooks' },
      { k: 'Extras', v: 'Low-latency sport mode' }
    ],
    featured: false,
    inStock: true,
    lowStock: true,
    createdAt: Date.now() - 86400000 * 16
  },
  {
    id: 'hive-rgb-keyboard',
    name: 'HIVE RGB Mechanical Keyboard',
    brand: 'AYAH Play',
    category: 'gaming',
    price: 89,
    oldPrice: null,
    description:
      'Hot-swappable mechanical switches, per-key RGB and a gasket-mounted design for a typing feel that is as addictive as your favorite game.',
    images: ['/products/hive.jpg'],
    specs: [
      { k: 'Switches', v: 'Hot-swappable red' },
      { k: 'Lighting', v: 'Per-key RGB' },
      { k: 'Layout', v: 'Full-size 104 keys' },
      { k: 'Connection', v: 'Wired USB-C' },
      { k: 'Polling rate', v: '1000 Hz' }
    ],
    featured: false,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 19
  },
  {
    id: 'glide-ergo-mouse',
    name: 'GLIDE Ergo Mouse',
    brand: 'AYAH Play',
    category: 'accessories',
    price: 49,
    oldPrice: null,
    description:
      'Sculpted for marathon sessions — silent clicks, 4000 DPI precision sensor and a magnetic thumb rest that keeps your wrist in a neutral pose.',
    images: ['/products/glide.jpg'],
    specs: [
      { k: 'Sensor', v: '4000 DPI optical' },
      { k: 'Buttons', v: '6 programmable' },
      { k: 'Battery', v: '70 days per charge' },
      { k: 'Connection', v: '2.4 GHz + Bluetooth' }
    ],
    featured: false,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 22
  },
  {
    id: 'boom-360-speaker',
    name: 'BOOM 360 Speaker',
    brand: 'AYAH Audio',
    category: 'audio',
    price: 69,
    oldPrice: 89,
    description:
      'Room-filling 360° sound in a palm-sized fabric-wrapped cylinder. IP67 waterproof, 20-hour battery and a machined aluminum top plate.',
    images: ['/products/boom.jpg'],
    specs: [
      { k: 'Output', v: '20 W 360°' },
      { k: 'Battery', v: 'Up to 20 hours' },
      { k: 'Water resistance', v: 'IP67' },
      { k: 'Bluetooth', v: '5.3, stereo pairing' }
    ],
    featured: false,
    inStock: true,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 25
  },
  {
    id: 'volt-20k-power-bank',
    name: 'VOLT 20K Power Bank',
    brand: 'AYAH Power',
    category: 'power',
    price: 39,
    oldPrice: null,
    description:
      '20,000 mAh of pocket electricity with 30 W USB-C PD — fast enough to charge a laptop, rugged enough for every adventure. Built-in cables included.',
    images: ['/products/volt.jpg'],
    specs: [
      { k: 'Capacity', v: '20,000 mAh' },
      { k: 'Output', v: '30 W USB-C PD' },
      { k: 'Ports', v: '2× USB-C, 1× USB-A' },
      { k: 'Extras', v: 'Built-in cables' }
    ],
    featured: false,
    inStock: true,
    lowStock: true,
    createdAt: Date.now() - 86400000 * 28
  },
  {
    id: 'horizon-27-monitor',
    name: 'HORIZON 27" 4K Monitor',
    brand: 'AYAH Vision',
    category: 'displays',
    price: 349,
    oldPrice: null,
    description:
      'A 27-inch 4K IPS canvas with 99% sRGB, factory-calibrated color and a 75 Hz refresh — pixel-perfect for creators and spreadsheets alike.',
    images: ['/products/horizon.jpg'],
    specs: [
      { k: 'Panel', v: '27" IPS 4K UHD' },
      { k: 'Color', v: '99% sRGB' },
      { k: 'Refresh rate', v: '75 Hz' },
      { k: 'Ports', v: 'HDMI, DisplayPort, USB-C 65 W' },
      { k: 'Ergonomics', v: 'Height / tilt / pivot' }
    ],
    featured: false,
    inStock: false,
    lowStock: false,
    createdAt: Date.now() - 86400000 * 31
  }
]

const defaultSettings = {
  whatsappNumber: '15551234567',
  currency: '$',
  adminPasscode: DEMO_PASSCODE,
  storeName: 'AYAH',
  tagline: 'Premium tech, delivered to your door.'
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ---------- persisted data ----------
      products: SEED_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      settings: defaultSettings,

      // ---------- session ----------
      theme: 'dark',
      favorites: [],
      recentlyViewed: [],
      adminAuthed: false,
      toasts: [],
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      installEvent: null,
      setInstallEvent: (e) => set({ installEvent: e }),
      filters: { categories: [], maxPrice: null, minPrice: null, inStockOnly: false, featuredOnly: false },
      sort: 'featured',
      searchQuery: '',
      refreshing: false,

      // ---------- theme ----------
      setTheme: (theme) => set({ theme }),

      // ---------- products ----------
      addProduct: (product) => {
        const p = { ...product, id: product.id || `p-${Date.now()}` }
        set((s) => ({ products: [p, ...s.products] }))
        get().toast('Product added', '✅')
        return p
      },
      updateProduct: (id, patch) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      toggleProductFlag: (id, flag) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, [flag]: !p[flag] } : p)) })),
      resetDemo: () => {
        set({ products: SEED_PRODUCTS, categories: DEFAULT_CATEGORIES })
        get().toast('Demo data restored', '♻️')
      },
      importData: (data) => {
        if (!data || !Array.isArray(data.products)) return false
        set((s) => ({
          products: data.products,
          categories: Array.isArray(data.categories) && data.categories.length ? data.categories : s.categories,
          settings: { ...s.settings, ...(data.settings || {}) }
        }))
        get().toast('Data imported', '📥')
        return true
      },

      // ---------- categories ----------
      addCategory: (name, emoji = '📦') => {
        const slug = String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`
        if (get().categories.some((c) => c.slug === slug)) {
          get().toast('Category already exists', '⚠️')
          return false
        }
        set((s) => ({ categories: [...s.categories, { slug, name: String(name).trim(), emoji }] }))
        get().toast('Category added', '✅')
        return true
      },
      renameCategory: (slug, name) =>
        set((s) => ({ categories: s.categories.map((c) => (c.slug === slug ? { ...c, name } : c)) })),
      deleteCategory: (slug) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.slug !== slug),
          products: s.products.map((p) => (p.category === slug ? { ...p, category: null } : p))
        }))
        get().toast('Category removed — its products are now uncategorized', '🗑️')
      },

      // ---------- favorites ----------
      toggleFavorite: (id) => {
        const { favorites } = get()
        const has = favorites.includes(id)
        set({ favorites: has ? favorites.filter((f) => f !== id) : [id, ...favorites] })
        get().toast(has ? 'Removed from favorites' : 'Saved to favorites', has ? '💔' : '❤️')
        if (!has && navigator.vibrate) navigator.vibrate(12)
      },

      // ---------- recently viewed ----------
      pushRecent: (id) =>
        set((s) => ({ recentlyViewed: [{ id, ts: Date.now() }, ...s.recentlyViewed.filter((r) => r.id !== id)].slice(0, RECENT_MAX) })),
      clearRecent: () => set({ recentlyViewed: [] }),

      // ---------- admin ----------
      login: (passcode) => {
        if (passcode === get().settings.adminPasscode) {
          set({ adminAuthed: true })
          get().toast('Welcome back, boss', '👋')
          return true
        }
        return false
      },
      logout: () => set({ adminAuthed: false }),
      changePasscode: (next) => set((s) => ({ settings: { ...s.settings, adminPasscode: next } })),

      // ---------- settings ----------
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      // ---------- ui ----------
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: { categories: [], maxPrice: null, minPrice: null, inStockOnly: false, featuredOnly: false } }),
      setSort: (sort) => set({ sort }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setOnline: (online) => set({ online }),
      setRefreshing: (v) => set({ refreshing: v }),

      // ---------- toasts ----------
      toast: (message, emoji = '✨') => {
        const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        set((s) => ({ toasts: [...s.toasts, { id, message, emoji }].slice(-3) }))
        setTimeout(() => get().dismissToast(id), 2400)
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }),
    {
      name: 'ayah-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        products: s.products,
        categories: s.categories,
        settings: s.settings,
        theme: s.theme,
        favorites: s.favorites,
        recentlyViewed: s.recentlyViewed
      })
    }
  )
)

export const productById = (id) => useStore.getState().products.find((p) => p.id === id)
export const categoryBySlug = (slug) => useStore.getState().categories.find((c) => c.slug === slug)
export const categoryName = (slug) => (slug ? categoryBySlug(slug)?.name || 'Uncategorized' : 'Uncategorized')
