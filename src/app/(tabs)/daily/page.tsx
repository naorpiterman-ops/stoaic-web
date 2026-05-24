'use client'
import { useState, useEffect } from 'react'
import { RefreshCw, Volume2, Save, Trash2, Globe } from 'lucide-react'
import { getDailyQuote } from '@/lib/quotes'
import { getDailyReading } from '@/lib/daily-readings'
import type { StoicQuote } from '@/lib/types'
import type { DailyReading } from '@/lib/daily-readings'

interface Note {
  id: string
  text: string
  timestamp: number
}

export default function DailyPage() {
  const [quote, setQuote] = useState<StoicQuote | null>(null)
  const [reading, setReading] = useState<DailyReading | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [isReading, setIsReading] = useState(false)
  const [language, setLanguage] = useState<'he' | 'en'>('he')

  useEffect(() => {
    setQuote(getDailyQuote())
    const r = getDailyReading()
    setReading(r)

    // Load notes from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`notes_${r.id}`)
      if (saved) setNotes(JSON.parse(saved))
    }
  }, [])

  const saveNote = () => {
    if (!newNote.trim() || !reading) return

    const note: Note = {
      id: crypto.randomUUID(),
      text: newNote,
      timestamp: Date.now(),
    }

    const updated = [...notes, note]
    setNotes(updated)
    localStorage.setItem(`notes_${reading.id}`, JSON.stringify(updated))
    setNewNote('')
  }

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    if (reading) localStorage.setItem(`notes_${reading.id}`, JSON.stringify(updated))
  }

  const speakText = (text: string) => {
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'he' ? 'he-IL' : 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setIsReading(false)
      window.speechSynthesis.speak(utterance)
      setIsReading(true)
    }
  }

  const currentExcerpt = reading ? reading.excerpt[language] : ''

  return (
    <div className="flex h-screen" style={{ background: 'var(--paper)', maxWidth: 1200, margin: '0 auto' }}>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6" style={{ borderRight: '1px solid var(--hairline)' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="font-overline" style={{ color: 'var(--ink-2)' }}>
              {new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { weekday: 'long' })}
            </p>
            <p className="font-caption" style={{ color: 'var(--ink-3)', marginTop: 2 }}>
              {new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            style={{
              background: 'var(--sienna-soft)',
              border: 'none',
              color: 'var(--sienna)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {language === 'he' ? 'EN' : 'עברית'}
          </button>
        </div>

        <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 28, color: 'var(--ink)', textAlign: 'center' }}>
          {language === 'he' ? 'קריאה יומית' : 'Daily Reading'}
        </h1>

        {/* Quote card */}
        {quote && (
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{
            background: 'var(--paper-1)',
            border: '1px solid var(--hairline)',
            boxShadow: '0 2px 8px rgba(58,40,24,0.10)',
          }}>
            <div className="flex gap-4">
              <div style={{ width: 3, borderRadius: 99, background: 'var(--sienna)', flexShrink: 0 }} />
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontStyle: 'italic',
                fontSize: 22,
                lineHeight: 1.7,
                color: 'var(--ink)',
              }}>
                {quote.hebrewText}
              </p>
            </div>
            <div className="text-left flex flex-col gap-0.5" style={{ borderTop: '1px solid var(--hairline)', paddingTop: 16 }}>
              <p className="font-body-sm" style={{ color: 'var(--ink-1)', fontFamily: 'EB Garamond, serif' }}>
                {quote.author}
              </p>
              <p className="font-caption" style={{ color: 'var(--ink-2)' }}>{quote.source}</p>
            </div>
            <button
              onClick={() => setQuote(getDailyQuote())}
              className="flex items-center justify-center gap-2 font-body-sm"
              style={{ background: 'none', border: 'none', color: 'var(--sienna)', cursor: 'pointer', padding: '8px 0' }}
            >
              <RefreshCw size={14} />
              {language === 'he' ? 'ציטוט אחר' : 'Another quote'}
            </button>
          </div>
        )}

        {/* Reading section */}
        {reading && (
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{
            background: 'var(--paper-1)',
            border: '1px solid var(--hairline)',
          }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 style={{ fontSize: 20, color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>
                  {reading.title}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                  {reading.author} — {reading.source}
                </p>
              </div>
              <button
                onClick={() => speakText(currentExcerpt)}
                style={{
                  background: isReading ? 'var(--sienna)' : 'var(--sienna-soft)',
                  border: 'none',
                  color: isReading ? 'var(--paper)' : 'var(--sienna)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Volume2 size={18} strokeWidth={1.5} />
              </button>
            </div>

            <p
              style={{
                fontFamily: 'Frank Ruhl Libre, serif',
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--ink)',
                whiteSpace: 'pre-wrap',
                userSelect: 'text',
              }}
            >
              {currentExcerpt}
            </p>

            {/* Note input */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 8 }}>
                {language === 'he' ? 'הוסף הערה' : 'Add a note'}
              </p>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={language === 'he' ? 'כתוב הערה...' : 'Write a note...'}
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: '10px 12px',
                  background: 'var(--paper)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 8,
                  fontFamily: 'Frank Ruhl Libre, serif',
                  fontSize: 14,
                  color: 'var(--ink)',
                  direction: language === 'he' ? 'rtl' : 'ltr',
                  resize: 'none',
                }}
              />
              <button
                onClick={saveNote}
                disabled={!newNote.trim()}
                style={{
                  marginTop: 8,
                  padding: '8px 16px',
                  background: newNote.trim() ? 'var(--sienna)' : 'var(--sienna-soft)',
                  color: 'var(--paper)',
                  border: 'none',
                  borderRadius: 6,
                  cursor: newNote.trim() ? 'pointer' : 'default',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Save size={14} />
                {language === 'he' ? 'שמור הערה' : 'Save note'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes sidebar */}
      <div className="w-64 overflow-y-auto px-5 py-8 flex flex-col gap-4" style={{ borderLeft: '1px solid var(--hairline)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase' }}>
          {language === 'he' ? 'הערות' : 'Notes'} ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', opacity: 0.6 }}>
            {language === 'he' ? 'אין הערות עדיין' : 'No notes yet'}
          </p>
        ) : (
          notes.map((note, idx) => (
            <div
              key={note.id}
              style={{
                background: 'var(--paper-2)',
                border: '1px solid var(--hairline)',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div className="flex items-start gap-2">
                <span style={{
                  minWidth: 24,
                  height: 24,
                  background: 'var(--sienna)',
                  color: 'var(--paper)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--ink)',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}>
                    {note.text}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: 'var(--ink-3)',
                    marginTop: 4,
                  }}>
                    {new Date(note.timestamp).toLocaleTimeString(language === 'he' ? 'he-IL' : 'en-US')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                style={{
                  marginTop: 8,
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Trash2 size={12} />
                {language === 'he' ? 'מחק' : 'Delete'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
