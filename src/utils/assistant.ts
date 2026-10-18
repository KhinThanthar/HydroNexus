/**
 * Mock assistant engine.
 *
 * The interface (`generateReply`) is intentionally small so a real LLM
 * integration can be dropped in later: replace the body of `generateReply`
 * with a fetch to your model endpoint and keep the same return shape.
 * No network calls happen here.
 */

export interface AssistantReply {
  text: string
  topics: string[]
}

interface Rule {
  keywords: string[]
  reply: string
  topics: string[]
}

const RULES: Rule[] = [
  {
    keywords: ['ph'],
    reply:
      'Rapid pH drop can be caused by:\n• Excessive nutrient uptake by plants\n• Nutrient solution imbalance\n• High CO₂ accumulation\n\nCheck EC, water temperature, and refill nutrients if needed. Would you like a detailed guide?',
    topics: ['Nutrient Imbalance', 'Sensor Calibration'],
  },
  {
    keywords: ['do', 'oxygen', 'aeration', 'aerator', 'air'],
    reply:
      'Low dissolved oxygen stresses roots and invites root rot.\n\nTry this:\n• Run the air pump 20 minutes longer per cycle\n• Check the air stone for clogging\n• Lower water temperature below 24 °C\n• Avoid overstocking the raft\n\nShall I draft an aeration schedule for you?',
    topics: ['Low DO', 'Nutrient Imbalance'],
  },
  {
    keywords: ['ec', 'ppm', 'nutrient', 'fertiliz', 'feeding'],
    reply:
      'EC tells you the nutrient concentration in the solution.\n\n• Below 700 ppm: plants may be hungry — add part A/B nutrients\n• Above 1000 ppm: risk of nutrient burn — dilute with fresh water\n• Sudden jumps usually mean evaporation or low water level\n\nCurrent EC in your selected greenhouse is within the healthy band. Want a mixing ratio table?',
    topics: ['Nutrient Imbalance', 'Sensor Calibration'],
  },
  {
    keywords: ['calibrat', 'probe', 'sensor', 'accuracy', 'drift'],
    reply:
      'Calibrate probes every 2 weeks for reliable readings.\n\n1. Rinse the probe with distilled water\n2. Immerse in pH 4.0 buffer, wait for stability, confirm\n3. Repeat with pH 7.0 buffer\n4. Rinse and store in storage solution\n\nIf readings still drift, the probe lifespan (12–18 months) may be ending.',
    topics: ['Sensor Calibration', 'Connectivity Issues'],
  },
  {
    keywords: ['connect', 'offline', 'wifi', 'network', 'sync', 'device'],
    reply:
      'If a device shows offline:\n• Check that the gateway has power and Wi-Fi signal\n• Confirm the sensor battery is above 20%\n• Restart the gateway, then wait 2 minutes for re-sync\n\nAll 4 devices in this demo are online. Historical data keeps logging locally until the link returns.',
    topics: ['Connectivity Issues', 'Sensor Calibration'],
  },
  {
    keywords: ['temperature', 'temp', 'heat', 'cool', 'warm'],
    reply:
      'Tomatoes and basil grow best between 20–28 °C.\n\n• Above 28 °C: open vents, add shade cloth, increase airflow\n• Below 18 °C: reduce ventilation and consider a heater\n• Water temperature should stay 2–3 °C below air temperature\n\nCurrent temperature looks healthy for your crop.',
    topics: ['Low DO', 'Nutrient Imbalance'],
  },
  {
    keywords: ['light', 'lamp', 'lampu', 'grow light', 'photoperiod'],
    reply:
      'Most leafy greens need 14–16 hours of light at 600–1000 µmol.\n\n• On cloudy days, supplement with LED grow lights\n• Keep panels 30–40 cm above the canopy\n• Watch for leaf bleaching if lights are too close\n\nWould you like a photoperiod plan for your crop?',
    topics: ['Nutrient Imbalance', 'Connectivity Issues'],
  },
  {
    keywords: ['water', 'leak', 'level', 'pump', 'drain'],
    reply:
      'Water level and pump health are easy to overlook.\n\n• Keep the tank above 40% to protect the pump\n• Inspect fittings weekly for slow leaks\n• Clean the strainer if flow drops\n\nYour current water level is comfortable at 74%.',
    topics: ['Connectivity Issues', 'Low DO'],
  },
]

const FALLBACK: AssistantReply = {
  text: 'I can help with pH, EC/nutrients, dissolved oxygen, temperature, lighting, water systems, and device connectivity.\n\nTry asking "Why is my pH dropping quickly?" or pick one of the suggested topics below.',
  topics: ['Sensor Calibration', 'Nutrient Imbalance', 'Low DO', 'Connectivity Issues'],
}

/** Return a canned reply based on keywords in the user's message. */
export function generateReply(message: string): AssistantReply {
  const normalized = message.toLowerCase()
  const rule = RULES.find((r) => r.keywords.some((k) => normalized.includes(k)))
  if (!rule) return FALLBACK
  return { text: rule.reply, topics: rule.topics }
}

export const SUGGESTED_PROMPTS = [
  'Sensor Calibration',
  'Nutrient Imbalance',
  'Low DO',
  'Connectivity Issues',
] as const

export const SUGGESTED_PROMPT_QUESTIONS: Record<string, string> = {
  'Sensor Calibration': 'How do I calibrate my pH and EC probes?',
  'Nutrient Imbalance': 'How do I fix a nutrient imbalance in my solution?',
  'Low DO': 'Why is my dissolved oxygen low and how do I raise it?',
  'Connectivity Issues': 'A sensor shows offline — what should I check?',
}

export const OPENING_MESSAGE = {
  role: 'assistant' as const,
  content:
    'Hello! I am your HydroNexus assistant. I can explain sensor readings, suggest fixes, and help troubleshoot your greenhouse. What would you like to know?',
}
