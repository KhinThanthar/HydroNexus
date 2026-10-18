import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { AlertItem, AppSettings, ChatMessage, Greenhouse, Recommendation } from '../types'
import { DEFAULT_GREENHOUSE_ID, GREENHOUSES } from '../data/mockGreenhouses'
import { MOCK_ALERTS } from '../data/mockAlerts'
import { MOCK_RECOMMENDATIONS } from '../data/mockRecommendations'
import { OPENING_MESSAGE, generateReply } from '../utils/assistant'
import { createId } from '../utils/format'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface AppContextValue {
  /** All sample greenhouses. */
  greenhouses: Greenhouse[]
  /** Currently selected greenhouse (drives every panel). */
  greenhouse: Greenhouse
  selectGreenhouse: (id: string) => void

  alerts: AlertItem[]
  unreadAlertCount: number
  markAlertRead: (id: string) => void
  markAllAlertsRead: () => void
  resetAlerts: () => void

  recommendations: Recommendation[]
  completeRecommendation: (id: string) => void
  reopenRecommendation: (id: string) => void

  messages: ChatMessage[]
  sendMessage: (text: string) => void
  isTyping: boolean
  clearChat: () => void

  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void

  /** Re-seed every piece of demo state. */
  resetDemoData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const DEFAULT_SETTINGS: AppSettings = {
  units: 'celsius',
  refreshInterval: 5,
  notifications: true,
  autoMarkRead: false,
}

function seedMessages(): ChatMessage[] {
  return [
    {
      id: createId('msg'),
      role: OPENING_MESSAGE.role,
      content: OPENING_MESSAGE.content,
      at: Date.now() - 1000 * 60 * 6,
    },
    {
      id: createId('msg'),
      role: 'user',
      content: 'Why is my pH dropping quickly?',
      at: Date.now() - 1000 * 60 * 5,
    },
    {
      id: createId('msg'),
      role: 'assistant',
      content: generateReply('ph').text,
      at: Date.now() - 1000 * 60 * 5 + 1200,
    },
  ]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [greenhouseId, setGreenhouseId] = useLocalStorage<string>(
    'hydroneus:greenhouse',
    DEFAULT_GREENHOUSE_ID,
  )
  const [readAlertIds, setReadAlertIds] = useLocalStorage<string[]>('hydroneus:readAlerts', ['alert-4', 'alert-6', 'alert-8'])
  const [completedRecIds, setCompletedRecIds] = useLocalStorage<string[]>(
    'hydroneus:completedRecs',
    MOCK_RECOMMENDATIONS.filter((r) => r.status === 'done').map((r) => r.id),
  )
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('hydroneus:chat', seedMessages())
  const [settings, setSettings] = useLocalStorage<AppSettings>('hydroneus:settings', DEFAULT_SETTINGS)
  const [isTyping, setIsTyping] = useLocalStorage<boolean>('hydroneus:typing', false)

  const greenhouse = useMemo(
    () => GREENHOUSES.find((g) => g.id === greenhouseId) ?? GREENHOUSES[0],
    [greenhouseId],
  )

  const selectGreenhouse = useCallback(
    (id: string) => {
      setGreenhouseId(id)
      if (settings.autoMarkRead) {
        setReadAlertIds(MOCK_ALERTS.filter((a) => a.greenhouseId === id).map((a) => a.id))
      }
    },
    [setGreenhouseId, setReadAlertIds, settings.autoMarkRead],
  )

  const alerts = useMemo(
    () =>
      MOCK_ALERTS.filter((a) => a.greenhouseId === greenhouse.id)
        .map((a) => ({ ...a, read: readAlertIds.includes(a.id) }))
        .sort((a, b) => a.minutesAgo - b.minutesAgo),
    [greenhouse.id, readAlertIds],
  )

  const unreadAlertCount = alerts.filter((a) => !a.read).length

  const markAlertRead = useCallback(
    (id: string) => {
      setReadAlertIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    },
    [setReadAlertIds],
  )

  const markAllAlertsRead = useCallback(() => {
    setReadAlertIds(MOCK_ALERTS.filter((a) => a.greenhouseId === greenhouse.id).map((a) => a.id))
  }, [setReadAlertIds, greenhouse.id])

  const resetAlerts = useCallback(() => {
    setReadAlertIds(['alert-4', 'alert-6', 'alert-8'])
  }, [setReadAlertIds])

  const recommendations = useMemo(
    () =>
      MOCK_RECOMMENDATIONS.filter((r) => r.greenhouseId === greenhouse.id).map((r) => ({
        ...r,
        status: completedRecIds.includes(r.id) ? ('done' as const) : ('active' as const),
      })),
    [greenhouse.id, completedRecIds],
  )

  const completeRecommendation = useCallback(
    (id: string) => {
      setCompletedRecIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    },
    [setCompletedRecIds],
  )

  const reopenRecommendation = useCallback(
    (id: string) => {
      setCompletedRecIds((prev) => prev.filter((item) => item !== id))
    },
    [setCompletedRecIds],
  )

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const userMessage: ChatMessage = {
        id: createId('msg'),
        role: 'user',
        content: trimmed,
        at: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      // Simulated "thinking" delay. Replace with a real LLM call later.
      window.setTimeout(() => {
        const reply = generateReply(trimmed)
        setMessages((prev) => [
          ...prev,
          { id: createId('msg'), role: 'assistant', content: reply.text, at: Date.now() },
        ])
        setIsTyping(false)
      }, 900)
    },
    [setMessages, setIsTyping],
  )

  const clearChat = useCallback(() => {
    setMessages(seedMessages())
    setIsTyping(false)
  }, [setMessages, setIsTyping])

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }))
    },
    [setSettings],
  )

  const resetDemoData = useCallback(() => {
    setGreenhouseId(DEFAULT_GREENHOUSE_ID)
    setReadAlertIds(['alert-4', 'alert-6', 'alert-8'])
    setCompletedRecIds(
      MOCK_RECOMMENDATIONS.filter((r) => r.status === 'done').map((r) => r.id),
    )
    setMessages(seedMessages())
    setSettings(DEFAULT_SETTINGS)
    setIsTyping(false)
  }, [setGreenhouseId, setReadAlertIds, setCompletedRecIds, setMessages, setSettings, setIsTyping])

  const value: AppContextValue = {
    greenhouses: GREENHOUSES,
    greenhouse,
    selectGreenhouse,
    alerts,
    unreadAlertCount,
    markAlertRead,
    markAllAlertsRead,
    resetAlerts,
    recommendations,
    completeRecommendation,
    reopenRecommendation,
    messages,
    sendMessage,
    isTyping,
    clearChat,
    settings,
    updateSettings,
    resetDemoData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
