import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, X, Star, PackageCheck, Flame, ImagePlus, Link2, Check } from 'lucide-react'
import { useStore } from '../store/app'

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1000
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = useStore((s) => s.products.find((p) => p.id === id))
  const categories = useStore((s) => s.categories)
  const addProduct = useStore((s) => s.addProduct)
  const updateProduct = useStore((s) => s.updateProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const toast = useStore((s) => s.toast)

  const isEdit = !!editing
  const [form, setForm] = useState(() => ({
    name: editing?.name || '',
    brand: editing?.brand || 'AYAH',
    category: editing?.category || categories[0]?.slug || null,
    price: editing?.price ?? '',
    oldPrice: editing?.oldPrice ?? '',
    description: editing?.description || '',
    images: editing?.images || [],
    specs: editing?.specs?.length ? editing.specs : [{ k: '', v: '' }],
    featured: editing?.featured ?? false,
    inStock: editing?.inStock ?? true,
    lowStock: editing?.lowStock ?? false
  }))
  const [urlInput, setUrlInput] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)
  const [saving, setSaving] = useState(false)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const addFiles = async (files) => {
    const imgs = []
    for (const f of Array.from(files).slice(0, 5)) {
      if (!f.type.startsWith('image/')) continue
      try {
        imgs.push(await fileToDataUrl(f))
      } catch {}
    }
    if (imgs.length) set({ images: [...form.images, ...imgs].slice(0, 8) })
  }

  const addUrl = () => {
    const u = urlInput.trim()
    if (!u) return
    if (!/^(https?:\/\/|\/|data:image)/.test(u)) {
      toast('URL must start with https:// or /', '⚠️')
      return
    }
    set({ images: [...form.images, u].slice(0, 8) })
    setUrlInput('')
    setShowUrl(false)
  }

  const save = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Enter a valid price'
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast('Please fix the highlighted fields', '⚠️')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || 'AYAH',
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice !== '' && Number(form.oldPrice) > Number(form.price) ? Number(form.oldPrice) : null,
      description: form.description.trim(),
      images: form.images.length ? form.images : ['/products/placeholder.jpg'],
      specs: form.specs.filter((s) => s.k.trim() && s.v.trim()),
      featured: form.featured,
      inStock: form.inStock,
      lowStock: form.lowStock
    }
    setTimeout(() => {
      if (isEdit) {
        updateProduct(editing.id, payload)
        toast('Product updated', '✅')
      } else {
        addProduct(payload)
      }
      navigate('/admin')
    }, 350)
  }

  return (
    <div className="px-5 pb-16 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-xl font-bold">{isEdit ? 'Edit product' : 'Add product'}</h1>
      </div>

      {/* images */}
      <FormSection title="Photos" hint="Up to 8 — first one is the cover">
        <div className="grid grid-cols-4 gap-2">
          {form.images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute left-1 top-1 rounded-md bg-brand-500 px-1.5 py-0.5 text-[0.55rem] font-bold text-white">COVER</span>}
              <button
                onClick={() => set({ images: form.images.filter((_, j) => j !== i) })}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-night-950/70 text-white"
                aria-label="Remove image"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {form.images.length < 8 && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 text-night-600/50 dark:text-white/40 active:scale-95 transition"
              >
                <ImagePlus size={18} />
                <span className="text-[0.55rem] font-bold uppercase">Upload</span>
              </button>
              <button
                onClick={() => setShowUrl(true)}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 text-night-600/50 dark:text-white/40 active:scale-95 transition"
              >
                <Link2 size={18} />
                <span className="text-[0.55rem] font-bold uppercase">URL</span>
              </button>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} className="hidden" />
        {showUrl && (
          <div className="mt-3 flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
              placeholder="https://example.com/photo.jpg"
              autoFocus
              className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-night-900 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
            />
            <button onClick={addUrl} className="rounded-xl bg-brand-500 px-4 text-sm font-bold text-white">Add</button>
          </div>
        )}
      </FormSection>

      {/* basics */}
      <FormSection title="Basics">
        <Field label="Product name *" error={errors.name}>
          <input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Pulse X Wireless Headphones"
            className={inputClass(!!errors.name)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price *">
            <input
              value={form.price}
              onChange={(e) => set({ price: e.target.value })}
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="0"
              className={inputClass(!!errors.price)}
            />
            {errors.price && <p className="mt-1 text-[0.68rem] font-semibold text-rose-500">{errors.price}</p>}
          </Field>
          <Field label="Compare-at price">
            <input
              value={form.oldPrice}
              onChange={(e) => set({ oldPrice: e.target.value })}
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="optional"
              className={inputClass(false)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand">
            <input value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="AYAH" className={inputClass(false)} />
          </Field>
          <Field label="Category">
            <select value={form.category || ''} onChange={(e) => set({ category: e.target.value || null })} className={inputClass(false)}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={4}
            placeholder="What makes this product great? Keep it punchy."
            className={`${inputClass(false)} resize-none leading-relaxed`}
          />
        </Field>
      </FormSection>

      {/* specs */}
      <FormSection title="Specifications" hint="Shown as a tidy table on the product page">
        <div className="space-y-2">
          {form.specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={s.k}
                onChange={(e) => set({ specs: form.specs.map((x, j) => (j === i ? { ...x, k: e.target.value } : x)) })}
                placeholder="Label (e.g. Battery)"
                className={`${inputClass(false)} flex-1`}
              />
              <input
                value={s.v}
                onChange={(e) => set({ specs: form.specs.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)) })}
                placeholder="Value (e.g. 60 hours)"
                className={`${inputClass(false)} flex-1`}
              />
              <button
                onClick={() => set({ specs: form.specs.filter((_, j) => j !== i) })}
                className="flex w-9 shrink-0 items-center justify-center rounded-xl text-rose-400 hover:bg-rose-500/10"
                aria-label="Remove spec"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => set({ specs: [...form.specs, { k: '', v: '' }] })}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/15 dark:border-white/15 py-2.5 text-xs font-bold text-brand-500 dark:text-brand-400 active:scale-[0.98] transition"
        >
          <Plus size={14} /> Add specification
        </button>
      </FormSection>

      {/* flags */}
      <FormSection title="Status">
        <FlagRow
          icon={<Star size={17} />}
          label="Featured product"
          desc="Appears in the Featured section on Home"
          checked={form.featured}
          onChange={(v) => set({ featured: v })}
        />
        <FlagRow
          icon={<PackageCheck size={17} />}
          label="In stock"
          desc="Turn off to show “Out of stock” and hide ordering"
          checked={form.inStock}
          onChange={(v) => set({ inStock: v })}
        />
        <FlagRow
          icon={<Flame size={17} />}
          label="Low stock"
          desc="Shows a “Low stock” badge to create urgency"
          checked={form.lowStock}
          onChange={(v) => set({ lowStock: v })}
        />
      </FormSection>

      {/* actions */}
      <div className="sticky bottom-20 z-30 mt-6 flex gap-2.5">
        <button
          onClick={() => navigate('/admin')}
          className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-paper-50 dark:bg-night-850 py-3.5 text-sm font-semibold text-night-700 dark:text-white/75 active:scale-95 transition-transform"
        >
          Cancel
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={save}
          disabled={saving}
          className="flex-[2] rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-sm font-bold text-white shadow-glow disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish product'}
        </motion.button>
      </div>

      {isEdit && (
        <button
          onClick={() => {
            if (window.confirm(`Delete “${editing.name}” permanently?`)) {
              deleteProduct(editing.id)
              toast('Product deleted', '🗑️')
              navigate('/admin')
            }
          }}
          className="mt-4 w-full rounded-2xl border border-rose-500/30 py-3 text-sm font-semibold text-rose-500 active:scale-95 transition-transform"
        >
          Delete this product
        </button>
      )}
    </div>
  )
}

function FormSection({ title, hint, children }) {
  return (
    <section className="mt-6 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-4 shadow-card dark:shadow-card-dark">
      <h2 className="text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">{title}</h2>
      {hint && <p className="mt-0.5 text-[0.68rem] text-night-600/50 dark:text-white/30">{hint}</p>}
      <div className="mt-3 space-y-3.5">{children}</div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">{label}</label>
      {children}
    </div>
  )
}

function FlagRow({ icon, label, desc, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center gap-3 rounded-2xl border border-black/5 dark:border-white/5 px-4 py-3 text-left active:scale-[0.98] transition-transform">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${checked ? 'bg-brand-500/15 text-brand-500' : 'bg-black/5 dark:bg-white/10 text-night-600/50 dark:text-white/35'}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-[0.68rem] leading-snug text-night-600/60 dark:text-white/40">{desc}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-night-300 dark:bg-night-600'}`}>
        <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </span>
    </button>
  )
}

const inputClass = (error) =>
  `w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm outline-none transition placeholder:text-night-600/35 dark:placeholder:text-white/25 ${
    error ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-black/10 dark:border-white/10 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/15'
  }`
