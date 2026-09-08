import { useState } from 'react'
import { motion } from 'framer-motion'
import { Expand } from 'lucide-react'

export default function ImageCarousel({ images = [], alt, onTapImage }) {
  const [index, setIndex] = useState(0)
  const imgs = images.length ? images : ['products/placeholder.jpg']

  return (
    <div className="relative overflow-hidden bg-paper-200/50 dark:bg-night-800">
      <motion.div
        className="flex cursor-zoom-in"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 && index < imgs.length - 1) setIndex(index + 1)
          else if (info.offset.x > 60 && index > 0) setIndex(index - 1)
        }}
      >
        {imgs.map((src, i) => (
          <div key={i} className="relative aspect-square w-full shrink-0" onClick={() => onTapImage?.(index)}>
            <img src={src} alt={`${alt} — image ${i + 1}`} draggable={false} className="h-full w-full object-cover" />
          </div>
        ))}
      </motion.div>

      {imgs.length > 1 && (
        <>
          <div className="absolute right-3 top-3 rounded-full bg-night-950/60 px-2.5 py-1 text-[0.65rem] font-semibold text-white backdrop-blur">
            {index + 1}/{imgs.length}
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/45'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-night-950/45 p-2 text-white/90 backdrop-blur">
        <Expand size={13} />
      </div>
    </div>
  )
}
