import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ShieldCheck, LogOut, Plus, Package, Layers, Settings, Download, Upload,
  RotateCcw, HelpCircle, Search, Star, PackageCheck, PackageX, Pencil, Trash2,
  Heart, AlertTriangle, ChevronDown, Store
} from 'lucide-react'
import { useStore } from '../store/app'
import AyahLogo from '../components/AyahLogo'
import ConfirmDialog from '../components/ConfirmDialog'
import { formatPrice } from '../lib/format'
import { DEMO_PASSCODE } from '../lib/constants'

export default function Admin() {
  const adminAuthed = useStore((s) => s.adminAuthed)
  return adminAuthed ? <Dashboard /> : <Login />
}

/* ---------------- LOGIN ---------------- */
function Login() {
  const login = useStore((s) => s.login)
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)

  const submit = (e) => {
    e?.preventDefault()
    if (!login(code.trim())) {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-brand-500 via-brand-600 to-aqua-600 shadow-glow">
            <img src="icons/pwa-192.png" alt="AYAH" className="h-14 w-14 rounded-xl" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-sm text-night-600/70 dark:text-white/50">Enter your passcode to manage the AYAH catalog.</p>
        </div>

        <form onSubmit={submit} className="mt-7">
          <motion.div animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}} className="relative">
            <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-600/50 dark:text-white/35" />
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Passcode"
              autoFocus
              className={`w-full rounded-2xl border bg-white dark:bg-night-850 py-4 pl-11 pr-12 text-sm font-semibold tracking-widest outline-none transition ${
                error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-black/10 dark:border-white/10 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-500" tabIndex={-1}>
              {show ? 'HIDE' : 'SHOW'}
            </button>
          </motion.div>
          {error && <p className="mt-2 text-center text-xs font-semibold text-rose-500">Incorrect passcode — try again</p>}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-4 text-sm font-bold text-white shadow-glow"
          >
            Unlock dashboard
          </motion.button>
        </form>

        <div className="mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-center">
          <p className="text-[0.7rem] leading-relaxed text-night-700 dark:text-amber-200/90">
            Demo passcode: <b className="font-mono text-sm">{DEMO_PASSCODE}</b> — change it after first login.
          </p>
        </div>

        <button onClick={() => navigate('/')} className="mt-5 w-full text-center text-xs font-semibold text-night-600/60 dark:text-white/40">
          ← Back to store
        </button>
      </motion.div>
    </div>
  )
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const favorites = useStore((s) => s.favorites)
  const logout = useStore((s) => s.logout)
  const currency = useStore((s) => s.settings.currency)
  const resetDemo = useStore((s) => s.resetDemo)
  const importData = useStore((s) => s.importData)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const toggleProductFlag = useStore((s) => s.toggleProductFlag)
  const toast = useStore((s) => s.toast)

  const [manageOpen, setManageOpen] = useState(false)
  const [q, setQ] = useState('')
  const [confirm, setConfirm] = useState(null) // {title, message, action}
  const fileRef = useRef(null)

  const stats = useMemo(
    () => ({
      total: products.length,
      featured: products.filter((p) => p.featured).length,
      out: products.filter((p) => p.inStock === false).length,
      low: products.filter((p) => p.lowStock && p.inStock !== false).length,
      value: products.reduce((a, p) => a + (Number(p.price) || 0), 0)
    }),
    [products]
  )

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return products
    return products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query))
  }, [products, q])

  const exportData = () => {
    const data = JSON.stringify({ products, categories, settings: useStore.getState().settings, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ayah-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup downloaded', '💾')
  }

  const importFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data.products)) throw new Error('bad file')
        setConfirm({
          title: 'Import data?',
          message: `This replaces your current catalog with ${data.products.length} products from the backup file.`,
          confirmLabel: 'Import',
          destructive: false,
          action: () => importData(data)
        })
      } catch {
        toast('Invalid backup file', '⚠️')
      }
    }
    reader.readAsText(file)
  }

  const COMMANDS = [
    { icon: Plus, title: 'Add product', desc: 'Create a new listing', accent: 'from-brand-500 to-brand-700', onClick: () => navigate('/admin/new'), primary: true },
    { icon: Package, title: 'Manage products', desc: 'Edit, feature, stock, delete', accent: 'from-sky-500 to-blue-600', onClick: () => setManageOpen((v) => !v) },
    { icon: Layers, title: 'Categories', desc: 'Add, rename, remove', accent: 'from-violet-500 to-purple-600', onClick: () => navigate('/admin/categories') },
    { icon: Settings, title: 'Store settings', desc: 'WhatsApp number, currency, PIN', accent: 'from-slate-500 to-slate-700', onClick: () => navigate('/admin/settings') },
    { icon: Download, title: 'Export backup', desc: 'Download catalog as JSON', accent: 'from-emerald-500 to-green-600', onClick: exportData },
    { icon: Upload, title: 'Import backup', desc: 'Restore from a JSON file', accent: 'from-teal-500 to-cyan-600', onClick: () => fileRef.current?.click() },
    { icon: RotateCcw, title: 'Reset demo data', desc: 'Restore the starter catalog', accent: 'from-amber-500 to-orange-600', onClick: () => setConfirm({ title: 'Reset demo data?', message: 'All your products and categories will be replaced with the original demo set.', confirmLabel: 'Reset', action: resetDemo }) },
    { icon: HelpCircle, title: 'Setup guide', desc: 'Install & ordering tips', accent: 'from-fuchsia-500 to-pink-600', onClick: () => navigate('/help') }
  ]

  return (
    <div className="px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={importFile} className="hidden" />

      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-aqua-600 shadow-glow-sm">
            <ShieldCheck size={21} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">Command Center</h1>
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">Admin · signed in</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-night-600 dark:text-white/60 active:scale-95 transition-transform"
        >
          <LogOut size={13} /> Log out
        </button>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard icon={Package} label="Total products" value={stats.total} sub={`${categories.length} categories`} />
        <StatCard icon={Star} label="Featured" value={stats.featured} sub={`${stats.out} out of stock`} amber />
        <StatCard icon={Heart} label="Customer favorites" value={favorites.length} sub="saved on this device" rose />
        <StatCard icon={Store} label="Catalog value" value={formatPrice(stats.value, currency)} sub={`${stats.low} low stock`} />
      </div>

      {(stats.out > 0 || stats.low > 0) && (
        <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle size={16} className="shrink-0 text-amber-500" />
          <p className="text-xs font-medium leading-relaxed text-night-700 dark:text-amber-100/80">
            {stats.out > 0 && <><b>{stats.out} product{stats.out > 1 ? 's' : ''} out of stock</b>{stats.low > 0 ? ' · ' : ''}</>}
            {stats.low > 0 && <><b>{stats.low} low on stock</b></>} — restock or mark featured to push sales.
          </p>
        </div>
      )}

      {/* commands */}
      <h2 className="mt-7 font-display text-base font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">All commands</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {COMMANDS.map((c, i) => (
          <motion.button
            key={c.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={c.onClick}
            className={`rounded-3xl border p-4 text-left shadow-card dark:shadow-card-dark transition ${
              c.primary
                ? 'col-span-2 flex items-center gap-4 border-transparent bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-glow'
                : 'border-black/5 dark:border-white/5 bg-white dark:bg-night-850'
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow-sm`}>
              <c.icon size={18} />
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-bold ${c.primary ? 'text-base' : ''}`}>{c.title}</span>
              <span className={`block text-[0.7rem] ${c.primary ? 'text-white/75' : 'text-night-600/60 dark:text-white/40'}`}>{c.desc}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* manage products */}
      <AnimatePresence initial={false}>
        {manageOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-7 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Manage products</h2>
              <button onClick={() => setManageOpen(false)} className="flex items-center gap-1 text-xs font-semibold text-night-600/60 dark:text-white/40">
                Hide <ChevronDown size={13} className="rotate-180" />
              </button>
            </div>
            <div className="relative mt-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-night-600/50 dark:text-white/35" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search your products…"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-night-850 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500/60"
              />
            </div>
            <div className="mt-3 space-y-2.5">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-2.5 shadow-sm">
                  <img src={p.images?.[0] || 'products/placeholder.jpg'} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8rem] font-bold">{p.name}</p>
                    <p className="text-xs font-semibold text-brand-500 dark:text-brand-400">{formatPrice(p.price, currency)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconToggle
                      active={p.featured}
                      activeClass="text-amber-400"
                      onClick={() => toggleProductFlag(p.id, 'featured')}
                      title="Toggle featured"
                    >
                      <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                    </IconToggle>
                    <IconToggle
                      active={p.inStock !== false}
                      activeClass="text-emerald-500"
                      onClick={() => toggleProductFlag(p.id, 'inStock')}
                      title="Toggle stock"
                    >
                      {p.inStock !== false ? <PackageCheck size={16} /> : <PackageX size={16} />}
                    </IconToggle>
                    <IconToggle onClick={() => navigate(`/admin/edit/${p.id}`)} title="Edit">
                      <Pencil size={15} />
                    </IconToggle>
                    <IconToggle
                      danger
                      onClick={() =>
                        setConfirm({
                          title: 'Delete product?',
                          message: `“${p.name}” will be permanently removed from the catalog.`,
                          confirmLabel: 'Delete',
                          action: () => {
                            deleteProduct(p.id)
                            toast('Product deleted', '🗑️')
                          }
                        })
                      }
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </IconToggle>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="py-6 text-center text-sm text-night-600/60 dark:text-white/40">No products match “{q}”.</p>}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        destructive={confirm?.destructive !== false}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.action?.()
          setConfirm(null)
        }}
      />
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, amber, rose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-4 shadow-card dark:shadow-card-dark"
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${amber ? 'bg-amber-500/15 text-amber-500' : rose ? 'bg-rose-500/15 text-rose-500' : 'bg-brand-500/15 text-brand-500'}`}>
        <Icon size={16} />
      </div>
      <p className="mt-2.5 truncate font-display text-xl font-bold">{value}</p>
      <p className="text-[0.62rem] font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">{label}</p>
      {sub && <p className="text-[0.65rem] text-night-600/50 dark:text-white/30">{sub}</p>}
    </motion.div>
  )
}

function IconToggle({ children, active = false, activeClass = 'text-brand-500', danger, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-8 w-8 items-center justify-center rounded-xl transition active:scale-90 ${
        active ? activeClass : danger ? 'text-rose-400' : 'text-night-600/50 dark:text-white/35'
      } ${danger ? 'hover:bg-rose-500/10' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
    >
      {children}
    </button>
  )
}
