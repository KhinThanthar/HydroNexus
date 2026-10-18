import { useMemo, useState } from 'react'
import { History as HistoryIcon, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { StatusBadge } from '../components/common/StatusBadge'
import { MOCK_HISTORY } from '../data/mockHistory'
import { celsiusToFahrenheit } from '../utils/format'

const RANGES = [
  { id: 1, label: 'Last 24h' },
  { id: 3, label: 'Last 3 days' },
  { id: 7, label: 'Last 7 days' },
  { id: 30, label: 'Last 30 days' },
] as const

const STATUS_TONE = {
  stable: 'normal',
  attention: 'warning',
  critical: 'critical',
} as const

/** Historical sensor log with range and text filtering. */
export function HistoryPage() {
  const { greenhouse, settings } = useApp()
  const [rangeDays, setRangeDays] = useState<number>(7)
  const [query, setQuery] = useState('')

  const records = useMemo(() => {
    const all = MOCK_HISTORY[greenhouse.id] ?? []
    // Three entries per day are generated, oldest first.
    const maxRows = rangeDays * 3
    const trimmed = all.slice(0, maxRows)
    const q = query.trim().toLowerCase()
    if (!q) return trimmed
    return trimmed.filter(
      (record) =>
        record.note.toLowerCase().includes(q) ||
        record.status.includes(q) ||
        record.timestamp.toLowerCase().includes(q),
    )
  }, [greenhouse.id, rangeDays, query])

  const temperatureLabel = (celsius: number) =>
    settings.units === 'fahrenheit'
      ? `${celsiusToFahrenheit(celsius).toFixed(1)} °F`
      : `${celsius.toFixed(1)} °C`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="History range">
          {RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setRangeDays(range.id)}
              aria-pressed={rangeDays === range.id}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                rangeDays === range.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-line bg-white text-muted hover:border-primary/40 hover:text-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <label htmlFor="history-search" className="sr-only">
            Search history
          </label>
          <input
            id="history-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes, status, date…"
            className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <Card padding="none" label="Historical records">
        {records.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon className="h-7 w-7" />}
            title="No records match your filters"
            description="Try a wider time range or clear the search box."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Historical sensor records for {greenhouse.name}
              </caption>
              <thead>
                <tr className="border-b border-line bg-canvas/70 text-left text-xs text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Timestamp</th>
                  <th scope="col" className="px-4 py-3 font-medium">pH</th>
                  <th scope="col" className="px-4 py-3 font-medium">EC (ppm)</th>
                  <th scope="col" className="px-4 py-3 font-medium">Temperature</th>
                  <th scope="col" className="px-4 py-3 font-medium">DO (mg/L)</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-line last:border-0 hover:bg-canvas/50">
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{record.timestamp}</td>
                    <td className="px-4 py-3 text-ink">{record.ph.toFixed(1)}</td>
                    <td className="px-4 py-3 text-ink">{record.ec}</td>
                    <td className="px-4 py-3 text-ink">{temperatureLabel(record.temperature)}</td>
                    <td className="px-4 py-3 text-ink">{record.dissolvedOxygen.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={STATUS_TONE[record.status]}>
                        {record.status[0].toUpperCase() + record.status.slice(1)}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-muted">{record.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted">
        Showing {records.length} mock record{records.length === 1 ? '' : 's'} for {greenhouse.name}. All data is
        generated locally for demonstration purposes.
      </p>
    </div>
  )
}
