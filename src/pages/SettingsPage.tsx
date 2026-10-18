import { useState } from 'react'
import { Building2, Cpu, RotateCcw, Save } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, CardHeader } from '../components/common/Card'
import { DEVICES } from '../data/mockSensors'
import { formatTemperature } from '../utils/format'

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

/** Frontend preferences and greenhouse configuration. */
export function SettingsPage() {
  const { settings, updateSettings, greenhouse, greenhouses, resetDemoData } = useApp()
  const [savedFlash, setSavedFlash] = useState(false)

  const flashSaved = () => {
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Card label="Display preferences">
        <CardHeader title="Display Preferences" subtitle="Applies across every page instantly" />

        <fieldset className="border-b border-line pb-4">
          <legend className="text-sm font-medium text-ink">Temperature unit</legend>
          <div className="mt-2 flex gap-2">
            {(['celsius', 'fahrenheit'] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => updateSettings({ units: unit })}
                aria-pressed={settings.units === unit}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  settings.units === unit
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-white text-muted hover:border-primary/40 hover:text-primary'
                }`}
              >
                {unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Preview: {formatTemperature(greenhouse.outside.temperatureC, settings.units)} outside right now.
          </p>
        </fieldset>

        <div className="divide-y divide-line">
          <ToggleRow
            id="setting-notifications"
            label="Dashboard notifications"
            description="Show alert banners and unread badges in the navigation."
            checked={settings.notifications}
            onChange={(value) => {
              updateSettings({ notifications: value })
              flashSaved()
            }}
          />
          <ToggleRow
            id="setting-autoread"
            label="Auto-mark alerts as read"
            description="Switching greenhouses marks its alerts as read automatically."
            checked={settings.autoMarkRead}
            onChange={(value) => {
              updateSettings({ autoMarkRead: value })
              flashSaved()
            }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted" role="status">
          {savedFlash ? (
            <>
              <Save className="h-3.5 w-3.5 text-leaf" aria-hidden="true" />
              <span className="text-leaf">Saved to this browser.</span>
            </>
          ) : (
            <span>Preferences are stored in your browser (localStorage).</span>
          )}
        </div>
      </Card>

      <Card label="Greenhouse configuration">
        <CardHeader
          title="Greenhouse Configuration"
          subtitle="Sample sites available in this demo"
          icon={<Building2 className="h-4 w-4 text-leaf" aria-hidden="true" />}
        />
        <ul className="flex flex-col gap-2.5">
          {greenhouses.map((item) => {
            const active = item.id === greenhouse.id
            return (
              <li
                key={item.id}
                className={`rounded-xl border p-3.5 transition ${
                  active ? 'border-primary/40 bg-primary-soft/50' : 'border-line bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  {active ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
                      Selected
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-muted">{item.location}</p>
                <p className="mt-1 text-xs text-muted">
                  Crop: {item.crop} · Devices: {item.devicesOnline}/{item.deviceCount} · Outside:{' '}
                  {formatTemperature(item.outside.temperatureC, settings.units)}, {item.outside.humidity}% RH
                </p>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Use the greenhouse selector in the header to switch sites. Adding or editing greenhouses would
          require a backend in a future release.
        </p>
      </Card>

      <Card label="Devices">
        <CardHeader
          title="Registered Devices"
          subtitle="Sensor hardware paired with this account"
          icon={<Cpu className="h-4 w-4 text-primary" aria-hidden="true" />}
        />
        <ul className="divide-y divide-line">
          {DEVICES.map((device) => (
            <li key={device.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{device.name}</p>
                <p className="truncate text-[11px] text-muted">
                  {device.type} · id {device.id}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-leaf-soft px-2.5 py-1 text-[11px] font-medium text-leaf">
                Online
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card label="Demo data">
        <CardHeader
          title="Demo Data"
          subtitle="Everything on this site is simulated locally"
          icon={<RotateCcw className="h-4 w-4 text-temp" aria-hidden="true" />}
        />
        <p className="text-sm leading-relaxed text-muted">
          Resetting restores the original alerts, recommendations, chat conversation and preferences. No
          data is stored on any server — everything lives in this browser.
        </p>
        <button
          type="button"
          onClick={() => {
            resetDemoData()
            flashSaved()
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-strong"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset demo data
        </button>
      </Card>
    </div>
  )
}
