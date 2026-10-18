import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

/** Friendly placeholder shown when a list has no items. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-canvas/60 px-4 py-10 text-center">
      <span className="text-muted" aria-hidden="true">
        {icon}
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="max-w-xs text-xs text-muted">{description}</p> : null}
      {action}
    </div>
  )
}
