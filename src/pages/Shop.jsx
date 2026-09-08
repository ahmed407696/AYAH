import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Check } from 'lucide-react'
import { useStore } from '../store/app'
import { sortProducts, searchProducts, filterProducts } from '../lib/smart'
import ProductCard from '../components/ProductCard'
import SheetModal from '../components/SheetModal'
import EmptyState from '../components/EmptyState'
import PullToRefresh from '../components/PullToRefresh'
import { ProductCardSkeleton } from '../components/Skeleton'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'name', label: 'A–Z' }
]

const PRICE_BANDS = [
  { label: 'Under $50', max: 50 },
  { label: 'Under $100', max: 100 },
  { label: 'Under $250', max: 250 },
  { label: 'Under $500', max: 500 },
  { label: 'Under $1500', max: 1500 }
]

export default function Shop() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const filters = useStore((s) => s.filters)
  const setFilters = useStore((s) => s.setFilters)
  const resetFilters = useStore((s) => s.resetFilters)
  const sort = useStore((s) => s.sort)
  const setSort = useStore((s) => s.setSort)
  const query = useStore((s) => s.searchQuery)
  const setQuery = useStore((s) => s.setSearchQuery)
  const toast = useStore((s) => s.toast)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 380)
    return () => clearTimeout(t)
  }, [query, sort, filters])

  const results = useMemo(() => {
    return sortProducts(filterProducts(searchProducts(products, query), filters), sort)
  }, [products, query, sort, filters])

  const activeFilterCount =
    (filters.categories.length ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0)

  const maxCatalogPrice = Math.max(100, ...products.map((p) => Number(p.price) || 0))

  return (
    <PullToRefresh onRefresh={() => toast('Catalog is up to date', '⚡')}>
      <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-2xl font-bold">Shop</h1>
        <p className="mt-0.5 text-xs font-medium text-night-600/70 dark:text-white/45">
          {products.length} products · updated live from the AYAH catalog
        </p>
      </div>

      {/* search + filters */}
      <div className="sticky top-0 z-30 mt-4 bg-paper/85 px-5 py-2.5 backdrop-blur-xl dark:bg-night-950/85">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-night-600/50 dark:text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, specs…"
              className="w-full rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-night-850 py-3 pl-10 pr-9 text-sm outline-none placeholder:text-night-600/40 dark:placeholder:text-white/30 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-night-600/50 dark:text-white/40" aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className={`relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border transition active:scale-95 ${
              activeFilterCount
                ? 'border-transparent bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-sm'
                : 'border-black/5 dark:border-white/10 bg-white dark:bg-night-850 text-night-700 dark:text-white/80'
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* sort chips */}
        <div className="scroll-x flex gap-2 pt-2.5 pb-0.5">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                sort === s.id
                  ? 'bg-night-900 text-white dark:bg-white dark:text-night-900 shadow'
                  : 'border border-black/5 dark:border-white/10 bg-white dark:bg-night-850 text-night-600 dark:text-white/55'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-2">
        {results.length > 0 && (
          <p className="pb-3 text-[0.68rem] font-semibold uppercase tracking-wider text-night-600/50 dark:text-white/35">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3.5">
          {loading
            ? [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
            : results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {!loading && results.length === 0 && (
          <EmptyState
            emoji="🔎"
            title="Nothing found"
            subtitle="Try a different search term or clear the active filters."
            action={
              <button
                onClick={() => {
                  setQuery('')
                  resetFilters()
                }}
                className="rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-glow"
              >
                Clear everything
              </button>
            }
          />
        )}
      </div>

      <div className="h-6" />

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        categories={categories}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        maxCatalogPrice={maxCatalogPrice}
      />
    </PullToRefresh>
  )
}

function FilterSheet({ open, onClose, categories, filters, setFilters, resetFilters, maxCatalogPrice }) {
  const toggleCat = (slug) => {
    const has = filters.categories.includes(slug)
    setFilters({ categories: has ? filters.categories.filter((c) => c !== slug) : [...filters.categories, slug] })
  }
  const productCount = useStore((s) => s.products.length)

  return (
    <AnimatePresence>
      {open && (
        <SheetModal open={open} onClose={onClose} title="Filters">
          <div className="space-y-6 pb-4">
            <div>
              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = filters.categories.includes(c.slug)
                  return (
                    <button
                      key={c.slug}
                      onClick={() => toggleCat(c.slug)}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                        active
                          ? 'border-transparent bg-brand-500 text-white shadow-glow-sm'
                          : 'border-black/10 dark:border-white/10 bg-white dark:bg-night-850 text-night-700 dark:text-white/70'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      {c.name}
                      {active && <Check size={12} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Max price</h4>
              <input
                type="range"
                min={10}
                max={maxCatalogPrice}
                step={5}
                value={filters.maxPrice ?? maxCatalogPrice}
                onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs font-semibold text-night-600/70 dark:text-white/50">
                <span>$10</span>
                <span className="rounded-full bg-brand-500/10 px-2.5 py-1 font-bold text-brand-500 dark:text-brand-400">
                  up to ${filters.maxPrice ?? maxCatalogPrice}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {PRICE_BANDS.filter((b) => b.max <= maxCatalogPrice).map((b) => (
                  <button
                    key={b.max}
                    onClick={() => setFilters({ maxPrice: filters.maxPrice === b.max ? null : b.max })}
                    className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold transition active:scale-95 ${
                      filters.maxPrice === b.max
                        ? 'bg-brand-500 text-white'
                        : 'border border-black/10 dark:border-white/10 text-night-600 dark:text-white/55'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <Toggle
                label="In stock only"
                checked={filters.inStockOnly}
                onChange={(v) => setFilters({ inStockOnly: v })}
              />
              <Toggle
                label="Featured only"
                checked={filters.featuredOnly}
                onChange={(v) => setFilters({ featuredOnly: v })}
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={resetFilters}
                className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 py-3 text-sm font-semibold text-night-700 dark:text-white/75 active:scale-95 transition-transform"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-[1.6] rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 text-sm font-bold text-white shadow-glow active:scale-95 transition-transform"
              >
                Show results
              </button>
            </div>
            <p className="text-center text-[0.65rem] text-night-600/40 dark:text-white/30">{productCount} products in catalog</p>
          </div>
        </SheetModal>
      )}
    </AnimatePresence>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 px-4 py-3.5">
      <span className="text-sm font-semibold">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-night-300 dark:bg-night-600'}`}>
        <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </span>
    </button>
  )
}
