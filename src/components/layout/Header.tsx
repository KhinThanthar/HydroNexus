import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Leaf, MapPin, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'

interface HeaderProps {
  title: string
  subtitle: string
  tags: string[]
  onOpenMenu: () => void
}

/** Dropdown listing the sample greenhouses. */
function GreenhouseSelector() {
  const { greenhouses, greenhouse, selectGreenhouse } = useApp()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Selected greenhouse: ${greenhouse.name}. Change greenhouse`}
        className="flex max-w-[220px] items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-left text-sm font-medium text-ink shadow-card transition hover:border-primary/40 sm:max-w-none"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-leaf-soft text-leaf">
          <Leaf className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate">{greenhouse.name}</span>
          <span className="block truncate text-[11px] font-normal text-muted">{greenhouse.location}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Greenhouses"
          className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-line bg-white p-1.5 shadow-pop"
        >
          {greenhouses.map((item) => {
            const selected = item.id === greenhouse.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    selectGreenhouse(item.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition ${
                    selected ? 'bg-primary-soft' : 'hover:bg-canvas'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{item.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted">Crop: {item.crop}</span>
                  </span>
                  {selected ? <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

/** Dashboard header: title, feature tags, greenhouse selector and online state. */
export function Header({ title, subtitle, tags, onOpenMenu }: HeaderProps) {
  const { greenhouse } = useApp()
  const online = greenhouse.devicesOnline === greenhouse.deviceCount

  return (
    <header className="border-b border-line bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="rounded-xl border border-line bg-white p-2.5 text-ink shadow-card transition hover:bg-canvas lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h1>
          <p className="mt-0.5 hidden text-xs text-muted sm:block">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="hidden items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted xl:inline-flex"
            >
              {tag}
            </span>
          ))}

          <GreenhouseSelector />

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              online ? 'bg-leaf-soft text-leaf' : 'bg-warning-soft text-warning'
            }`}
            role="status"
          >
            <span
              className={`relative flex h-2 w-2 ${online ? '' : 'opacity-70'}`}
              aria-hidden="true"
            >
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                  online ? 'bg-leaf' : 'bg-warning'
                }`}
              />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${online ? 'bg-leaf' : 'bg-warning'}`} />
            </span>
            {online ? 'Online' : 'Degraded'}
          </span>
        </div>
      </div>
    </header>
  )
}
