import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useStore, categoryName } from '../store/app'
import { formatPrice } from '../lib/format'

function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const currency = useStore((s) => s.settings.currency)
  const fav = favorites.includes(product.id)
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0
  const out = product.inStock === false

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), type: 'spring', stiffness: 260, damping: 26 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="relative cursor-pointer select-none overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 shadow-card dark:shadow-card-dark"
    >
      <div className="relative aspect-square overflow-hidden bg-paper-200/60 dark:bg-night-800">
        <img
          src={product.images?.[0] || '/products/placeholder.jpg'}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className={`h-full w-full object-cover transition-transform duration-500 ${out ? 'opacity-50 saturate-50' : ''}`}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.featured && !out && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-aqua-600 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white shadow-glow-sm">
              <Sparkles size={10} /> Featured
            </span>
          )}
          {discount > 0 && !out && (
            <span className="rounded-full bg-rose-500 px-2 py-1 text-[0.6rem] font-bold text-white shadow">-{discount}%</span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          aria-label="Toggle favorite"
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
            fav ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/75 dark:bg-night-900/70 text-night-600 dark:text-white/70'
          }`}
        >
          <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
        </motion.button>

        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-night-950/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-night-950/80 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">
          {categoryName(product.category)}
        </p>
        <h3 className="mt-0.5 truncate font-display text-sm font-semibold text-night-900 dark:text-white/95">{product.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-night-900 dark:text-white">{formatPrice(product.price, currency)}</span>
          {discount > 0 && (
            <span className="text-[0.7rem] font-medium text-night-600/60 line-through dark:text-white/35">
              {formatPrice(product.oldPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(ProductCard)
