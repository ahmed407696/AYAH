import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Full-screen image viewer with double-tap zoom and drag-to-dismiss.
 */
export default function Lightbox({ src, alt, open, onClose }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <AnimatePresence>
      {open && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-night-950/97 backdrop-blur-md"
          onClick={() => {
            if (zoomed) setZoomed(false)
            else onClose()
          }}
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close"
          >
            <X size={18} />
          </motion.button>

          <motion.img
            key={src}
            src={src}
            alt={alt}
            drag={zoomed ? true : 'y'}
            dragConstraints={zoomed ? { left: -140, right: 140, top: -220, bottom: 220 } : { top: 0, bottom: 0 }}
            dragElastic={zoomed ? 0.2 : 0.35}
            onDragEnd={(_, info) => {
              if (!zoomed && info.offset.y > 110) onClose()
            }}
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: zoomed ? 2.4 : 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => {
              e.stopPropagation()
              setZoomed((z) => !z)
            }}
            className="max-h-[78vh] max-w-[94vw] rounded-2xl object-contain shadow-2xl"
            draggable={false}
          />

          <p className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-white/50">
            {zoomed ? 'drag to pan · double-tap to zoom out' : 'double-tap to zoom · swipe down to close'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
