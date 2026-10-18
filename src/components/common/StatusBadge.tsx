import type { ReactNode } from 'react'

export type BadgeTone = 'normal' | 'warning' | 'critical' | 'info' | 'neutral'

const TONES: Record<BadgeTone, string> = {
  normal: 'bg-leaf-soft text-leaf',
  warning: 'bg-warning-soft text-warning',
  critical: 'bg-danger-soft text-danger',
  info: 'bg-primary-soft text-primary',
  neutral: 'bg-canvas text-muted',
}

const DOT_COLORS: Record<BadgeTone, string> = {
  normal: 'bg-leaf',
  warning: 'bg-warning',
  critical: 'bg-danger',
  info: 'bg-primary',
  neutral: 'bg-muted',
}

interface StatusBadgeProps {
  tone: BadgeTone
  children: ReactNode
  showDot?: boolean
  className?: string
}

/** Compact status pill with an optional leading dot. */
export function StatusBadge({ tone, children, showDot = false, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {showDot ? <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[tone]}`} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
