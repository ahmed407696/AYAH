import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, Heart, ShieldCheck } from 'lucide-react'
import { WhatsAppIcon } from './Icons'
import { useStore } from '../store/app'
import { chatMessage, openWhatsApp } from '../lib/whatsapp'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/shop', icon: LayoutGrid, label: 'Shop' },
  { to: '/favorites', icon: Heart, label: 'Saved' },
  { to: '/admin', icon: ShieldCheck, label: 'Admin' }
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const favorites = useStore((s) => s.favorites)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="relative flex items-center justify-between rounded-[1.75rem] border border-black/5 dark:border-white/10 bg-white/80 dark:bg-night-900/85 px-2 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {tabs.slice(0, 2).map((t) => (
            <NavTab key={t.to} {...t} active={pathname === t.to} onClick={() => navigate(t.to)} />
          ))}

          <div className="relative w-14">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => openWhatsApp(chatMessage())}
              aria-label="Chat on WhatsApp"
              className="absolute -top-9 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-glow ring-4 ring-white dark:ring-night-950"
            >
              <WhatsAppIcon size={26} />
            </motion.button>
          </div>

          {tabs.slice(2).map((t) => (
            <NavTab
              key={t.to}
              {...t}
              active={pathname.startsWith(t.to)}
              badge={t.to === '/favorites' ? favorites.length : 0}
              onClick={() => navigate(t.to)}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

function NavTab({ icon: Icon, label, active, badge = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-[4.5rem] flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[0.6rem] font-semibold uppercase tracking-wider transition-colors ${
        active ? 'text-brand-500 dark:text-brand-400' : 'text-night-600/70 dark:text-white/45'
      }`}
    >
      <span className="relative">
        <Icon size={21} strokeWidth={active ? 2.4 : 2} />
        {badge > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[0.55rem] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      {label}
      {active && (
        <motion.span
          layoutId="nav-dot"
          className="absolute -bottom-0.5 h-1 w-6 rounded-full bg-gradient-to-r from-brand-500 to-aqua-500"
        />
      )}
    </button>
  )
}
