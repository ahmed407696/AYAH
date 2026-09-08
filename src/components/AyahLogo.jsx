export default function AyahLogo({ size = 26, withWordmark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ayah-g" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6D5DF6" />
            <stop offset="0.55" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d="M16 3.2 28.8 28.8h-5.5L16 13.1 8.7 28.8H3.2L16 3.2Z" fill="url(#ayah-g)" />
        <path d="M16 18.5 20.6 28.8h-9.2L16 18.5Z" fill="url(#ayah-g)" opacity="0.55" />
        <circle cx="16" cy="9" r="1.6" fill="#22D3EE" />
        <circle cx="9.8" cy="22.5" r="1.3" fill="#6D5DF6" />
        <circle cx="22.2" cy="22.5" r="1.3" fill="#8B5CF6" />
      </svg>
      {withWordmark && (
        <span className="font-display font-bold tracking-[0.22em] text-[1.05em] leading-none bg-gradient-to-r from-brand-500 via-brand-400 to-aqua-500 bg-clip-text text-transparent">
          AYAH
        </span>
      )}
    </span>
  )
}
