'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Archive } from 'lucide-react'
import { storage } from '@/lib/storage'
import { buildSystemPrompt } from '@/lib/memory'
import type { Message } from '@/lib/types'

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-4 py-3 rounded-2xl" style={{
      background: 'var(--paper-2)',
      border: '1px solid var(--hairline)',
      borderBottomLeftRadius: 4,
      display: 'inline-flex',
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--ink-3)',
          animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-2`}>
      <div style={{
        maxWidth: '78%',
        background: isUser ? 'var(--ink)' : 'var(--paper-2)',
        color: isUser ? 'var(--paper)' : 'var(--ink)',
        border: isUser ? 'none' : '1px solid var(--hairline)',
        borderRadius: 20,
        borderBottomRightRadius: isUser ? 4 : 20,
        borderBottomLeftRadius: isUser ? 20 : 4,
        padding: '10px 16px',
        fontSize: 17,
        fontFamily: 'Frank Ruhl Libre, serif',
        lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [showMemory, setShowMemory] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_messages')
      if (saved) {
        try {
          setMessages(JSON.parse(saved))
        } catch { /* skip */ }
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setError('')
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setStreaming(true)
    setStreamText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(),
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) { setError('שגיאה בתשובה מ-Claude'); setStreaming(false); return }

      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text } = JSON.parse(data)
            full += text
            setStreamText(full)
          } catch { /* skip */ }
        }
      }

      const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: full, timestamp: Date.now() }
      setMessages(prev => [...prev, assistantMsg])
      setStreamText('')
    } catch (e) {
      setError('שגיאת חיבור')
    } finally {
      setStreaming(false)
    }
  }, [input, messages, streaming])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  const profile = typeof window !== 'undefined' ? storage.getProfile() : null

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--paper)', maxWidth: 640, margin: '0 auto' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{
        borderBottom: '1px solid var(--hairline)',
        background: 'var(--paper)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => setShowMemory(true)} style={iconBtn}>
          <Archive size={20} color="var(--ink-2)" strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 17, color: 'var(--ink)' }}>
            מלווה סטואי
          </div>
          <div style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 11, color: 'var(--sienna)' }}>
            ἀρετή
          </div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center" style={{ opacity: 0.6 }}>
            <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 19, color: 'var(--ink-2)', lineHeight: 1.7 }}>
              {profile ? `שלום, ${profile.name}` : 'שלום'}
            </p>
            <p className="font-body-sm" style={{ color: 'var(--ink-3)' }}>מה עולה לך היום?</p>
          </div>
        )}
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {streaming && (
          <div className="flex justify-end mb-2">
            {streamText
              ? <Bubble msg={{ id: 'stream', role: 'assistant', content: streamText, timestamp: Date.now() }} />
              : <TypingIndicator />
            }
          </div>
        )}
        {error && <p className="text-center font-caption mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 px-3 py-3 flex gap-2 items-end" style={{
        borderTop: '1px solid var(--hairline)',
        background: 'var(--paper)',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="כתוב משהו..."
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            background: 'var(--paper-1)',
            border: '1px solid var(--hairline)',
            borderRadius: 24,
            padding: '10px 16px',
            fontSize: 17,
            fontFamily: 'Frank Ruhl Libre, serif',
            color: 'var(--ink)',
            outline: 'none',
            direction: 'rtl',
            overflowY: 'hidden',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || streaming}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: 'none',
            background: input.trim() && !streaming ? 'var(--sienna)' : 'var(--sienna-soft)',
            cursor: input.trim() && !streaming ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.16s',
          }}
        >
          <Send size={16} color="var(--paper)" strokeWidth={2} />
        </button>
      </div>

      {/* Memory drawer */}
      {showMemory && (
        <MemoryDrawer onClose={() => setShowMemory(false)} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}

function MemoryDrawer({ onClose }: { onClose: () => void }) {
  const profile = storage.getProfile()
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(58,40,24,0.4)' }} onClick={onClose}>
      <div className="rounded-t-3xl p-6 flex flex-col gap-5" style={{ background: 'var(--paper-1)', maxHeight: '75vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="mx-auto w-9 h-1 rounded-full" style={{ background: 'var(--paper-4)' }} />
        <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 24, color: 'var(--ink)' }}>זיכרון</h2>
        {profile ? (
          <>
            <MemSection title="תחומי עבודה" items={profile.focusAreas} />
            <MemSection title="נושאים חוזרים" items={profile.recurringThemes} />
            <MemSection title="אתגרים נוכחיים" items={profile.currentChallenges} />
          </>
        ) : <p style={{ color: 'var(--ink-3)' }}>אין פרופיל עדיין</p>}
      </div>
    </div>
  )
}

function MemSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
      <p className="font-overline mb-2" style={{ color: 'var(--ink-2)' }}>{title}</p>
      {items.length
        ? items.map(i => <p key={i} className="font-body-sm" style={{ color: 'var(--ink)' }}>• {i}</p>)
        : <p className="font-body-sm" style={{ color: 'var(--ink-3)' }}>אין מידע עדיין</p>
      }
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 36, height: 36,
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
