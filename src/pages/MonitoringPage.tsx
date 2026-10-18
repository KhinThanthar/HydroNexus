import { Activity, Cpu, Droplet, Thermometer, Waves, Wind } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useSensorStream } from '../hooks/useSensorStream'
import { Card, CardHeader } from '../components/common/Card'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SensorTrendChart } from '../components/dashboard/SensorTrendChart'
import { StatusBadge } from '../components/common/StatusBadge'
import { DEVICES, EXTRA_METRICS, METRIC_BY_KEY, evaluateStatus } from '../data/mockSensors'
import { celsiusToFahrenheit } from '../utils/format'
import { EmptyState } from '../components/common/EmptyState'

const METRIC_ICONS: Record<string, typeof Droplet> = {
  ph: Droplet,
  ec: Waves,
  temperature: Thermometer,
  dissolvedOxygen: Wind,
}

/** Detailed live readings, secondary parameters and device health. */
export function MonitoringPage() {
  const { greenhouse, settings } = useApp()
  const stream = useSensorStream(greenhouse.id)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stream.sensors.map((sensor) => {
          const Icon = METRIC_ICONS[sensor.config.key] ?? Droplet
          const isTemp = sensor.config.key === 'temperature'
          return (
            <MetricCard
              key={sensor.config.key}
              config={sensor.config}
              value={sensor.value}
              status={sensor.status}
              delta={sensor.delta}
              icon={<Icon className="h-5 w-5" />}
              displayUnit={isTemp ? (settings.units === 'fahrenheit' ? '°F' : '°C') : sensor.config.unit}
              displayValue={
                isTemp
                  ? settings.units === 'fahrenheit'
                    ? celsiusToFahrenheit(sensor.value).toFixed(1)
                    : sensor.value.toFixed(1)
                  : undefined
              }
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card label="Parameter trends" className="min-w-0">
          <CardHeader
            title="Parameter Trends (Last 24 Hours)"
            subtitle="Historical movement for the selected greenhouse"
          />
          <SensorTrendChart series={stream.series} settings={settings} height={340} />
        </Card>

        <div className="space-y-5">
          <Card label="Secondary parameters">
            <CardHeader
              title="Secondary Parameters"
              subtitle="Supporting environment readings"
              icon={<Activity className="h-4 w-4 text-leaf" aria-hidden="true" />}
            />
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
              {EXTRA_METRICS.map((metric) => {
                const status = metric.min <= metric.value && metric.value <= metric.max ? 'normal' : 'warning'
                return (
                  <li
                    key={metric.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas/60 px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted">{metric.label}</p>
                      <p className="text-base font-semibold text-ink">
                        {metric.value}
                        <span className="ml-1 text-xs font-medium text-muted">{metric.unit}</span>
                      </p>
                    </div>
                    <StatusBadge tone={status === 'normal' ? 'normal' : 'warning'} showDot>
                      {status === 'normal' ? 'Normal' : 'Check'}
                    </StatusBadge>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card label="Devices">
            <CardHeader
              title="Devices"
              subtitle={`${greenhouse.devicesOnline} of ${greenhouse.deviceCount} online`}
              icon={<Cpu className="h-4 w-4 text-primary" aria-hidden="true" />}
            />
            {DEVICES.length === 0 ? (
              <EmptyState icon={<Cpu className="h-7 w-7" />} title="No devices registered" />
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {DEVICES.map((device) => (
                  <li key={device.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{device.name}</p>
                      <p className="truncate text-[11px] text-muted">
                        {device.type} · battery {device.battery}%
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-muted">{device.lastSync}</span>
                      <StatusBadge tone="normal" showDot>
                        Online
                      </StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted">
        Healthy bands — pH {METRIC_BY_KEY.ph.normalMin}–{METRIC_BY_KEY.ph.normalMax}, EC{' '}
        {METRIC_BY_KEY.ec.normalMin}–{METRIC_BY_KEY.ec.normalMax} ppm, temperature{' '}
        {METRIC_BY_KEY.temperature.normalMin}–{METRIC_BY_KEY.temperature.normalMax} °C, dissolved oxygen{' '}
        {METRIC_BY_KEY.dissolvedOxygen.normalMin}–{METRIC_BY_KEY.dissolvedOxygen.normalMax} mg/L. Current
        statuses: {stream.sensors.map((s) => `${s.config.shortLabel} ${evaluateStatus(s.config.key, s.value)}`).join(', ')}.
      </p>
    </div>
  )
}
