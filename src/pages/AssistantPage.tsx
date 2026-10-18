import { Info } from 'lucide-react'
import { ChatPanel } from '../components/assistant/ChatPanel'

/** Full-page conversational assistant. */
export function AssistantPage() {
  return (
    <div className="space-y-4">
      <ChatPanel tall />
      <p className="flex items-start gap-2 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          This assistant is a frontend simulation: replies are selected by local keyword rules, and no data
          leaves your browser. The reply engine is isolated in <code className="rounded bg-white px-1 py-0.5">src/utils/assistant.ts</code>,
          so a real LLM endpoint can be connected later without changing the interface.
        </span>
      </p>
    </div>
  )
}
