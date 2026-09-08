import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Download, Heart, Moon, Sparkles, Sun, MessageCircle, Clock, Trash2 } from 'lucide-react'
import { useStore } from '../store/app'
import PullToRefresh from '../components/PullToRefresh'
import ProductCard from '../components/ProductCard'
import AyahLogo from '../components/AyahLogo'
import { ProductCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { formatPrice } from '../lib/format'

export default function Home() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const favorites = useStore((s) => s.favorites)
  const recentlyViewed = useStore((s) => s.recentlyViewed)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const clearRecent = useStore((s) => s.clearRecent)
  const toast = useStore((s) => s.toast)
  const installEvent = useStore((s) => s.installEvent)
  const currency = useStore((s) => s.settings.currency)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [])

  const featured = useMemo(() => products.filter((p) => p.featured && p.inStock !== false).slice(0, 6), [products])
  const deals = useMemo(() => products.filter((p) => p.oldPrice && p.oldPrice > p.price && p.inStock !== false).slice(0, 4), [products])
  const newest = useMemo(() => [...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4), [products])
  const recent = useMemo(
    () =>
      recentlyViewed
        .map((r) => products.find((p) => p.id === r.id))
        .filter(Boolean)
        .slice(0, 6),
    [recentlyViewed, products]
  )
  const heroProduct = featured[0] || products[0]

  const counts = useMemo(() => {
    const map = {}
    products.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1
    })
    return map
  }, [products])

  return (
    <PullToRefresh onRefresh={() => toast('Catalog is up to date', '⚡')}>
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <AyahLogo size={30} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/favorites')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10 text-night-700 dark:text-white/80 shadow-sm active:scale-90 transition-transform"
            aria-label="Favorites"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              const next = theme === 'dark' ? 'light' : 'dark'
              setTheme(next)
              document.documentElement.classList.toggle('dark', next === 'dark')
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10 text-night-700 dark:text-white/80 shadow-sm active:scale-90 transition-transform"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* hero */}
      <div className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-aqua-600 p-6 pb-7 text-white shadow-glow">
          <div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-aqua-400/30 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }}
          />
          <div className="relative z-10 max-w-[62%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] backdrop-blur">
              <Sparkles size={11} /> New season drop
            </span>
            <h1 className="mt-3 font-display text-[1.7rem] font-bold leading-tight">Tech that feels like the future.</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Curated gadgets, premium gear, zero checkout friction — order in one tap.</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-white px-4.5 px-5 py-2.5 text-sm font-bold text-brand-700 shadow-lg active:scale-95 transition-transform"
            >
              Shop now <ChevronRight size={16} />
            </button>
          </div>
          {heroProduct && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 18 }}
              src={heroProduct.images?.[0] || '/products/placeholder.jpg'}
              alt=""
              className="animate-float absolute -right-3 bottom-4 h-36 w-36 rounded-3xl object-cover shadow-2xl ring-1 ring-white/30"
            />
          )}
        </div>
      </div>

      {/* stats */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 px-5">
        {[
          { value: products.length, label: 'Products' },
          { value: categories.length, label: 'Categories' },
          { value: featured.length, label: 'Featured' }
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 py-3 text-center shadow-sm">
            <p className="font-display text-xl font-bold text-brand-500 dark:text-brand-400">{s.value}</p>
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-night-600/70 dark:text-white/45">{s.label}</p>
          </div>
        ))}
      </div>

      {installEvent && (
        <div className="mt-4 px-5">
          <button
            onClick={async () => {
              try {
                await installEvent.prompt()
              } catch {}
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-brand-500/25 bg-brand-50 dark:bg-brand-500/10 p-3.5 text-left active:scale-[0.98] transition-transform"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow-sm">
              <Download size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">Install AYAH on your phone</span>
              <span className="block text-xs text-night-600 dark:text-white/50">Full-screen app, works offline</span>
            </span>
            <ChevronRight size={16} className="text-brand-500" />
          </button>
        </div>
      )}

      {/* categories */}
      {categories.length > 0 && (
        <section className="mt-7">
          <SectionHeader title="Categories" onSeeAll={() => navigate('/shop')} />
          <div className="scroll-x flex gap-2.5 px-5 pb-1 pt-3">
            {categories.map((c, i) => (
              <motion.button
                key={c.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  useStore.getState().resetFilters()
                  useStore.getState().setFilters({ categories: [c.slug] })
                  navigate('/shop')
                }}
                className="flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-3 shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-[0.65rem] font-semibold text-night-700 dark:text-white/75">{c.name}</span>
                <span className="text-[0.6rem] text-night-600/50 dark:text-white/35">{counts[c.slug] || 0}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* featured rail */}
      <section className="mt-7">
        <SectionHeader title="Featured" accent onSeeAll={() => navigate('/shop')} />
        <div className="scroll-x flex gap-3.5 px-5 pb-1 pt-3">
          {loading
            ? [...Array(3)].map((_, i) => <div key={i} className="w-44 shrink-0"><ProductCardSkeleton /></div>)
            : featured.map((p, i) => (
                <div key={p.id} className="w-44 shrink-0">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
        </div>
      </section>

      {/* deals */}
      {deals.length > 0 && (
        <section className="mt-7">
          <SectionHeader title="🔥 Hot deals" onSeeAll={() => navigate('/shop')} />
          <div className="grid grid-cols-2 gap-3.5 px-5 pt-3">
            {loading ? [...Array(2)].map((_, i) => <ProductCardSkeleton key={i} />) : deals.slice(0, 2).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          <div className="scroll-x flex gap-3.5 px-5 pb-1 pt-3.5">
            {deals.slice(2).map((p, i) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* new arrivals */}
      <section className="mt-7">
        <SectionHeader title="New arrivals" onSeeAll={() => navigate('/shop')} />
        <div className="grid grid-cols-2 gap-3.5 px-5 pt-3">
          {loading ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />) : newest.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* recently viewed */}
      {recent.length > 0 && (
        <section className="mt-7">
          <div className="flex items-center justify-between px-5">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-bold">
              <Clock size={16} className="text-brand-500" /> Recently viewed
            </h2>
            <button onClick={clearRecent} className="flex items-center gap-1 text-xs font-semibold text-night-600/60 dark:text-white/40 active:scale-95">
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <div className="scroll-x flex gap-3 px-5 pb-1 pt-3">
            {recent.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="w-64 shrink-0">
                <div className="flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-2.5 shadow-sm active:scale-[0.98] transition-transform">
                  <img src={p.images?.[0] || '/products/placeholder.jpg'} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs font-bold text-brand-500 dark:text-brand-400">{formatPrice(p.price, currency)}</p>
                  </div>
                  <ChevronRight size={15} className="text-night-600/40 dark:text-white/30" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* help card */}
      <section className="mt-7 px-5">
        <Link to="/help">
          <div className="flex items-center gap-3.5 rounded-3xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-night-900 to-night-850 dark:from-night-850 dark:to-night-800 p-5 text-white shadow-card-dark active:scale-[0.98] transition-transform">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <MessageCircle size={22} className="text-[#25D366]" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-base font-bold">Questions? We're one tap away</span>
              <span className="block text-xs text-white/55">Chat with us on WhatsApp · Setup guide inside</span>
            </span>
            <ChevronRight size={18} className="text-white/40" />
          </div>
        </Link>
      </section>

      {products.length === 0 && (
        <EmptyState
          emoji="📦"
          title="No products yet"
          subtitle="Head to the Admin panel to add your first product and it will appear here instantly."
          action={
            <button onClick={() => navigate('/admin')} className="rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-glow">
              Open Admin
            </button>
          }
        />
      )}

      <footer className="mt-10 pb-4 text-center text-[0.65rem] font-medium text-night-600/50 dark:text-white/30">
        AYAH © 2026 · Premium tech, one tap away
      </footer>
    </PullToRefresh>
  )
}

function SectionHeader({ title, accent = false, onSeeAll }) {
  return (
    <div className="flex items-center justify-between px-5">
      <h2 className={`font-display text-lg font-bold ${accent ? 'bg-gradient-to-r from-brand-500 to-aqua-500 bg-clip-text text-transparent' : ''}`}>{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="flex items-center gap-0.5 text-xs font-semibold text-brand-500 dark:text-brand-400 active:scale-95">
          See all <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}
