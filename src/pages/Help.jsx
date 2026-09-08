import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, WifiOff, Heart, RefreshCw, Share2, ShieldCheck, ChevronRight, Share } from 'lucide-react'
import AyahLogo from '../components/AyahLogo'
import { WhatsAppIcon } from '../components/Icons'
import { chatMessage, openWhatsApp } from '../lib/whatsapp'
import { useStore } from '../store/app'

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

export default function Help() {
  const navigate = useNavigate()
  const installEvent = useStore((s) => s.installEvent)

  const install = async () => {
    if (installEvent) {
      try {
        await installEvent.prompt()
      } catch {}
    }
  }

  return (
    <div className="px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-night-850 border border-black/5 dark:border-white/10" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <AyahLogo size={26} />
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold">Setup & tips</h1>
      <p className="mt-1 text-sm text-night-600/80 dark:text-white/50">Everything you need to get the most out of AYAH.</p>

      {/* install */}
      <Section title="📲 Install on your phone" icon={Download}>
        {isIOS() && !installEvent ? (
          <ol className="list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-night-700 dark:text-white/65">
            <li>Open this page in <b>Safari</b>.</li>
            <li>Tap the <Share size={13} className="inline -mt-0.5" /> <b>Share</b> button in the toolbar.</li>
            <li>Scroll and tap <b>“Add to Home Screen”</b>.</li>
            <li>Tap <b>Add</b> — AYAH now lives on your home screen like a real app.</li>
          </ol>
        ) : installEvent ? (
          <button onClick={install} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-sm font-bold text-white shadow-glow active:scale-95 transition-transform">
            <Download size={17} /> Install AYAH app
          </button>
        ) : (
          <ol className="list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-night-700 dark:text-white/65">
            <li>Open the browser menu (⋮ on Android / Share on iPhone).</li>
            <li>Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>.</li>
            <li>Confirm — done, AYAH opens full-screen from now on.</li>
          </ol>
        )}
      </Section>

      <Section title="🛒 How to order" icon={WhatsAppIcon}>
        <ul className="space-y-1.5 text-sm leading-relaxed text-night-700 dark:text-white/65">
          <li>• Find a product you love and open it.</li>
          <li>• Tap <b>“Order on WhatsApp”</b> — the message is pre-filled with the product name, price and ID.</li>
          <li>• Hit send in WhatsApp and we confirm availability + delivery personally.</li>
          <li>• No payment happens in the app — you pay directly when we arrange delivery.</li>
        </ul>
      </Section>

      <Section title="✨ Power-user tips" icon={Heart}>
        <ul className="space-y-1.5 text-sm leading-relaxed text-night-700 dark:text-white/65">
          <li>• <b>Heart</b> anything to save it to Favorites (works offline too).</li>
          <li>• <b>Pull down</b> on the Home or Shop page to refresh the catalog.</li>
          <li>• <b>Swipe</b> product photos and double-tap to zoom.</li>
          <li>• Use <b>Share → More…</b> to send products to friends with the native share sheet.</li>
          <li>• Check <b>“You may also like”</b> — smart picks based on what you're viewing.</li>
        </ul>
      </Section>

      <Section title="📴 Offline mode" icon={WifiOff}>
        <p className="text-sm leading-relaxed text-night-700 dark:text-white/65">
          AYAH is a full PWA — once installed, the catalog is cached on your phone. If you lose connection you can keep browsing products,
          favorites and recently viewed items. Ordering needs a connection (it opens WhatsApp).
        </p>
      </Section>

      <Section title="📲 Transfer to another phone" icon={RefreshCw}>
        <ol className="list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-night-700 dark:text-white/65">
          <li>On the old phone, open <b>Admin</b> and tap <b>Transfer to another phone</b>.</li>
          <li>Send the downloaded JSON backup to the new phone.</li>
          <li>On the new phone, open <b>Admin</b> and tap <b>Import backup</b> to restore products, categories and store settings.</li>
        </ol>
      </Section>

      <Section title="🔐 Admin" icon={ShieldCheck}>
        <p className="text-sm leading-relaxed text-night-700 dark:text-white/65">
          Manage products, categories and settings from the Admin panel. Default passcode: <code className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 font-bold">ayah2026</code> — change it from the Admin dashboard.
        </p>
        <Link to="/admin" className="mt-3 flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-night-850 px-4 py-3 text-sm font-semibold active:scale-[0.98] transition-transform">
          Open Admin panel <ChevronRight size={15} className="text-brand-500" />
        </Link>
      </Section>

      <button
        onClick={() => openWhatsApp(chatMessage())}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
      >
        <WhatsAppIcon size={19} /> Still need help? Chat with us
      </button>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mt-5 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-night-850 p-5 shadow-card dark:shadow-card-dark">
      <h2 className="mb-2.5 font-display text-base font-bold">{title}</h2>
      {children}
    </div>
  )
}
