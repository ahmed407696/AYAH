import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useStore } from '../store/app'
import ConfirmDialog from '../components/ConfirmDialog'

export default function AdminCategories() {
  const navigate = useNavigate()
  const categories = useStore((s) => s.categories)
  const products = useStore((s) => s.products)
  const addCategory = useStore((s) => s.addCategory)
  const renameCategory = useStore((s) => s.renameCategory)
  const deleteCategory = useStore((s) => s.deleteCategory)

  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [editingSlug, setEditingSlug] = useState(null)
  const [editName, setEditName] = useState('')
  const [confirm, setConfirm] = useState(null)

  const counts = {}
  products.forEach((p) => {
    if (p.category) counts[p.category] = (counts[p.category] || 0) + 1
  })
  const uncategorized = products.filter((p) => !p.category).length

  const submit = (e) => {
    e?.preventDefault()
    if (!name.trim()) return
    if (addCategory(name.trim(), emoji.trim() || '📦')) {
      setName('')
      setEmoji('')
    }
  }

  return (
    <div className="px-5 pb-16 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Categories</h1>
          <p className="text-xs text-night-600/60 dark:text-white/40">{categories.length} categories · organize your catalog</p>
        </div>
      </div>

      {/* add form */}
      <form onSubmit={submit} className="mt-5 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-4 shadow-card dark:shadow-card-dark">
        <h2 className="text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Add category</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="🙂"
            maxLength={4}
            className="w-14 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2.5 text-center text-lg outline-none focus:border-brand-500/60"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name (e.g. Smart Home)"
            className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
          />
          <motion.button whileTap={{ scale: 0.9 }} type="submit" className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-sm">
            <Plus size={18} />
          </motion.button>
        </div>
      </form>

      {/* list */}
      <div className="mt-4 space-y-2.5">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-3.5 shadow-sm"
          >
            {editingSlug === c.slug ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renameCategory(c.slug, editName.trim() || c.name)
                      setEditingSlug(null)
                    }
                  }}
                  className="flex-1 rounded-xl border border-brand-500/60 bg-transparent px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={() => {
                    renameCategory(c.slug, editName.trim() || c.name)
                    setEditingSlug(null)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-emerald-500 hover:bg-emerald-500/10"
                  aria-label="Save"
                >
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingSlug(null)} className="flex h-8 w-8 items-center justify-center rounded-xl text-night-600/50 dark:text-white/35" aria-label="Cancel">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-xl">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <p className="text-xs text-night-600/50 dark:text-white/35">{counts[c.slug] || 0} products</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlug(c.slug)
                    setEditName(c.name)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-night-600/50 dark:text-white/35 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Rename"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() =>
                    setConfirm({
                      title: `Delete “${c.name}”?`,
                      message: counts[c.slug]
                        ? `${counts[c.slug]} product${counts[c.slug] > 1 ? 's' : ''} will move to “Uncategorized”.`
                        : 'This category is empty and will be removed.',
                      confirmLabel: 'Delete',
                      action: () => deleteCategory(c.slug)
                    })
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-rose-400 hover:bg-rose-500/10"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </motion.div>
        ))}

        {uncategorized > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-3.5 text-night-600/60 dark:text-white/35">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-xl">📦</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-night-600/70 dark:text-white/45">Uncategorized</p>
              <p className="text-xs">{uncategorized} products</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.action?.()
          setConfirm(null)
        }}
      />
    </div>
  )
}
