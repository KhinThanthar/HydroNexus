import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { RecommendationsPanel } from '../components/dashboard/RecommendationsPanel'

type Filter = 'all' | 'active' | 'done'

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Completed' },
]

/** Complete recommendation list with completion tracking. */
export function RecommendationsPage() {
  const { recommendations, completeRecommendation, reopenRecommendation } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (filter === 'active') return recommendations.filter((r) => r.status === 'active')
    if (filter === 'done') return recommendations.filter((r) => r.status === 'done')
    return recommendations
  }, [recommendations, filter])

  const activeCount = recommendations.filter((r) => r.status === 'active').length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === item.id
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-white text-muted hover:border-primary/40 hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
        <p className="ml-auto text-xs text-muted">
          {activeCount} open · {recommendations.length - activeCount} completed
        </p>
      </div>

      <RecommendationsPanel
        recommendations={filtered}
        onComplete={completeRecommendation}
        onReopen={reopenRecommendation}
      />
    </div>
  )
}
