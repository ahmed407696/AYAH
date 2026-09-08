import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, PackageCheck, PackageX, Share2, Sparkles, Truck } from 'lucide-react'
import { useStore, categoryName } from '../store/app'
import { recommendProducts } from '../lib/smart'
import { formatPrice } from '../lib/format'
import { orderMessage, openWhatsApp } from '../lib/whatsapp'
import ImageCarousel from '../components/ImageCarousel'
import Lightbox from '../components/Lightbox'
import ShareSheet from '../components/ShareSheet'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { WhatsAppIcon } from '../components/Icons'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useStore((s) => s.products.find((p) => p.id === id))
  const products = useStore((s) => s.products)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const pushRecent = useStore((s) => s.pushRecent)
  const currency = useStore((s) => s.settings.currency)
  const [shareOpen, setShareOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (product) pushRecent(product.id)
    window.scrollTo(0, 0)
  }, [id])

  const recommendations = useMemo(
    () => (product ? recommendProducts(products, product, { favorites, viewed: useStore.getState().recentlyViewed, limit: 6 }) : []),
    [product, products, favorites]
  )

  if (!product) {
    return (
      <EmptyState
        emoji="🕵️"
        title="Product not found"
        subtitle="It may have been removed from the catalog."
        action={
          <button onClick={() => navigate('/shop')} className="rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-glow">
            Back to shop
          </button>
        }
      />
    )
  }

  const fav = favorites.includes(product.id)
  const out = product.inStock === false
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className="pb-40">
      {/* top bar */}
      <div className="fixed inset-x-0 top-0 z-40 mx-auto max-w-lg">
        <div className="mx-4 mt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-night-900/85 px-2 py-2 shadow-lg backdrop-blur-xl">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl active:bg-black/5 dark:active:bg-white/10" aria-label="Back">
            <ArrowLeft size={19} />
          </button>
          <p className="truncate px-2 font-display text-sm font-bold">{product.name}</p>
          <div className="flex items-center">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${fav ? 'text-rose-500' : ''}`}
              aria-label="Favorite"
            >
              <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => setShareOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl" aria-label="Share">
              <Share2 size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* gallery */}
      <div className="relative pt-[max(4.25rem,calc(env(safe-area-inset-top)+3.5rem))]">
        {!imgLoaded && <div className="absolute inset-x-0 top-[max(4.25rem,calc(env(safe-area-inset-top)+3.5rem))] aspect-square animate-pulse bg-night-200/70 dark:bg-night-800" />}
        <ImageCarousel images={product.images} alt={product.name} onTapImage={(i) => setLightbox(product.images[i] || product.images[0])} />
        <img src={product.images[0]} onLoad={() => setImgLoaded(true)} className="hidden" alt="" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="px-5">
        {/* chips */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="rounded-full bg-brand-500/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            {categoryName(product.category)}
          </span>
          {product.featured && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-aqua-600 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-white">
              <Sparkles size={11} /> Featured
            </span>
          )}
          {out ? (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-rose-500">
              <PackageX size={12} /> Out of stock
            </span>
          ) : product.lowStock ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-amber-500">
              🔥 Low stock
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-500">
              <PackageCheck size={12} /> In stock
            </span>
          )}
        </div>

        <h1 className="mt-3 font-display text-[1.55rem] font-bold leading-tight">{product.name}</h1>
        {product.brand && <p className="mt-1 text-sm font-medium text-night-600/70 dark:text-white/45">by {product.brand}</p>}

        {/* price */}
        <div className="mt-3.5 flex items-end gap-2.5">
          <span className="font-display text-3xl font-bold text-brand-600 dark:text-brand-300">{formatPrice(product.price, currency)}</span>
          {discount > 0 && (
            <>
              <span className="pb-1 text-sm font-semibold text-night-600/50 line-through dark:text-white/35">{formatPrice(product.oldPrice, currency)}</span>
              <span className="mb-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-bold text-white">SAVE {discount}%</span>
            </>
          )}
        </div>

        {/* description */}
        {product.description && (
          <p className="mt-4 text-[0.9rem] leading-relaxed text-night-700 dark:text-white/65">{product.description}</p>
        )}

        {/* specs */}
        {product.specs?.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 shadow-card dark:shadow-card-dark">
            <div className="border-b border-black/5 dark:border-white/5 px-5 py-3.5">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Specifications</h2>
            </div>
            <dl>
              {product.specs.map((s, i) => (
                <div key={i} className={`flex items-start justify-between gap-4 px-5 py-3 ${i % 2 ? 'bg-black/[0.02] dark:bg-white/[0.03]' : ''}`}>
                  <dt className="text-[0.8rem] font-semibold text-night-600/80 dark:text-white/50">{s.k}</dt>
                  <dd className="text-right text-[0.8rem] font-semibold text-night-900 dark:text-white/90">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* delivery note */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-500/20 bg-brand-50 dark:bg-brand-500/10 px-4 py-3">
          <Truck size={18} className="shrink-0 text-brand-500" />
          <p className="text-xs font-medium leading-relaxed text-night-700 dark:text-white/60">
            To order, tap the WhatsApp button below — your message arrives pre-filled with this item and we confirm delivery personally.
          </p>
        </div>

        {/* recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <h2 className="font-display text-lg font-bold">You may also like</h2>
            </div>
            <p className="mt-0.5 text-xs text-night-600/60 dark:text-white/40">Smart picks based on this product</p>
            <div className="scroll-x mt-3.5 flex gap-3.5 pb-1">
              {recommendations.map((p, i) => (
                <div key={p.id} className="w-40 shrink-0">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </motion.div>

      {/* sticky order bar */}
      <div className="fixed inset-x-0 bottom-[5.5rem] z-40 mx-auto max-w-lg px-5">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 26 }}
          className="flex items-center gap-2.5 rounded-3xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-night-900/90 p-2.5 shadow-2xl backdrop-blur-xl"
        >
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggleFavorite(product.id)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/5 dark:border-white/10 ${
              fav ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' : 'text-night-700 dark:text-white/70'
            }`}
            aria-label="Favorite"
          >
            <Heart size={19} fill={fav ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={out}
            onClick={() => openWhatsApp(orderMessage(product, currency))}
            className={`flex h-12 flex-1 items-center justify-center gap-2.5 rounded-2xl text-sm font-bold text-white transition ${
              out
                ? 'cursor-not-allowed bg-night-600/50 dark:bg-night-700 text-white/50'
                : 'bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-lg shadow-emerald-500/30'
            }`}
          >
            <WhatsAppIcon size={19} />
            {out ? 'Currently unavailable' : 'Order on WhatsApp'}
          </motion.button>
        </motion.div>
      </div>

      <ShareSheet product={product} open={shareOpen} onClose={() => setShareOpen(false)} />
      <Lightbox src={lightbox} alt={product.name} open={!!lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
