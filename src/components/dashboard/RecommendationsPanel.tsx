import { Link } from 'react-router-dom'
import { Check, Droplet, Lightbulb, RotateCcw, Sparkles, Waves, Wind } from 'lucide-react'
import type { Recommendation } from '../../types'
import { Card, CardHeader } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { StatusBadge, type BadgeTone } from '../common/StatusBadge'

const ACCENT_CLASSES: Record<Recommendation['accent'], { box: string; icon: React.ComponentType<{ className?: string }> }> = {
  oxygen: { box: 'bg-oxygen-soft text-oxygen', icon: Wind },
  leaf: { box: 'bg-leaf-soft text-leaf', icon: Waves },
  primary: { box: 'bg-primary-soft text-primary', icon: Droplet },
  temp: { box: 'bg-temp-soft text-temp', icon: Lightbulb },
}

const IMPACT_TONE: Record<Recommendation['impact'], BadgeTone> = {
  high: 'critical',
  medium: 'warning',
  low: 'info',
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
  onComplete: (id: string) => void
  onReopen: (id: string) => void
  compact?: boolean
}

/** AI recommendation cards with completion state. */
export function RecommendationsPanel({
  recommendations,
  onComplete,
  onReopen,
  compact = false,
}: RecommendationsPanelProps) {
  const visible = compact ? recommendations.slice(0, 3) : recommendations

  return (
    <Card label="AI recommendations" className="flex h-full flex-col">
      <CardHeader
        title="AI Recommendations"
        subtitle="Suggested actions derived from sensor rules"
        icon={<Sparkles className="h-4 w-4 text-leaf" aria-hidden="true" />}
        action={
          <Link
            to="/recommendations"
            className="rounded-lg px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary-soft"
          >
            View all
          </Link>
        }
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-7 w-7" />}
          title="No recommendations"
          description="The system has no suggested actions for this greenhouse right now."
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {visible.map((rec) => {
            const accent = ACCENT_CLASSES[rec.accent]
            const Icon = accent.icon
            const done = rec.status === 'done'
            return (
              <li
                key={rec.id}
                className={`rounded-xl border border-line p-3 transition ${
                  done ? 'bg-leaf-soft/40' : 'bg-white hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.box}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-semibold ${done ? 'text-muted line-through' : 'text-ink'}`}>
                        {rec.title}
                      </p>
                      <StatusBadge tone={IMPACT_TONE[rec.impact]}>
                        {rec.impact[0].toUpperCase() + rec.impact.slice(1)} impact
                      </StatusBadge>
                      {done ? <StatusBadge tone="normal">Completed</StatusBadge> : null}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{rec.description}</p>

                    <div className="mt-2">
                      {done ? (
                        <button
                          type="button"
                          onClick={() => onReopen(rec.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-muted transition hover:border-primary/40 hover:text-primary"
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          Reopen
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onComplete(rec.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white transition hover:bg-primary-strong"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Mark as done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
