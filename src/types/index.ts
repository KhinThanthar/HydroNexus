/** Supported live sensor parameters. */
export type SensorKey = 'ph' | 'ec' | 'temperature' | 'dissolvedOxygen'

/** Hourly sensor readings used by charts, cards and history tables. */
export interface SensorReading {
  /** Label shown on the x-axis, e.g. "10:00" or "Mon". */
  time: string
  ph: number
  ec: number
  temperature: number
  dissolvedOxygen: number
}

export type MetricStatus = 'normal' | 'warning' | 'critical'

/** Static definition of a sensor metric (label, unit, colour, healthy range). */
export interface MetricConfig {
  key: SensorKey
  label: string
  shortLabel: string
  unit: string
  /** Tailwind-safe hex colour used for icons and chart series. */
  color: string
  /** Soft background tint paired with the colour. */
  soft: string
  normalMin: number
  normalMax: number
  decimals: number
}

export interface Greenhouse {
  id: string
  name: string
  location: string
  crop: string
  devicesOnline: number
  deviceCount: number
  outside: {
    temperatureC: number
    humidity: number
    condition: string
  }
  uptime: string
  logging: boolean
}

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface AlertItem {
  id: string
  greenhouseId: string
  sensor: SensorKey
  title: string
  description: string
  severity: AlertSeverity
  /** Human friendly relative time label, e.g. "10 minutes ago". */
  time: string
  /** Sort helper (lower = more recent). */
  minutesAgo: number
  read: boolean
}

export type RecommendationStatus = 'active' | 'done'

export interface Recommendation {
  id: string
  greenhouseId: string
  title: string
  description: string
  /** Icon key resolved inside the panel component. */
  icon: 'aeration' | 'nutrient' | 'ph' | 'light' | 'leak'
  /** Accent colour class key resolved inside the panel component. */
  accent: 'oxygen' | 'leaf' | 'primary' | 'temp'
  impact: 'high' | 'medium' | 'low'
  status: RecommendationStatus
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  /** Epoch milliseconds. */
  at: number
}

export interface HistoryRecord {
  id: string
  greenhouseId: string
  timestamp: string
  ph: number
  ec: number
  temperature: number
  dissolvedOxygen: number
  status: 'stable' | 'attention' | 'critical'
  note: string
}

export interface AppSettings {
  units: 'celsius' | 'fahrenheit'
  /** How often the simulated dashboard clock advances, in seconds. */
  refreshInterval: number
  notifications: boolean
  autoMarkRead: boolean
}
