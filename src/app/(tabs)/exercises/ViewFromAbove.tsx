'use client'
import { useState } from 'react'
import { storage } from '@/lib/storage'

const STEPS = [
  'אתה יוצא מהגוף שלך ומסתכל על עצמך מהצד — בלי שיפוטיות, בלי הזדהות.',
  'לאט לאט אתה עולה למעלה — רואה את החדר, את הבניין.',
  'אתה רואה את הרחוב, את העיר.',
  'אתה רואה את המדינה, את היבשת.',
  'אתה רואה את הכדור הארץ מרחוק, את היקום — ומבין כמה קטן אתה ביחס לעולם.',
  'לאט לאט אתה חוזר — ליקום, ליבשת, למדינה, לעיר, לבית שלך.',
  'אתה חוזר לגוף שלך. מה אתה מרגיש עכשיו?',
]

export default function ViewFromAbove({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0)
  const [reflection, setReflection] = useState('')
  const [done, setDone] = useState(false)

  function save() {
    storage.saveExercise({ id: crypto.randomUUID(), type: 'view_from_above', completedAt: Date.now(), userInput: reflection })
    setDone(true)
    setTimeout(onBack, 900)
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-8" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 15 }}>
        ← חזרה
      </button>
      <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)' }}>מבט מעל</h2>

      {step < STEPS.length - 1 ? (
        <>
          {/* Progress */}
          <div className="flex gap-1">
            {STEPS.slice(0, -1).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? 'var(--sienna)' : 'var(--paper-3)', transition: 'background 0.3s' }} />
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 19, color: 'var(--ink)', lineHeight: 1.7, textAlign: 'center' }}>
              {STEPS[step]}
            </p>
          </div>

          {/* Breath dot */}
          <div className="flex justify-center">
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sienna-soft)', opacity: 0.4, animation: 'breathe 4s ease-in-out infinite' }} />
          </div>

          <div className="flex justify-between">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} style={secondaryBtn}>הקודם</button>}
            <div style={{ flex: 1 }} />
            <button onClick={() => setStep(s => s + 1)} style={primaryBtn}>הבא</button>
          </div>
        </>
      ) : (
        <>
          <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 19, color: 'var(--ink)' }}>{STEPS[STEPS.length - 1]}</p>
          <textarea
            autoFocus
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="כתוב כאן..."
            rows={5}
            style={textareaStyle}
          />
          {done && <p style={{ color: 'var(--success)', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>נשמר ✓</p>}
          <button onClick={save} disabled={!reflection.trim()} style={primaryBtn}>שמור וסיים</button>
        </>
      )}

      <style>{`@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }`}</style>
    </div>
  )
}

const primaryBtn: React.CSSProperties = { background: 'var(--sienna)', color: 'var(--paper)', border: 'none', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const textareaStyle: React.CSSProperties = { background: 'var(--paper-2)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '12px 16px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', color: 'var(--ink)', outline: 'none', direction: 'rtl', resize: 'vertical', width: '100%' }
