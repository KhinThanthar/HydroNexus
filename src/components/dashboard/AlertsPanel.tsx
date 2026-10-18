import { Link } from 'react-router-dom'
import { Bell, Check, Droplet, Eye, Thermometer, Waves } from 'lucide-react'
import type { AlertItem, AlertSeverity } from '../../types'
import { Card, CardHeader } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { StatusBadge, type BadgeTone } from '../common/StatusBadge'

const SEVERITY_TONE: Record<AlertSeverity, { badge: BadgeTone; label: string }> = {
  critical: { badge: 'critical', label: 'Critical' },
  warning: { badge: 'warning', label: 'Warning' },
  info: { badge: 'info', label: 'Info' },
}

const SENSOR_ICONS: Record<string, typeof Droplet> = {
  ph: Droplet,
  ec: Waves,
  temperature: Thermometer,
  dissolvedOxygen: Waves,
}

interface AlertsPanelProps {
  alerts: AlertItem[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  /** Compact card used on the dashboard vs. full list on the alerts page. */
  compact?: boolean
}

/** Recent sensor alerts with read/unread handling. */
export function AlertsPanel({ alerts, onMarkRead, onMarkAllRead, compact = false }: AlertsPanelProps) {
  const visible = compact ? alerts.slice(0, 4) : alerts
  const unread = alerts.filter((alert) => !alert.read).length

  return (
    <Card label="Recent alerts" className="flex h-full flex-col">
      <CardHeader
        title="Recent Alerts"
        subtitle={`${unread} unread notification${unread === 1 ? '' : 's'}`}
        icon={<Bell className="h-4 w-4 text-primary" aria-hidden="true" />}
        action={
          <div className="flex items-center gap-2">
            {unread > 0 ? (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="rounded-lg px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary-soft"
              >
                Mark all read
              </button>
            ) : null}
            <Link
              to="/alerts"
              className="rounded-lg px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary-soft"
            >
              View all
            </Link>
          </div>
        }
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-7 w-7" />}
          title="No alerts right now"
          description="Everything is within the healthy range for this greenhouse."
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {visible.map((alert) => {
            const Icon = SENSOR_ICONS[alert.sensor] ?? Droplet
            const severity = SEVERITY_TONE[alert.severity]
            return (
              <li
                key={alert.id}
                className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                  alert.read ? 'border-line bg-white' : 'border-line bg-canvas/70'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    alert.sensor === 'dissolvedOxygen'
                      ? 'bg-oxygen-soft text-oxygen'
                      : alert.sensor === 'temperature'
                        ? 'bg-temp-soft text-temp'
                        : alert.sensor === 'ec'
                          ? 'bg-leaf-soft text-leaf'
                          : 'bg-primary-soft text-primary'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm font-semibold ${alert.read ? 'text-muted' : 'text-ink'}`}>
                      {alert.title}
                    </p>
                    <StatusBadge tone={severity.badge}>{severity.label}</StatusBadge>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{alert.description}</p>
                  <p className="mt-1 text-[11px] text-muted">{alert.time}</p>
                </div>

                {alert.read ? (
                  <span
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-leaf"
                    title="Marked as read"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Read
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onMarkRead(alert.id)}
                    aria-label={`Mark "${alert.title}" as read`}
                    className="mt-0.5 rounded-lg p-1.5 text-muted transition hover:bg-primary-soft hover:text-primary"
                    title="Mark as read"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
