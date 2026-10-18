/** Formatting helpers shared across pages. */

/** Convert °C to °F. */
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32
}

/** Format a temperature according to the user's unit preference. */
export function formatTemperature(celsius: number, units: 'celsius' | 'fahrenheit', decimals = 1): string {
  if (units === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius).toFixed(decimals)} °F`
  }
  return `${celsius.toFixed(decimals)} °C`
}

/** Short, stable ids for mock interactions (no external id library needed). */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Local time string used by the "Last Data Update" widget. */
export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}
