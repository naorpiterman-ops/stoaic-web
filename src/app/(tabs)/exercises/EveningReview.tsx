'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

export default function EveningReview({ onBack, onShowHistory }: { onBack: () => void; onShowHistory?: () => void }) {
  const [good, setGood] = useState('')
  const [challenge, setChallenge] = useState('')
  const [tomorrow, setTomorrow] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const existing = storage.getExercises().find(e => e.type === 'evening_review' && new Date(e.completedAt).toDateString() === today)
    if (existing) {
      try {
        const d = JSON.parse(existing.userInput ?? '{}')
        setGood(d.good ?? ''); setChallenge(d.challenge ?? ''); setTomorrow(d.tomorrow ?? '')
      } catch { /* ignore */ }
    }
  }, [])

  function save() {
    const input = JSON.stringify({ good, challenge, tomorrow })
    storage.saveExercise({ id: crypto.randomUUID(), type: 'evening_review', completedAt: Date.now(), userInput: input })
    setSaved(true)
    setTimeout(onBack, 800)
  }

  const FIELDS = [
    { label: 'דבר טוב שעשיתי היום', value: good, set: setGood },
    { label: 'דבר שפחות הצלחתי בו', value: challenge, set: setChallenge },
    { label: 'מה אעשה מחר כדי להשתפר', value: tomorrow, set: setTomorrow },
  ]

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-5" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <div className="flex justify-between items-center">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', fontSize: 15 }}>← חזרה</button>
        {onShowHistory && (
          <button onClick={onShowHistory} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', fontSize: 15, textDecoration: 'underline' }}>היסטוריה</button>
        )}
      </div>
      <div>
        <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)' }}>סיכום יום</h2>
        <p className="font-caption" style={{ color: 'var(--ink-3)' }}>{new Date().toLocaleDateString('he-IL')}</p>
      </div>

      {FIELDS.map(({ label, value, set }) => (
        <div key={label} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
          <label className="font-body-sm" style={{ color: 'var(--ink-1)' }}>{label}</label>
          <textarea value={value} onChange={e => set(e.target.value)} rows={3} style={{ ...textareaStyle, background: 'var(--paper)' }} />
        </div>
      ))}

      {saved && <p style={{ color: 'var(--success)', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>נשמר ✓</p>}
      <button onClick={save} disabled={!good && !challenge && !tomorrow} style={primaryBtn}>שמור</button>
    </div>
  )
}

const primaryBtn: React.CSSProperties = { background: 'var(--sienna)', color: 'var(--paper)', border: 'none', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const textareaStyle: React.CSSProperties = { background: 'var(--paper-2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '10px 12px', fontSize: 16, fontFamily: 'Frank Ruhl Libre, serif', color: 'var(--ink)', outline: 'none', direction: 'rtl', resize: 'vertical', width: '100%' }
