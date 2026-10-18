import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Renders the card as a <section> with an accessible name when provided. */
  label?: string
  padding?: 'none' | 'sm' | 'md'
}

/** Standard white dashboard card with soft border and shadow. */
export function Card({ children, label, padding = 'md', className = '', ...rest }: CardProps) {
  const paddingClass = padding === 'none' ? '' : padding === 'sm' ? 'p-4' : 'p-5'
  return (
    <section
      aria-label={label}
      className={`rounded-card border border-line bg-white shadow-card ${paddingClass} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
}

/** Title row used at the top of dashboard cards. */
export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          {icon}
          <span className="truncate">{title}</span>
        </h2>
        {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
