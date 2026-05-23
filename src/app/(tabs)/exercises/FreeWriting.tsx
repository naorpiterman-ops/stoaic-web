'use client'
import { useState } from 'react'
import { storage } from '@/lib/storage'

export default function FreeWriting({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: '',
          messages: [{ role: 'user', content: `נתח את הכתיבה הבאה דרך עדשה סטואית — זהה עקרונות סטואיים, דפוסים חוזרים, והצע תרגיל ספציפי אחד. כתוב 4-5 משפטים:\n\n${text}` }],
        }),
      })
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n')) {
          if (!line.startsWith('data: ') || line.slice(6) === '[DONE]') continue
          try { full += JSON.parse(line.slice(6)).text } catch { /* skip */ }
        }
      }
      setAnalysis(full)
      storage.saveExercise({ id: crypto.randomUUID(), type: 'free_writing', completedAt: Date.now(), userInput: text, claudeAnalysis: full })
    } catch { save() }
    finally { setLoading(false) }
  }

  function save() {
    storage.saveExercise({ id: crypto.randomUUID(), type: 'free_writing', completedAt: Date.now(), userInput: text })
    onBack()
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-5" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 15 }}>← חזרה</button>
      <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)' }}>מדיטציית כתיבה</h2>

      {!analysis ? (
        <>
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="כתוב בחופשיות — מחשבות, רגשות, מצב..."
            rows={10}
            style={textareaStyle}
          />
          <div className="flex gap-3 flex-wrap">
            <button onClick={save} disabled={!text.trim()} style={secondaryBtn}>שמור בלי ניתוח</button>
            <button onClick={analyze} disabled={!text.trim() || loading} style={primaryBtn}>
              {loading ? 'מנתח...' : 'נתח דרך העדשה הסטואית'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
            <p className="font-overline mb-3" style={{ color: 'var(--sienna)' }}>ניתוח סטואי</p>
            <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 17, color: 'var(--ink)', lineHeight: 1.7 }}>{analysis}</p>
          </div>
          <button onClick={onBack} style={primaryBtn}>סיום</button>
        </div>
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = { background: 'var(--sienna)', color: 'var(--paper)', border: 'none', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const textareaStyle: React.CSSProperties = { background: 'var(--paper-2)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '14px 16px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', color: 'var(--ink)', outline: 'none', direction: 'rtl', resize: 'vertical', width: '100%' }
