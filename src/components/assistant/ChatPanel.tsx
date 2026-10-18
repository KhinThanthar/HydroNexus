import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Trash2, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SUGGESTED_PROMPTS, SUGGESTED_PROMPT_QUESTIONS } from '../../utils/assistant'
import { Card, CardHeader } from '../common/Card'

const MAX_LENGTH = 500

interface ChatPanelProps {
  /** Taller layout for the dedicated assistant page. */
  tall?: boolean
  showHeader?: boolean
}

/** Conversational assistant panel backed by local keyword rules. */
export function ChatPanel({ tall = false, showHeader = true }: ChatPanelProps) {
  const { messages, sendMessage, isTyping, clearChat } = useApp()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Keep the newest message in view.
  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, isTyping])

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Please type a message before sending.')
      return
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Messages are limited to ${MAX_LENGTH} characters in this demo.`)
      return
    }
    setError('')
    setDraft('')
    sendMessage(trimmed)
  }

  return (
    <Card label="LLM assistant" className="flex min-h-0 flex-col" padding={showHeader ? 'none' : 'md'}>
      {showHeader ? (
        <div className="px-5 pt-5">
          <CardHeader
            title="LLM Assistant"
            subtitle="Frontend simulation — replies come from local rules"
            icon={<Bot className="h-4 w-4 text-primary" aria-hidden="true" />}
            action={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-2.5 py-1 text-xs font-medium text-leaf">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
                  </span>
                  Online
                </span>
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                  className="rounded-lg p-1.5 text-muted transition hover:bg-canvas hover:text-ink"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            }
          />
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 ${tall ? 'max-h-none' : 'max-h-[360px]'}`}
        aria-live="polite"
      >
        <ul ref={listRef} className="space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === 'user' ? 'bg-primary text-white' : 'bg-leaf-soft text-leaf'
                }`}
                aria-hidden="true"
              >
                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-left text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-tr-sm bg-primary text-white'
                      : 'rounded-tl-sm bg-canvas text-ink'
                  }`}
                >
                  {message.content}
                </div>
                <p className="mt-1 px-1 text-[10px] text-muted">
                  {new Date(message.at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </li>
          ))}
          {isTyping ? (
            <li className="flex gap-2.5" aria-label="Assistant is typing">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-leaf">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-canvas px-3.5 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                    style={{ animationDelay: `${delay}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="border-t border-line px-5 py-3">
        <p className="mb-2 text-[11px] font-medium text-muted">Suggested topics</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => submit(SUGGESTED_PROMPT_QUESTIONS[topic])}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
            >
              {topic}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit(draft)
          }}
          className="flex items-end gap-2"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="assistant-input" className="sr-only">
              Ask the assistant a question
            </label>
            <textarea
              id="assistant-input"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                if (error) setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  submit(draft)
                }
              }}
              rows={1}
              placeholder="Ask about pH, EC, DO, devices…"
              maxLength={MAX_LENGTH + 50}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'assistant-error' : undefined}
              className="max-h-28 w-full resize-none rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none"
            />
            {error ? (
              <p id="assistant-error" className="mt-1 text-xs text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-strong disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </Card>
  )
}
