import { Droplet, Thermometer, Waves, Wind } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useSensorStream } from '../hooks/useSensorStream'
import { Card, CardHeader } from '../components/common/Card'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SensorTrendChart } from '../components/dashboard/SensorTrendChart'
import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { RecommendationsPanel } from '../components/dashboard/RecommendationsPanel'
import { SystemStatus } from '../components/dashboard/SystemStatus'
import { ChatPanel } from '../components/assistant/ChatPanel'
import { celsiusToFahrenheit } from '../utils/format'
import { METRIC_BY_KEY } from '../data/mockSensors'

const METRIC_ICONS: Record<string, typeof Droplet> = {
  ph: Droplet,
  ec: Waves,
  temperature: Thermometer,
  dissolvedOxygen: Wind,
}

/** Main dashboard: metrics, trends, alerts, recommendations, assistant, status. */
export function DashboardPage() {
  const {
    greenhouse,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    recommendations,
    completeRecommendation,
    reopenRecommendation,
    settings,
  } = useApp()
  const stream = useSensorStream(greenhouse.id)

  return (
    <div className="space-y-5">
      {/* Desktop: main column + assistant rail. Below xl the assistant moves underneath. */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/* Sensor metric cards */}
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
                  displayUnit={
                    isTemp ? (settings.units === 'fahrenheit' ? '°F' : '°C') : sensor.config.unit
                  }
                  displayValue={
                    isTemp
                      ? settings.units === 'fahrenheit'
                        ? celsiusToFahrenheit(sensor.value).toFixed(1)
                        : sensor.value.toFixed(1)
                      : undefined
                  }
                  displayRange={
                    isTemp
                      ? settings.units === 'fahrenheit'
                        ? `${celsiusToFahrenheit(METRIC_BY_KEY.temperature.normalMin).toFixed(0)}–${celsiusToFahrenheit(METRIC_BY_KEY.temperature.normalMax).toFixed(0)} °F`
                        : `${METRIC_BY_KEY.temperature.normalMin}–${METRIC_BY_KEY.temperature.normalMax} °C`
                      : undefined
                  }
                />
              )
            })}
          </div>

          {/* Trends chart */}
          <Card label="Parameter trends, last 24 hours">
            <CardHeader
              title="Parameter Trends (Last 24 Hours)"
              subtitle={`${greenhouse.name} · updated ${stream.lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
            />
            <SensorTrendChart series={stream.series} settings={settings} />
          </Card>

          {/* Alerts + recommendations */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <AlertsPanel
              alerts={alerts}
              onMarkRead={markAlertRead}
              onMarkAllRead={markAllAlertsRead}
              compact
            />
            <RecommendationsPanel
              recommendations={recommendations}
              onComplete={completeRecommendation}
              onReopen={reopenRecommendation}
              compact
            />
          </div>
        </div>

        {/* Assistant: rail on xl+, stacked below the content on smaller screens */}
        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <ChatPanel />
        </div>
      </div>

      {/* Bottom system status */}
      <SystemStatus greenhouse={greenhouse} lastUpdate={stream.lastUpdate} units={settings.units} />
    </div>
  )
}
