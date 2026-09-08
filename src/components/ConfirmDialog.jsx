import { AnimatePresence, motion } from 'framer-motion'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', destructive = true, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl border border-black/5 dark:border-white/10 bg-paper-50 dark:bg-night-850 p-5 text-center shadow-2xl"
          >
            <h3 className="font-display text-lg font-bold">{title}</h3>
            {message && <p className="mt-1.5 text-sm leading-relaxed text-night-600 dark:text-white/55">{message}</p>}
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={onCancel}
                className="flex-1 rounded-2xl bg-black/5 dark:bg-white/10 py-3 text-sm font-semibold text-night-700 dark:text-white/80 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-2xl py-3 text-sm font-semibold text-white shadow-glow-sm active:scale-95 transition-transform ${
                  destructive ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-none' : 'bg-gradient-to-r from-brand-500 to-brand-600'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
