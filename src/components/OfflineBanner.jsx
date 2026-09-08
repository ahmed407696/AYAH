import { AnimatePresence, motion } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useStore } from '../store/app'

export default function OfflineBanner() {
  const online = useStore((s) => s.online)
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed inset-x-0 top-[max(0.5rem,env(safe-area-inset-top))] z-[88] mx-auto flex w-fit items-center gap-2 rounded-full bg-amber-500/95 px-4 py-2 text-xs font-semibold text-night-950 shadow-xl"
        >
          <WifiOff size={14} />
          Offline — browsing saved catalog
        </motion.div>
      )}
    </AnimatePresence>
  )
}
