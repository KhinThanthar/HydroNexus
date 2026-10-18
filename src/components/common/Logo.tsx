import { useState } from 'react'
import logoAsset from '../../assets/hydroneus-logo.png'

interface LogoProps {
  className?: string
}

/**
 * HydroNexus brand mark, cropped from the official logo file
 * (src/assets/hydroneus-logo.png). Bundled by Vite, so it never
 * depends on the network; the hand-drawn SVG remains as a fallback
 * if the asset ever fails to load.
 */
export function Logo({ className = 'h-9 w-9' }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) return <FallbackLogo className={className} />

  return (
    <img
      src={logoAsset}
      alt="HydroNexus logo"
      width={256}
      height={256}
      className={`shrink-0 rounded-xl object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  )
}

/** Original vector mark used only if the PNG asset cannot be loaded. */
function FallbackLogo({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="HydroNexus logo">
      <defs>
        <linearGradient id="hn-drop" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b7bff" />
          <stop offset="100%" stopColor="#1555f5" />
        </linearGradient>
      </defs>
      {/* Droplet body */}
      <path
        d="M24 3.5c0 0-13.5 14.2-13.5 24.1A13.5 13.5 0 0 0 24 41.1a13.5 13.5 0 0 0 13.5-13.5C37.5 17.7 24 3.5 24 3.5Z"
        fill="url(#hn-drop)"
      />
      {/* Leaf */}
      <path
        d="M31.4 15.6c0 6.9-4.2 12-10.7 12.5 0 0 .8-6.9 5.1-10.6 2.6-2.2 5.6-2.7 5.6-1.9Zm-1.2 3.2c-2.4 2.4-4.7 6-5.1 9.9 4.9-.6 8-4.3 8.3-8.6.1-1.4-.9-1.9-3.2-1.3Z"
        fill="#e7f5ec"
      />
      {/* Network nodes */}
      <circle cx="16.5" cy="24.5" r="2.1" fill="#ffffff" />
      <circle cx="22.5" cy="33.5" r="2.1" fill="#ffffff" />
      <circle cx="31" cy="29.5" r="2.1" fill="#ffffff" />
      <path
        d="M18 25.8 21.3 32M24.2 32.9l5.4-2.1"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}
