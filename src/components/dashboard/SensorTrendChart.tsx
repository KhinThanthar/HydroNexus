import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LegendPayload, TooltipContentProps } from 'recharts'
import { Info } from 'lucide-react'
import type { AppSettings, SensorReading } from '../../types'
import { METRICS, METRIC_BY_KEY } from '../../data/mockSensors'

interface SensorTrendChartProps {
  series: SensorReading[]
  settings: AppSettings
  /** Chart height in pixels. */
  height?: number
}

interface ChartPoint {
  time: string
  raw: Record<string, number>
  [key: string]: string | number | Record<string, number>
}

/**
 * The four sensors use different units and ranges, so each series is
 * normalised to its own healthy band: 0% sits at the bottom of the normal
 * range and 100% at the top. Tooltips always show the real reading, and the
 * chart footer states the mapping, so the display is never misleading.
 */
function normalize(key: string, value: number): number {
  const metric = METRIC_BY_KEY[key as keyof typeof METRIC_BY_KEY]
  if (!metric) return value
  const span = metric.normalMax - metric.normalMin
  // Allow the line to move outside the band when readings go out of range.
  const normalized = ((value - metric.normalMin) / span) * 100
  return Math.round(Math.min(140, Math.max(-40, normalized)) * 10) / 10
}

function toDisplayUnits(key: string, value: number, units: AppSettings['units']): { value: number; unit: string } {
  if (key === 'temperature') {
    return {
      value: units === 'fahrenheit' ? value * (9 / 5) + 32 : value,
      unit: units === 'fahrenheit' ? '°F' : '°C',
    }
  }
  const metric = METRIC_BY_KEY[key as keyof typeof METRIC_BY_KEY]
  return { value, unit: metric ? metric.unit : '' }
}

/** Multi-series sensor trend chart with legend toggles and raw-value tooltips. */
export function SensorTrendChart({ series, settings, height = 300 }: SensorTrendChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set())

  const data = useMemo(
    () =>
      series.map((point) => ({
        time: point.time,
        raw: {
          ph: point.ph,
          ec: point.ec,
          temperature: point.temperature,
          dissolvedOxygen: point.dissolvedOxygen,
        },
        ph: normalize('ph', point.ph),
        ec: normalize('ec', point.ec),
        temperature: normalize('temperature', point.temperature),
        dissolvedOxygen: normalize('dissolvedOxygen', point.dissolvedOxygen),
      })),
    [series],
  )

  const toggleSeries = (key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const renderTooltip = (props: TooltipContentProps) => {
    const { active, payload } = props
    const entry = payload?.[0]
    if (!active || !entry) return null
    const point = entry.payload as ChartPoint | undefined
    if (!point) return null
    return (
      <div className="rounded-xl border border-line bg-white px-3 py-2.5 shadow-pop">
        <p className="mb-1.5 text-xs font-semibold text-ink">{point.time}</p>
        <div className="space-y-1">
          {METRICS.filter((m) => !hiddenKeys.has(m.key)).map((metric) => {
            const rawValue = point.raw[metric.key]
            if (rawValue === undefined) return null
            const display = toDisplayUnits(metric.key, rawValue, settings.units)
            return (
              <p key={metric.key} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: metric.color }}
                  aria-hidden="true"
                />
                <span className="text-muted">{metric.shortLabel}</span>
                <span className="ml-auto font-semibold text-ink">
                  {metric.decimals === 0
                    ? Math.round(display.value).toLocaleString()
                    : display.value.toFixed(metric.decimals)}
                  {display.unit ? ` ${display.unit}` : ''}
                </span>
              </p>
            )
          })}
        </div>
        <p className="mt-1.5 border-t border-line pt-1.5 text-[10px] text-muted">Real sensor reading</p>
      </div>
    )
  }

  const renderLegend = (props: { payload?: ReadonlyArray<LegendPayload> }) => {
    const { payload } = props
    if (!payload) return null
    return (
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? '')
          const metric = METRIC_BY_KEY[key as keyof typeof METRIC_BY_KEY]
          if (!metric) return null
          const hidden = hiddenKeys.has(key)
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => toggleSeries(key)}
                aria-pressed={!hidden}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition ${
                  hidden ? 'opacity-40' : 'hover:bg-canvas'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: metric.color }}
                  aria-hidden="true"
                />
                <span className={hidden ? 'text-muted line-through' : 'text-ink'}>{metric.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#e8ecf3" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#687386', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e8ecf3' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              domain={[-40, 140]}
              ticks={[-40, 0, 50, 100, 140]}
              tick={{ fill: '#687386', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(tick: number) => `${tick}%`}
              label={{
                value: 'Normalised to range',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#687386', fontSize: 11 },
              }}
            />
            <Tooltip
              content={renderTooltip}
              cursor={{ stroke: '#c9d3e4', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend content={renderLegend} />
            {METRICS.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.label}
                stroke={metric.color}
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                hide={hiddenKeys.has(metric.key)}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-canvas px-3 py-2 text-[11px] leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Each line is normalised to its own healthy range: <strong className="font-semibold text-ink">0%</strong> is
          the bottom of the normal band and <strong className="font-semibold text-ink">100%</strong> the top, so
          differently scaled sensors can share one axis. Hover the chart to see the real readings with their
          original units. Click a legend item to hide or show a series.
        </span>
      </p>
    </div>
  )
}
