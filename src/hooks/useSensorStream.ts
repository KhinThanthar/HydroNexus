import { useEffect, useMemo, useRef, useState } from 'react'
import type { MetricConfig, SensorReading } from '../types'
import { CURRENT_READINGS, METRICS, TREND_24H, evaluateStatus } from '../data/mockSensors'
import { clamp } from '../utils/format'

export interface LiveSensor {
  config: MetricConfig
  value: number
  status: ReturnType<typeof evaluateStatus>
  /** Change against the previous simulated tick, in metric units. */
  delta: number
}

export interface SensorStream {
  sensors: LiveSensor[]
  /** Full 24 hour series with the latest tick appended. */
  series: SensorReading[]
  /** Latest raw readings keyed by sensor. */
  latest: Record<string, number>
  lastUpdate: Date
}

const TICK_MS = 5000

/**
 * Simulated sensor feed. Every few seconds each metric drifts slightly within
 * believable bounds and the newest chart point is refreshed. Swap this hook for
 * a WebSocket / SSE consumer when real hardware is connected.
 */
export function useSensorStream(greenhouseId: string): SensorStream {
  const base = TREND_24H[greenhouseId] ?? TREND_24H['gh-samata']
  const initialValues = CURRENT_READINGS[greenhouseId] ?? CURRENT_READINGS['gh-samata']

  const [values, setValues] = useState<Record<string, number>>(initialValues)
  const [lastUpdate, setLastUpdate] = useState(() => new Date())
  const previous = useRef<Record<string, number>>(initialValues)

  // Reset when switching greenhouses.
  useEffect(() => {
    setValues(initialValues)
    previous.current = initialValues
    setLastUpdate(new Date())
  }, [greenhouseId, initialValues])

  useEffect(() => {
    const id = window.setInterval(() => {
      setValues((current) => {
        previous.current = current
        const next: Record<string, number> = {}
        for (const metric of METRICS) {
          const span = metric.normalMax - metric.normalMin
          // Small random walk, biased back toward the middle of the healthy range.
          const jitter = (Math.random() - 0.5) * span * 0.06
          const center = (metric.normalMin + metric.normalMax) / 2
          const pull = (center - (current[metric.key] ?? center)) * 0.15
          const decimals = metric.decimals
          next[metric.key] = +clamp((current[metric.key] ?? center) + jitter + pull, metric.normalMin - span * 0.3, metric.normalMax + span * 0.3).toFixed(decimals)
        }
        return next
      })
      setLastUpdate(new Date())
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  const stream = useMemo<SensorStream>(() => {
    const last = base[base.length - 1]
    const series = [
      ...base.slice(0, -1),
      {
        time: last.time,
        ph: values.ph,
        ec: values.ec,
        temperature: values.temperature,
        dissolvedOxygen: values.dissolvedOxygen,
      },
    ]
    return {
      sensors: METRICS.map((config) => ({
        config,
        value: values[config.key],
        status: evaluateStatus(config.key, values[config.key]),
        delta: +((values[config.key] ?? 0) - (previous.current[config.key] ?? 0)).toFixed(config.decimals),
      })),
      series,
      latest: values,
      lastUpdate,
    }
  }, [base, values, lastUpdate])

  return stream
}
