import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, KeyRound, Save } from 'lucide-react'
import { useStore } from '../store/app'

const CURRENCIES = ['$', '€', '£', '₦', 'R$', '₹', '₺', '₩', 'AED ', 'SAR ', 'EGP ', 'MAD ', 'KSh ', 'TZS ', 'UGX ', 'ZAR ', 'GHS ', 'DZD ', 'TND ', 'IQD ', 'JOD ', 'PKR ']

export default function AdminSettings() {
  const navigate = useNavigate()
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const changePasscode = useStore((s) => s.changePasscode)
  const toast = useStore((s) => s.toast)

  const [wa, setWa] = useState(settings.whatsappNumber)
  const [currency, setCurrency] = useState(settings.currency)
  const [tagline, setTagline] = useState(settings.tagline)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm2, setConfirm2] = useState('')

  const saveStore = () => {
    const clean = wa.replace(/[^0-9]/g, '')
    if (clean.length < 8) {
      toast('WhatsApp number looks too short (country code + number)', '⚠️')
      return
    }
    updateSettings({ whatsappNumber: clean, currency, tagline: tagline.trim() })
    toast('Store settings saved', '✅')
  }

  const savePasscode = () => {
    if (current !== settings.adminPasscode) {
      toast('Current passcode is incorrect', '⚠️')
      return
    }
    if (next.trim().length < 4) {
      toast('New passcode must be at least 4 characters', '⚠️')
      return
    }
    if (next !== confirm2) {
      toast('New passcodes do not match', '⚠️')
      return
    }
    changePasscode(next.trim())
    setCurrent('')
    setNext('')
    setConfirm2('')
    toast('Passcode updated', '🔐')
  }

  return (
    <div className="px-5 pb-16 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-xl font-bold">Store settings</h1>
      </div>

      <section className="mt-5 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-4 shadow-card dark:shadow-card-dark">
        <h2 className="text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Ordering & WhatsApp</h2>
        <label className="mb-1.5 mt-3 block text-[0.7rem] font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">
          WhatsApp number (with country code, digits only)
        </label>
        <input
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          inputMode="numeric"
          placeholder="15551234567"
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
        />
        <p className="mt-1.5 text-[0.68rem] leading-relaxed text-night-600/50 dark:text-white/35">
          All “Order on WhatsApp” buttons send pre-filled messages to this number. Example: 15551234567 for +1 555 123 4567.
        </p>

        <label className="mb-1.5 mt-4 block text-[0.7rem] font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Currency symbol</label>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition active:scale-95 ${
                currency === c ? 'border-transparent bg-brand-500 text-white shadow-glow-sm' : 'border-black/10 dark:border-white/10 text-night-600 dark:text-white/55'
              }`}
            >
              {c.trim()}
            </button>
          ))}
        </div>

        <label className="mb-1.5 mt-4 block text-[0.7rem] font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">Store tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Premium tech, delivered to your door."
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
        />

        <button
          onClick={saveStore}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-sm font-bold text-white shadow-glow active:scale-95 transition-transform"
        >
          <Save size={16} /> Save store settings
        </button>
      </section>

      <section className="mt-4 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-night-850 p-4 shadow-card dark:shadow-card-dark">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-night-600/60 dark:text-white/40">
          <KeyRound size={14} /> Change admin passcode
        </h2>
        <div className="mt-3 space-y-2.5">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current passcode"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
          />
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="New passcode (min 4 characters)"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
          />
          <input
            type="password"
            value={confirm2}
            onChange={(e) => setConfirm2(e.target.value)}
            placeholder="Repeat new passcode"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-500/60"
          />
        </div>
        <button
          onClick={savePasscode}
          className="mt-4 w-full rounded-2xl border border-brand-500/40 bg-brand-500/10 py-3.5 text-sm font-bold text-brand-600 dark:text-brand-300 active:scale-95 transition-transform"
        >
          Update passcode
        </button>
      </section>
    </div>
  )
}
