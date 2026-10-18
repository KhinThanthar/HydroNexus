import type { Greenhouse } from '../types'

/** Sample greenhouses available in the selector. All data is mocked. */
export const GREENHOUSES: Greenhouse[] = [
  {
    id: 'gh-samata',
    name: 'Samata Green House',
    location: 'Yangon Urban Farm, Block C',
    crop: 'Butterhead Lettuce',
    devicesOnline: 4,
    deviceCount: 4,
    outside: { temperatureC: 31.2, humidity: 65, condition: 'Partly Cloudy' },
    uptime: '99.6%',
    logging: true,
  },
  {
    id: 'gh-riverside',
    name: 'Riverside Green House',
    location: 'Bago Valley Farm, Zone 2',
    crop: 'Basil & Mint',
    devicesOnline: 3,
    deviceCount: 3,
    outside: { temperatureC: 29.8, humidity: 71, condition: 'Light Rain' },
    uptime: '99.1%',
    logging: true,
  },
  {
    id: 'gh-hilltop',
    name: 'Hilltop Green House',
    location: 'Mandalay Rooftop Farm, Tower A',
    crop: 'Cherry Tomato',
    devicesOnline: 4,
    deviceCount: 4,
    outside: { temperatureC: 33.5, humidity: 48, condition: 'Sunny' },
    uptime: '98.4%',
    logging: false,
  },
]

export const DEFAULT_GREENHOUSE_ID = 'gh-samata'
