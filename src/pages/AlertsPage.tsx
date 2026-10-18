import { useMemo, useState } from 'react'
import { Bell, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AlertsPanel } from '../components/dashboard/AlertsPanel'

type Filter = 'all' | 'unread' | 'critical' | 'warning' | 'info'

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'critical', label: 'Critical' },
  { id: 'warning', label: 'Warning' },
  { id: 'info', label: 'Info' },
]

/** Full alert list with filtering, read state and a reset for demo purposes. */
export function AlertsPage() {
  const { alerts, markAlertRead, markAllAlertsRead, resetAlerts, greenhouse } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    switch (filter) {
      case 'unread':
        return alerts.filter((alert) => !alert.read)
      case 'critical':
      case 'warning':
      case 'info':
        return alerts.filter((alert) => alert.severity === filter)
      default:
        return alerts
    }
  }, [alerts, filter])

  const counts = {
    all: alerts.length,
    unread: alerts.filter((a) => !a.read).length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === item.id
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-white text-muted hover:border-primary/40 hover:text-primary'
            }`}
          >
            {item.label}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                filter === item.id ? 'bg-white/20 text-white' : 'bg-canvas text-muted'
              }`}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={resetAlerts}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-muted transition hover:border-primary/40 hover:text-primary"
          title="Restore the original demo read/unread states"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset demo state
        </button>
      </div>

      <AlertsPanel
        alerts={filtered}
        onMarkRead={markAlertRead}
        onMarkAllRead={markAllAlertsRead}
      />

      {filter === 'unread' && filtered.length === 0 ? (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Bell className="h-4 w-4" aria-hidden="true" />
          You are all caught up for {greenhouse.name}.
        </p>
      ) : null}
    </div>
  )
}
