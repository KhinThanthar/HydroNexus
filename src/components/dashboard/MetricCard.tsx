import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { MetricStatus, MetricConfig } from '../../types'
import { StatusBadge, type BadgeTone } from '../common/StatusBadge'

interface MetricCardProps {
  config: MetricConfig
  value: number
  status: MetricStatus
  /** Change vs previous tick (already in display units). */
  delta?: number
  icon: ReactNode
  /** Temperature unit override when the user prefers Fahrenheit. */
  displayUnit?: string
  displayValue?: string
  displayRange?: string
}

const STATUS_TONE: Record<MetricStatus, { badge: BadgeTone; label: string }> = {
  normal: { badge: 'normal', label: 'Normal' },
  warning: { badge: 'warning', label: 'Warning' },
  critical: { badge: 'critical', label: 'Critical' },
}

/** Sensor reading card used across the dashboard and monitoring pages. */
export function MetricCard({
  config,
  value,
  status,
  delta = 0,
  icon,
  displayUnit,
  displayValue,
  displayRange,
}: MetricCardProps) {
  const tone = STATUS_TONE[status]
  const unit = displayUnit ?? config.unit
  const range =
    displayRange ?? `${config.normalMin}–${config.normalMax}${unit ? ` ${unit}` : ''}`
  const valueText =
    displayValue ??
    (config.decimals === 0 ? Math.round(value).toLocaleString() : value.toFixed(config.decimals))
  const trend =
    Math.abs(delta) < (config.decimals === 0 ? 1 : 0.05)
      ? 'stable'
      : delta > 0
        ? 'up'
        : 'down'

  return (
    <article className="rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: config.soft, color: config.color }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <StatusBadge tone={tone.badge} showDot>
          {tone.label}
        </StatusBadge>
      </div>

      <p className="mt-4 text-[13px] font-medium text-muted">{config.label}</p>

      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold leading-none tracking-tight text-ink">{valueText}</span>
        {unit ? <span className="text-sm font-medium text-muted">{unit}</span> : null}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
        <p className="text-xs text-muted">
          Normal: <span className="font-medium text-ink">{range}</span>
        </p>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium ${
            trend === 'stable' ? 'text-muted' : trend === 'up' ? 'text-temp' : 'text-primary'
          }`}
          title={`Trend since the last update`}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : trend === 'down' ? (
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {delta === 0 ? '0' : Math.abs(delta)}
        </span>
      </div>
    </article>
  )
}
