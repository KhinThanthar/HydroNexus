# HydroNexus — Smart Hydroponics Monitoring Dashboard

A frontend-only React dashboard for monitoring hydroponic greenhouses, with AI-style
recommendations and a simulated troubleshooting assistant. **No backend, database, or
external API is required** — all data is realistic mock data generated in the browser.

## Tech stack

| Layer      | Choice                                          |
| ---------- | ----------------------------------------------- |
| Framework  | React 19 + TypeScript                           |
| Build      | Vite 8                                          |
| Styling    | Tailwind CSS 4 (`@tailwindcss/vite`)            |
| Charts     | Recharts 3 (multi-series line chart)            |
| Icons      | Lucide React                                    |
| Routing    | React Router 7                                  |
| State      | React context + hooks, persisted to localStorage |

## Run it

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build (outputs to dist/)
npm run preview  # serve the production build locally
```

## Features

- **Responsive app shell** — 220px sidebar on desktop; drawer navigation below `lg`.
  Verified with no horizontal overflow at 360, 390, 768, 1024, 1280 and 1440 px.
- **Header** — page title, feature tags, greenhouse dropdown (3 sample sites) and a
  live Online status indicator.
- **Sensor metric cards** — pH 5.8, EC 820 ppm, Temperature 26.7 °C, DO 6.3 mg/L.
  Values are data-driven and simulate live drift every 5 seconds.
- **Parameter Trends chart** — 24-hour multi-series line chart. Because the four
  sensors use different units, each series is **normalised to its own healthy range**
  (0% = bottom of the normal band, 100% = top); tooltips always show the real reading
  in original units, and the chart footer explains the mapping. Legend items toggle
  series visibility.
- **Alerts** — severity badges, timestamps, mark-one/mark-all read, filters
  (all/unread/critical/warning/info), empty state, and a reset for demo purposes.
  The unread badge in the sidebar updates live.
- **AI Recommendations** — three+ rule-based suggestions with impact levels;
  mark as done / reopen; completed items are visually distinct.
- **LLM Assistant** — right-side rail on `xl+`, stacked below content on smaller
  screens. Suggested topic buttons, Enter-to-send, typing indicator, message
  validation, auto-scroll. Replies come from local keyword rules isolated in
  `src/utils/assistant.ts`, so a real LLM endpoint can be swapped in later without
  touching the UI.
- **Bottom system status** — devices online, last update, data logging, uptime,
  outside conditions, plus a live-camera button that opens a modal clearly stating
  the preview is a placeholder, not a video stream.
- **Seven working pages** — Dashboard, Monitoring, Alerts, Recommendations,
  Assistant, History (filterable 30-day table), Settings (°C/°F, toggles, reset).
- **Accessibility** — semantic landmarks, ARIA labels, keyboard-navigable dropdowns
  and dialogs (Escape closes), visible focus states, `prefers-reduced-motion`
  support, and sufficient colour contrast.

## Project structure

```
src/
  components/
    assistant/     ChatPanel
    common/        Card, StatusBadge, EmptyState, Modal, Logo (uses assets/hydroneus-logo.png), GreenhouseIllustration
    dashboard/     MetricCard, SensorTrendChart, AlertsPanel, RecommendationsPanel, SystemStatus
    layout/        AppShell, Sidebar (+ mobile drawer), Header
  assets/          Optimised HydroNexus logo emblem (from HydroNexus Logo.png)
  context/         AppContext — shared state (greenhouse, alerts, recs, chat, settings)
  data/            Mock sensors, alerts, recommendations, greenhouses, history
  hooks/           useSensorStream (simulated live readings), useLocalStorage
  pages/           Dashboard, Monitoring, Alerts, Recommendations, Assistant, History, Settings
  types/           Shared TypeScript interfaces
  utils/           assistant (reply engine), format helpers
```

## Notes

- All imagery is local, so the app works fully offline and can never show a broken
  image: the sidebar/favicon use the official **HydroNexus Logo.png** (an optimized
  256px emblem crop bundled from `src/assets/`, with the original vector mark kept
  as an automatic fallback), and the greenhouse scenes are hand-drawn SVGs.
- Settings, read alerts, completed recommendations and chat history persist in
  `localStorage`; Settings → "Reset demo data" restores the original demo state.
- The sensor stream, assistant and camera feed are simulations by design.
