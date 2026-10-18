import { NavLink } from 'react-router-dom'
import {
  Activity,
  Bell,
  Bot,
  History,
  LayoutDashboard,
  Lightbulb,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Logo } from '../common/Logo'
import { GreenhouseIllustration, MediaSlot } from '../common/GreenhouseIllustration'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: number
}

/** Navigation model shared by the sidebar and the mobile drawer. */
export function useNavItems(): NavItem[] {
  const { unreadAlertCount } = useApp()
  return [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/monitoring', label: 'Monitoring', icon: Activity },
    { to: '/alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
    { to: '/assistant', label: 'Assistant (LLM)', icon: Bot },
    { to: '/history', label: 'History', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const items = useNavItems()
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white shadow-[0_6px_16px_rgba(21,85,245,0.28)]'
                : 'text-muted hover:bg-primary-soft hover:text-primary'
            }`
          }
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
          {item.badge ? (
            <span
              className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-[11px] font-semibold text-white"
              aria-label={`${item.badge} unread`}
            >
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  const { greenhouse } = useApp()
  return (
    <div className="mt-auto space-y-2 border-t border-line/70 p-3">
      <MediaSlot label={`Photo of ${greenhouse.name}`}>
        <GreenhouseIllustration className="h-20 w-full" />
      </MediaSlot>
      <div>
        <p className="truncate text-[13px] font-semibold text-ink">{greenhouse.name}</p>
        <p className="truncate text-[11px] text-muted">{greenhouse.location}</p>
      </div>
    </div>
  )
}

/** Desktop sidebar — fixed width, always visible from `lg` up. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-line bg-white lg:flex">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <Logo />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-ink">HydroNexus</p>
          <p className="truncate text-[11px] text-muted">Smart Hydroponics</p>
        </div>
      </div>
      <NavList />
      <SidebarFooter />
    </aside>
  )
}

/** Mobile/tablet drawer rendered by the AppShell. */
export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-pop"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <p className="text-[15px] font-bold text-ink">HydroNexus</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavList onNavigate={onClose} />
        <SidebarFooter />
      </div>
    </div>
  )
}
