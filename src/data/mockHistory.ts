import type { HistoryRecord } from '../types'

/** Deterministic pseudo-random generator so mock history stays stable between renders. */
function seeded(seed: number): () => number {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const GREENHOUSE_SEEDS: Record<string, { ph: number; ec: number; temp: number; do: number }> = {
  'gh-samata': { ph: 5.8, ec: 820, temp: 26.7, do: 6.3 },
  'gh-riverside': { ph: 6.2, ec: 910, temp: 23.4, do: 5.4 },
  'gh-hilltop': { ph: 5.4, ec: 760, temp: 28.9, do: 7.1 },
}

const NOTES = [
  'Routine log',
  'Nutrient top-up completed',
  'Irrigation cycle finished',
  'Probe auto-calibration',
  'Ventilation adjusted',
  'Water change performed',
]

/** Build 30 days of mock records for a greenhouse. */
function buildHistory(greenhouseId: string, days: number): HistoryRecord[] {
  const base = GREENHOUSE_SEEDS[greenhouseId] ?? GREENHOUSE_SEEDS['gh-samata']
  const rand = seeded(greenhouseId.length * 7919 + days)
  const records: HistoryRecord[] = []
  const now = new Date()

  for (let d = 0; d < days; d += 1) {
    for (let slot = 0; slot < 3; slot += 1) {
      const at = new Date(now.getTime() - (d * 3 + slot) * 8 * 60 * 60 * 1000)
      const ph = +(base.ph + (rand() - 0.5) * 0.8).toFixed(1)
      const ec = Math.round(base.ec + (rand() - 0.5) * 160)
      const temperature = +(base.temp + (rand() - 0.5) * 5).toFixed(1)
      const dissolvedOxygen = +(base.do + (rand() - 0.5) * 1.6).toFixed(1)

      let status: HistoryRecord['status'] = 'stable'
      if (ph < 5.5 || ph > 6.5 || temperature > 28 || dissolvedOxygen < 5) status = 'attention'
      if (dissolvedOxygen < 4.6 || temperature > 29.5) status = 'critical'

      records.push({
        id: `${greenhouseId}-${d}-${slot}`,
        greenhouseId,
        timestamp: at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        ph,
        ec,
        temperature,
        dissolvedOxygen,
        status,
        note: NOTES[Math.floor(rand() * NOTES.length)],
      })
    }
  }
  return records
}

export const MOCK_HISTORY: Record<string, HistoryRecord[]> = {
  'gh-samata': buildHistory('gh-samata', 30),
  'gh-riverside': buildHistory('gh-riverside', 30),
  'gh-hilltop': buildHistory('gh-hilltop', 30),
}
