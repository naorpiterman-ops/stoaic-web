'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Archive, Plus, Menu, X, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { storage } from '@/lib/storage'
import { characters } from '@/lib/characters'
import type { Message, Conversation } from '@/lib/types'

const iconBtn: React.CSSProperties = {
  width: 36, height: 36,
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

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
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-2 px-3`}>
      <div style={{
        maxWidth: 'min(85vw, 600px)',
        background: isUser ? 'var(--ink)' : 'var(--paper-2)',
        color: isUser ? 'var(--paper)' : 'var(--ink)',
        border: isUser ? 'none' : '1px solid var(--hairline)',
        borderRadius: 20,
        borderBottomRightRadius: isUser ? 4 : 20,
        borderBottomLeftRadius: isUser ? 20 : 4,
        padding: '10px 16px',
        fontSize: 'clamp(14px, 4vw, 17px)',
        fontFamily: 'Frank Ruhl Libre, serif',
        lineHeight: 1.55,
        wordBreak: 'break-word',
      }}>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
              em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
              ul: ({ children }) => <ul style={{ margin: '4px 0', paddingRight: 20 }}>{children}</ul>,
              li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
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

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<string>('general')
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [showMemory, setShowMemory] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCharacterMenu, setShowCharacterMenu] = useState(false)
  const [error, setError] = useState('')
  const [isPasswordLocked, setIsPasswordLocked] = useState(true)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages ?? []

  // Check password on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = localStorage.getItem('stoic_password_hash')
      if (hash) {
        setIsPasswordLocked(true)
      } else {
        setIsPasswordLocked(false)
      }
    }
  }, [])

  // Load conversations from localStorage on mount (only if unlocked)
  useEffect(() => {
    if (!isPasswordLocked && typeof window !== 'undefined') {
      const saved = storage.getConversations()
      setConversations(saved)

      if (saved.length > 0) {
        // Open the most recent conversation
        setCurrentConversationId(saved[0].id)
        setSelectedCharacter(saved[0].character || 'general')
      }
    }
  }, [isPasswordLocked])

  // Save current conversation whenever it changes
  useEffect(() => {
    if (currentConversation) {
      storage.saveConversation(currentConversation)
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setError('')

    // Create new conversation if needed
    let convId = currentConversationId
    let currentChar = selectedCharacter

    if (!convId) {
      const newId = crypto.randomUUID()
      const newConv: Conversation = {
        id: newId,
        messages: [],
        startedAt: Date.now(),
        character: currentChar,
      }
      setConversations(prev => [newConv, ...prev])
      setCurrentConversationId(newId)
      convId = newId
    }

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() }
    const next = [...messages, userMsg]

    // Update conversation with new messages
    setConversations(prev =>
      prev.map(c =>
        c.id === convId ? { ...c, messages: next } : c
      )
    )

    setInput('')
    setStreaming(true)
    setStreamText('')

    try {
      const character = characters[currentChar]
      const profile = storage.getProfile()
      const systemPrompt = character.getSystemPrompt(profile?.name)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) { setError('שגיאה בתשובה מ-Claude'); setStreaming(false); return }

      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let full = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += dec.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
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

      // Process any remaining buffer
      if (buffer) {
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6)
          if (data !== '[DONE]') {
            try {
              const { text } = JSON.parse(data)
              full += text
              setStreamText(full)
            } catch { /* skip */ }
          }
        }
      }

      const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: full, timestamp: Date.now() }
      const updated = [...next, assistantMsg]

      setConversations(prev =>
        prev.map(c =>
          c.id === convId ? { ...c, messages: updated } : c
        )
      )

      setStreamText('')
    } catch (e) {
      setError('שגיאת חיבור')
    } finally {
      setStreaming(false)
    }
  }, [input, messages, streaming, currentConversationId, selectedCharacter])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  const profile = typeof window !== 'undefined' ? storage.getProfile() : null

  // Password lock screen
  if (isPasswordLocked) {
    function checkPassword() {
      setPasswordError('')
      const hash = localStorage.getItem('stoic_password_hash')
      const inputHash = btoa(passwordInput)
      if (hash === inputHash) {
        setIsPasswordLocked(false)
      } else {
        setPasswordError('סיסמה שגויה')
        setPasswordInput('')
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'var(--paper)' }}>
        <div style={{ maxWidth: 350, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="text-center">
            <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 32, color: 'var(--ink)', marginBottom: 4 }}>
              ἀρετή
            </h1>
            <p className="font-body-sm" style={{ color: 'var(--ink-2)' }}>הכנס את הסיסמה שלך</p>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="סיסמה"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') checkPassword()
              }}
              style={{
                background: 'var(--paper-2)',
                border: '1px solid var(--hairline)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 16,
                fontFamily: 'Frank Ruhl Libre, serif',
                color: 'var(--ink)',
                outline: 'none',
                direction: 'rtl',
              }}
            />

            {passwordError && (
              <p className="font-body-sm text-center" style={{ color: 'var(--danger)' }}>
                {passwordError}
              </p>
            )}

            <button
              onClick={checkPassword}
              style={{
                background: 'var(--sienna)',
                color: 'var(--paper)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 16,
                fontFamily: 'Frank Ruhl Libre, serif',
                cursor: 'pointer',
              }}
            >
              הכנס
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col md:flex-row" style={{ background: 'var(--paper)' }}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed md:static inset-0 md:w-64 flex flex-col border-r border-hairline overflow-hidden z-40" style={{
          background: 'var(--paper-1)',
          borderRight: '1px solid var(--hairline)',
          maxWidth: '70vw',
        }}>
          <div className="p-4 border-b border-hairline flex flex-col gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCharacterMenu(!showCharacterMenu)}
                className="w-full px-3 py-2 rounded-lg font-caption text-right"
                style={{
                  background: 'var(--sienna-soft)',
                  color: 'var(--sienna)',
                  border: '1px solid var(--sienna)',
                  cursor: 'pointer',
                }}
              >
                {characters[selectedCharacter].hebrewName}
              </button>
              {showCharacterMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-paper-1 border border-hairline rounded-lg z-50 shadow-lg" style={{
                  background: 'var(--paper-1)',
                  border: '1px solid var(--hairline)',
                }}>
                  {Object.values(characters).map(char => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char.id)
                        setShowCharacterMenu(false)
                      }}
                      className="w-full text-right px-3 py-2 font-caption"
                      style={{
                        background: selectedCharacter === char.id ? 'var(--paper-2)' : 'transparent',
                        color: 'var(--ink)',
                        border: 'none',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--hairline)',
                      }}
                    >
                      {char.hebrewName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setCurrentConversationId(null)
                setSelectedCharacter('general')
                setShowCharacterMenu(false)
                setShowSidebar(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-caption"
              style={{
                background: 'var(--sienna)',
                color: 'var(--paper)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              שיחה חדשה
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-center font-caption" style={{ color: 'var(--ink-3)' }}>
                אין שיחות עדיין
              </p>
            ) : (
              conversations.map(conv => {
                const firstUserMsg = conv.messages.find(m => m.role === 'user')?.content
                const preview = firstUserMsg ? (firstUserMsg.length > 50 ? firstUserMsg.substring(0, 50) + '...' : firstUserMsg) : 'ללא הודעות'
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversationId(conv.id)
                      setSelectedCharacter(conv.character)
                      setShowSidebar(false)
                    }}
                    className="w-full text-right px-4 py-3 border-b"
                    style={{
                      background: conv.id === currentConversationId ? 'var(--paper-2)' : 'transparent',
                      borderBottom: '1px solid var(--hairline)',
                      cursor: 'pointer',
                      transition: 'background 0.16s',
                    }}
                    onMouseEnter={e => {
                      if (conv.id !== currentConversationId) {
                        (e.currentTarget as HTMLElement).style.background = 'var(--paper-2)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (conv.id !== currentConversationId) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                      }
                    }}
                  >
                    <p className="font-caption" style={{ color: 'var(--ink-2)', marginBottom: 4 }}>
                      {characters[conv.character].hebrewName}
                    </p>
                    <p className="font-body-sm" style={{ color: 'var(--ink)', lineHeight: 1.4 }}>
                      {preview}
                    </p>
                    <p className="font-overline text-xs mt-2" style={{ color: 'var(--ink-3)' }}>
                      {new Date(conv.startedAt).toLocaleDateString('he-IL')}
                    </p>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-screen w-full md:w-auto overflow-hidden" style={{ background: 'var(--paper)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 shrink-0 gap-2" style={{
          borderBottom: '1px solid var(--hairline)',
          background: 'var(--paper)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <button onClick={() => setShowSidebar(!showSidebar)} style={iconBtn}>
            {showSidebar ? <X size={18} color="var(--ink-2)" strokeWidth={1.5} /> : <Menu size={18} color="var(--ink-2)" strokeWidth={1.5} />}
          </button>

          {/* Character selector - visible on mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setShowCharacterMenu(!showCharacterMenu)}
              className="px-2 py-1 rounded-lg text-xs font-caption"
              style={{
                background: 'var(--sienna-soft)',
                color: 'var(--sienna)',
                border: '1px solid var(--sienna)',
                cursor: 'pointer',
              }}
            >
              {characters[selectedCharacter].hebrewName}
            </button>
            {showCharacterMenu && (
              <div className="absolute top-full right-0 mt-1 bg-paper-1 border border-hairline rounded-lg z-50 shadow-lg max-h-48 overflow-y-auto" style={{
                background: 'var(--paper-1)',
                border: '1px solid var(--hairline)',
                minWidth: 150,
              }}>
                {Object.values(characters).map(char => (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(char.id)
                      setShowCharacterMenu(false)
                    }}
                    className="w-full text-right px-3 py-2 font-caption text-xs"
                    style={{
                      background: selectedCharacter === char.id ? 'var(--paper-2)' : 'transparent',
                      color: 'var(--ink)',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--hairline)',
                    }}
                  >
                    {char.hebrewName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />

          <button onClick={() => setShowMemory(true)} style={iconBtn}>
            <Archive size={18} color="var(--ink-2)" strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 w-full" style={{ minHeight: 0 }}>
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
        <div className="shrink-0 px-2 md:px-3 py-2 md:py-3 flex gap-2 items-end" style={{
          borderTop: '1px solid var(--hairline)',
          background: 'var(--paper)',
          paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
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
              borderRadius: 20,
              padding: '8px 12px',
              fontSize: 'clamp(14px, 4vw, 16px)',
              fontFamily: 'Frank Ruhl Libre, serif',
              color: 'var(--ink)',
              outline: 'none',
              direction: 'rtl',
              overflowY: 'hidden',
            }}
          />

          {/* Character selector - shows icon by default, character name when selected */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowCharacterMenu(!showCharacterMenu)}
              style={{
                width: 'clamp(32px, 8vw, 40px)', height: 'clamp(32px, 8vw, 40px)',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--sienna)',
                color: 'var(--paper)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.16s',
                position: 'relative',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                overflow: 'hidden',
              }}
              title={characters[selectedCharacter]?.hebrewName || 'בחר מלווה'}
            >
              {selectedCharacter === 'general' ? (
                <User size={16} color="var(--paper)" strokeWidth={2} />
              ) : (
                <span style={{ textAlign: 'center', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: 2, paddingRight: 2 }}>
                  {characters[selectedCharacter]?.hebrewName.substring(0, 2)}
                </span>
              )}
            </button>
            {showCharacterMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-44 bg-paper-1 border border-hairline rounded-lg z-50" style={{
                background: 'var(--paper-1)',
                border: '1px solid var(--hairline)',
                boxShadow: '0 4px 12px rgba(58,40,24,0.15)',
              }}>
                {Object.values(characters).map((char, idx) => (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(char.id)
                      setShowCharacterMenu(false)
                    }}
                    className="w-full text-right px-4 py-3 font-caption"
                    style={{
                      background: selectedCharacter === char.id ? 'var(--sienna)' : 'transparent',
                      color: selectedCharacter === char.id ? 'var(--paper)' : 'var(--ink)',
                      border: 'none',
                      borderBottom: idx < Object.values(characters).length - 1 ? '1px solid var(--hairline)' : 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      transition: 'all 0.16s',
                    }}
                  >
                    {char.hebrewName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            style={{
              width: 'clamp(32px, 8vw, 40px)', height: 'clamp(32px, 8vw, 40px)',
              borderRadius: '50%',
              border: 'none',
              background: input.trim() && !streaming ? 'var(--sienna)' : 'var(--sienna-soft)',
              cursor: input.trim() && !streaming ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.16s',
            }}
          >
            <Send size={14} color="var(--paper)" strokeWidth={2} />
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
    </div>
  )
}
