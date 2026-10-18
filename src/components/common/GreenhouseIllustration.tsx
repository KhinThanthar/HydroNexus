import type { ReactNode } from 'react'

/**
 * Stylised hydroponic greenhouse illustration used wherever the reference
 * design shows a greenhouse photograph (sidebar footer, live-camera preview).
 *
 * It is drawn locally as SVG so the app has zero external image dependencies
 * and can never show a broken image. If a real photo is added later, swap this
 * component for an <img> wrapped in the same fallback container.
 */
export function GreenhouseIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      role="img"
      aria-label="Illustration of a hydroponic greenhouse with plant rows and grow lights"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="gh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dceeff" />
          <stop offset="100%" stopColor="#f3fbf6" />
        </linearGradient>
        <linearGradient id="gh-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9d9ff" />
          <stop offset="100%" stopColor="#8fbdf5" />
        </linearGradient>
        <linearGradient id="gh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef6f0" />
          <stop offset="100%" stopColor="#d7e8dc" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="180" fill="url(#gh-sky)" />
      {/* Sun */}
      <circle cx="268" cy="34" r="16" fill="#ffe6a8" />
      <circle cx="268" cy="34" r="22" fill="#ffe6a8" opacity="0.35" />

      {/* Greenhouse shell */}
      <path d="M28 74 160 22l132 52v96H28Z" fill="#ffffff" opacity="0.75" />
      <path d="M28 74 160 22l132 52" fill="none" stroke="url(#gh-roof)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M160 26v144M96 50v120M224 50v120" stroke="#a8cdf7" strokeWidth="2" opacity="0.7" />
      <rect x="28" y="74" width="264" height="96" fill="none" stroke="#a8cdf7" strokeWidth="2" />

      {/* Floor */}
      <rect x="28" y="132" width="264" height="38" fill="url(#gh-floor)" />

      {/* Hydroponic channels with lettuce rows */}
      {[0, 1, 2].map((row) => {
        const y = 138 + row * 10
        return (
          <g key={row}>
            <rect x="44" y={y} width="232" height="5" rx="2.5" fill="#ffffff" stroke="#cdd8e6" strokeWidth="1" />
            {Array.from({ length: 9 }).map((_, i) => (
              <g key={i}>
                <circle cx={58 + i * 26} cy={y - 3} r="6.5" fill="#3fae6b" />
                <circle cx={55 + i * 26} cy={y - 5} r="4" fill="#63c98a" />
                <circle cx={61 + i * 26} cy={y - 5} r="3.4" fill="#2f9a5b" />
              </g>
            ))}
          </g>
        )
      })}

      {/* Grow lights */}
      {[96, 160, 224].map((x) => (
        <g key={x}>
          <rect x={x - 26} y="88" width="52" height="5" rx="2.5" fill="#1555f5" opacity="0.85" />
          <rect x={x - 20} y="95" width="40" height="10" fill="#ffd977" opacity="0.55" />
        </g>
      ))}

      {/* Sensor pole with signal */}
      <rect x="286" y="96" width="4" height="74" rx="2" fill="#687386" />
      <circle cx="288" cy="92" r="6" fill="#168544" />
      <path d="M280 84a11 11 0 0 1 16 0M275 78a18 18 0 0 1 26 0" fill="none" stroke="#168544" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Wrapper that renders an illustration slot with consistent framing, so the
 * same markup can later host a real photograph without layout changes.
 */
export function MediaSlot({
  children,
  label,
  className = '',
}: {
  children: ReactNode
  label: string
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-canvas ${className}`}
      role="img"
      aria-label={label}
    >
      {children}
    </div>
  )
}
