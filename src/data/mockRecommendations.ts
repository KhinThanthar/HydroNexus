import type { Recommendation } from '../types'

/** Mock AI recommendations generated from sensor rules. */
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    greenhouseId: 'gh-samata',
    title: 'Increase Aeration',
    description:
      'Low DO detected in the root zone. Run the air pump 20 minutes longer each cycle to support healthy root growth.',
    icon: 'aeration',
    accent: 'oxygen',
    impact: 'high',
    status: 'active',
  },
  {
    id: 'rec-2',
    greenhouseId: 'gh-samata',
    title: 'Check Nutrient Solution',
    description:
      'EC is slightly low at 820 ppm. Adjust the nutrient mix and re-test after 30 minutes.',
    icon: 'nutrient',
    accent: 'leaf',
    impact: 'medium',
    status: 'active',
  },
  {
    id: 'rec-3',
    greenhouseId: 'gh-samata',
    title: 'Monitor pH Closely',
    description:
      'pH has been fluctuating over the last few hours. Keep it stable between 5.5 and 6.5 for optimal growth.',
    icon: 'ph',
    accent: 'primary',
    impact: 'medium',
    status: 'active',
  },
  {
    id: 'rec-4',
    greenhouseId: 'gh-samata',
    title: 'Extend Light Cycle',
    description:
      'Light intensity dipped below 600 µmol during cloudy hours. Supplement with grow lights until 18:00.',
    icon: 'light',
    accent: 'temp',
    impact: 'low',
    status: 'done',
  },
  {
    id: 'rec-5',
    greenhouseId: 'gh-riverside',
    title: 'Increase Aeration',
    description:
      'Overnight DO dropped to 5.2 mg/L. Extend aeration cycles and verify the air stone is not clogged.',
    icon: 'aeration',
    accent: 'oxygen',
    impact: 'high',
    status: 'active',
  },
  {
    id: 'rec-6',
    greenhouseId: 'gh-riverside',
    title: 'Balance Nutrient Mix',
    description: 'EC is climbing toward the top of the range. Reduce base nutrient dosage by 10%.',
    icon: 'nutrient',
    accent: 'leaf',
    impact: 'medium',
    status: 'active',
  },
  {
    id: 'rec-7',
    greenhouseId: 'gh-hilltop',
    title: 'Add Midday Shade',
    description:
      'Rooftop heat pushed air temperature to 29.2 °C. Deploy shade cloth between 11:00 and 15:00.',
    icon: 'light',
    accent: 'temp',
    impact: 'high',
    status: 'active',
  },
  {
    id: 'rec-8',
    greenhouseId: 'gh-hilltop',
    title: 'Top Up Nutrients',
    description: 'EC sits at 758 ppm, below target for cherry tomato. Add part A/B nutrients.',
    icon: 'nutrient',
    accent: 'leaf',
    impact: 'medium',
    status: 'done',
  },
]
