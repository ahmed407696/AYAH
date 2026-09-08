import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useStore } from '../store/app'

/**
 * Mobile-style pull-to-refresh wrapper.
 * Attach at the top of a scrollable page; activates when the window is at scroll 0.
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0)
  const [busy, setBusy] = useState(false)
  const startY = useRef(null)
  const setRefreshing = useStore((s) => s.setRefreshing)

  useEffect(() => {
    const onStart = (e) => {
      if (window.scrollY <= 0 && !busy) startY.current = e.touches[0].clientY
    }
    const onMove = (e) => {
      if (startY.current == null || busy) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0 && window.scrollY <= 0) {
        setPull(Math.min(dy * 0.4, 90))
        if (e.cancelable && dy > 8) e.preventDefault()
      }
    }
    const onEnd = async () => {
      if (startY.current == null) return
      startY.current = null
      if (pull > 56 && !busy) {
        setBusy(true)
        setRefreshing(true)
        setPull(56)
        try {
          await Promise.all([onRefresh?.(), new Promise((r) => setTimeout(r, 750))])
        } finally {
          setBusy(false)
          setRefreshing(false)
          setPull(0)
        }
      } else {
        setPull(0)
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [pull, busy, onRefresh, setRefreshing])

  const ready = pull >= 56

  return (
    <div>
      <div
        className="pointer-events-none flex items-center justify-center overflow-hidden transition-[height] duration-150"
        style={{ height: pull }}
      >
        <motion.div
          animate={{ rotate: busy ? 360 : ready ? 180 : pull * 2 }}
          transition={busy ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { type: 'spring', stiffness: 260, damping: 20 }}
        >
          <RefreshCw size={18} className={ready || busy ? 'text-brand-500' : 'text-night-600/50 dark:text-white/40'} />
        </motion.div>
      </div>
      {children}
      <AnimatePresence>
        {busy && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed left-1/2 top-3 z-[80] -translate-x-1/2 rounded-full bg-night-900/90 dark:bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-white dark:text-night-900 shadow-lg"
          >
            Refreshing catalog…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
