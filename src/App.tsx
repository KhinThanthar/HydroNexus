import { Suspense, lazy } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'

// Route-level code splitting keeps the initial bundle small; Recharts and the
// chat panel only load on the pages that use them.
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const MonitoringPage = lazy(() =>
  import('./pages/MonitoringPage').then((m) => ({ default: m.MonitoringPage })),
)
const AlertsPage = lazy(() => import('./pages/AlertsPage').then((m) => ({ default: m.AlertsPage })))
const RecommendationsPage = lazy(() =>
  import('./pages/RecommendationsPage').then((m) => ({ default: m.RecommendationsPage })),
)
const AssistantPage = lazy(() =>
  import('./pages/AssistantPage').then((m) => ({ default: m.AssistantPage })),
)
const HistoryPage = lazy(() => import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage })))
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24" role="status" aria-label="Loading page">
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-line border-t-primary" />
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-line bg-white py-20 text-center shadow-card">
      <Compass className="h-9 w-9 text-muted" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-ink">Page not found</h2>
      <p className="max-w-sm text-sm text-muted">
        The page you are looking for does not exist in this demo.
      </p>
      <Link
        to="/"
        className="mt-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-strong"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </AppProvider>
  )
}
