import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useStore } from '../store/app'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { motion } from 'framer-motion'

export default function Favorites() {
  const favorites = useStore((s) => s.favorites)
  const products = useStore((s) => s.products)
  const toggleFavorite = useStore((s) => s.toggleFavorite)

  const items = favorites.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Favorites</h1>
          <p className="mt-0.5 text-xs font-medium text-night-600/70 dark:text-white/45">
            {items.length} saved {items.length === 1 ? 'item' : 'items'} · synced on this device
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => items.forEach((p) => toggleFavorite(p.id))}
            className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-night-600 dark:text-white/60 active:scale-95 transition-transform"
          >
            <Trash2 size={13} /> Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          emoji="💜"
          title="Nothing saved yet"
          subtitle="Tap the heart on any product to keep it here for later."
          action={
            <Link to="/shop" className="inline-block rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-glow">
              Browse the shop
            </Link>
          }
        />
      ) : (
        <motion.div layout className="mt-6 grid grid-cols-2 gap-3.5">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      )}
      <div className="h-8" />
    </div>
  )
}
