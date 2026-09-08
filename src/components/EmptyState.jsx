import { motion } from 'framer-motion'

export default function EmptyState({ emoji = '🔍', title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-night-850 border border-black/5 dark:border-white/5 text-4xl shadow-card dark:shadow-card-dark">
        {emoji}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-night-600 dark:text-white/50">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
