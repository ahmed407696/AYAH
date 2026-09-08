import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/app'

export default function Toaster() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full bg-night-900/90 dark:bg-white/95 px-4 py-2.5 text-sm font-medium text-white dark:text-night-900 shadow-xl backdrop-blur-md"
          >
            <span className="text-base leading-none">{t.emoji}</span>
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
