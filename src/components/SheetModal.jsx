import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function SheetModal({ open, onClose, title, children, maxHeight = '82vh' }) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 550) onClose()
        }}
        style={{ maxHeight }}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-lg flex-col rounded-t-[1.75rem] border border-b-0 border-black/5 dark:border-white/10 bg-paper-50 dark:bg-night-900 shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-night-600/20 dark:bg-white/15" />
          {title && <h3 className="pt-2 font-display text-base font-bold">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-night-600 dark:text-white/60"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">{children}</div>
      </motion.div>
    </motion.div>
  )
}
