import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar, SidebarDrawer } from './Sidebar'

interface PageMeta {
  title: string
  subtitle: string
  tags: string[]
}

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Live overview of your selected greenhouse',
    tags: ['Smart Monitoring', 'AI Recommendations', 'Troubleshooting Assistant'],
  },
  '/monitoring': {
    title: 'Monitoring',
    subtitle: 'Detailed sensor readings and device health',
    tags: ['Sensor Details', 'Device Status'],
  },
  '/alerts': {
    title: 'Alerts',
    subtitle: 'Sensor notifications across your greenhouses',
    tags: ['Severity Filter', 'Read Status'],
  },
  '/recommendations': {
    title: 'Recommendations',
    subtitle: 'AI-generated actions for healthier crops',
    tags: ['Impact Ranking', 'Task Tracking'],
  },
  '/assistant': {
    title: 'Assistant (LLM)',
    subtitle: 'Troubleshoot your greenhouse with the help of the assistant',
    tags: ['Chat Interface', 'Suggested Topics'],
  },
  '/history': {
    title: 'History',
    subtitle: 'Logged sensor records from the last 30 days',
    tags: ['Records Table', 'Filtering'],
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Frontend preferences and greenhouse configuration',
    tags: ['Units', 'Notifications', 'Demo Data'],
  },
}

/** Standard application frame: sidebar + header + routed content. */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? PAGE_META['/']

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <SidebarDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          tags={meta.tags}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
