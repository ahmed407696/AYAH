import { useState } from 'react'
import { Link2, Share2, Check } from 'lucide-react'
import SheetModal from './SheetModal'
import { WhatsAppIcon } from './Icons'
import { useStore } from '../store/app'
import { formatPrice } from '../lib/format'
import { orderMessage, buildWhatsAppUrl } from '../lib/whatsapp'

export default function ShareSheet({ product, open, onClose }) {
  const currency = useStore((s) => s.settings.currency)
  const toast = useStore((s) => s.toast)
  const [copied, setCopied] = useState(false)
  if (!product) return null

  const url = window.location.href
  const text = orderMessage(product, currency)

  const shareNative = async () => {
    onClose()
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `${product.name} — ${formatPrice(product.price, currency)} at AYAH`, url })
      } catch {}
    } else {
      copy()
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${product.name} — ${url}`)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    toast('Link copied to clipboard', '🔗')
    setTimeout(() => setCopied(false), 1800)
  }

  const openWa = () => {
    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <SheetModal open={open} onClose={onClose} title="Share this product">
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white dark:bg-night-850 p-3 border border-black/5 dark:border-white/5">
        <img src={product.images?.[0] || 'products/placeholder.jpg'} alt="" className="h-12 w-12 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-xs text-night-600 dark:text-white/50">{formatPrice(product.price, currency)}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pb-2">
        <ShareOption onClick={openWa} color="from-[#25D366] to-[#128C7E]" icon={<WhatsAppIcon size={22} />} label="WhatsApp" />
        <ShareOption onClick={copy} color="from-brand-500 to-brand-700" icon={copied ? <Check size={22} /> : <Link2 size={22} />} label={copied ? 'Copied!' : 'Copy link'} />
        <ShareOption onClick={shareNative} color="from-fuchsia-500 to-purple-600" icon={<Share2 size={22} />} label="More…" />
      </div>
    </SheetModal>
  )
}

function ShareOption({ children, onClick, color, icon, label }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center">
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform active:scale-90`}>
        {icon}
      </span>
      <span className="mt-2 text-[0.68rem] font-semibold text-night-600 dark:text-white/60">{label}</span>
    </button>
  )
}
