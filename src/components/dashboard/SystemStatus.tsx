import { useState } from 'react'
import {
  Camera,
  Clock,
  CloudSun,
  Database,
  Server,
  Timer,
} from 'lucide-react'
import type { Greenhouse } from '../../types'
import { formatClock, formatTemperature } from '../../utils/format'
import { GreenhouseIllustration, MediaSlot } from '../common/GreenhouseIllustration'
import { Modal } from '../common/Modal'
import { StatusBadge } from '../common/StatusBadge'

interface SystemStatusProps {
  greenhouse: Greenhouse
  lastUpdate: Date
  units: 'celsius' | 'fahrenheit'
}

/** Compact status tiles: devices, last update, logging, uptime, weather + camera. */
export function SystemStatus({ greenhouse, lastUpdate, units }: SystemStatusProps) {
  const [cameraOpen, setCameraOpen] = useState(false)

  const tiles = [
    {
      icon: Server,
      label: 'Devices Online',
      value: `${greenhouse.devicesOnline} / ${greenhouse.deviceCount}`,
      tone: greenhouse.devicesOnline === greenhouse.deviceCount ? 'normal' : 'warning',
    },
    { icon: Clock, label: 'Last Data Update', value: formatClock(lastUpdate), tone: 'info' },
    {
      icon: Database,
      label: 'Data Logging',
      value: greenhouse.logging ? 'Active' : 'Paused',
      tone: greenhouse.logging ? 'normal' : 'warning',
    },
    { icon: Timer, label: 'System Uptime', value: greenhouse.uptime, tone: 'normal' },
    {
      icon: CloudSun,
      label: 'Outside Condition',
      value: `${formatTemperature(greenhouse.outside.temperatureC, units)} · ${greenhouse.outside.humidity}% RH · ${greenhouse.outside.condition}`,
      tone: 'info',
    },
  ] as const

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
              <tile.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted">{tile.label}</p>
              <p className="truncate text-sm font-semibold text-ink">{tile.value}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 rounded-card border border-line bg-white p-3 shadow-card">
          <MediaSlot label={`Camera preview area for ${greenhouse.name}`} className="shrink-0">
            <GreenhouseIllustration className="h-12 w-20" />
          </MediaSlot>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-muted">Live Camera</p>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="mt-0.5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white transition hover:bg-primary-strong"
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              Open
            </button>
          </div>
        </div>
      </div>

      <Modal open={cameraOpen} title="Live Camera" onClose={() => setCameraOpen(false)}>
        <MediaSlot
          label="Placeholder camera preview"
          className="relative aspect-video w-full bg-ink/5"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <GreenhouseIllustration className="absolute inset-0 h-full w-full opacity-25" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-muted shadow-card">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="relative rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink shadow-card">
              Demo mode
            </p>
          </div>
        </MediaSlot>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-warning-soft px-3 py-2.5">
          <StatusBadge tone="warning" className="shrink-0">
            Placeholder
          </StatusBadge>
          <p className="text-xs leading-relaxed text-ink/80">
            No live camera connection is configured for this demo. This preview is an illustration, not a
            video stream. Connect an RTSP/HTTP camera feed in a future release to enable real footage.
          </p>
        </div>
      </Modal>
    </>
  )
}
