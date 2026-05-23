'use client'
import { useState } from 'react'
import { storage } from '@/lib/storage'

const SCENARIOS = [
  { title: 'יום קשה', prompt: 'דמיין שהיום שלך משתבש לגמרי — פגישה מבוטלת, עיכוב, ביקורת, תקלה. איך אתה מגיב?' },
  { title: 'יום טוב',  prompt: 'דמיין שהיום שלך טוב — הכל זורם, הצלחות קטנות. איך אתה מגיב?' },
]

export default function MorningPrep({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(['', ''])
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  function setAnswer(i: number, v: string) {
    setAnswers(a => { const n = [...a]; n[i] = v; return n })
  }

  async function getAnalysis() {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: '',
          messages: [{ role: 'user', content: `כתוב תגובה סטואית קצרה (3-4 משפטים) למה שאני כתבתי:\n\nתרחיש 1 (יום קשה): ${answers[0]}\nתרחיש 2 (יום טוב): ${answers[1]}` }],
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
      setStep(3)
    } catch { saveAndBack() }
    finally { setLoading(false) }
  }

  function saveAndBack() {
    storage.saveExercise({ id: crypto.randomUUID(), type: 'morning_prep', completedAt: Date.now(), userInput: `תרחיש 1: ${answers[0]}\nתרחיש 2: ${answers[1]}`, claudeAnalysis: analysis || undefined })
    onBack()
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-6" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 15 }}>← חזרה</button>
      <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)' }}>תרגול בוקר</h2>

      {step < 2 && (
        <>
          <div className="p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
            <p className="font-overline mb-2" style={{ color: 'var(--sienna)' }}>{SCENARIOS[step].title}</p>
            <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 19, color: 'var(--ink)', lineHeight: 1.7 }}>{SCENARIOS[step].prompt}</p>
          </div>
          <textarea autoFocus value={answers[step]} onChange={e => setAnswer(step, e.target.value)} placeholder="כתוב את תגובתך..." rows={5} style={textareaStyle} />
          <div className="flex justify-between">
            {step > 0 && <button onClick={() => setStep(0)} style={secondaryBtn}>הקודם</button>}
            <div style={{ flex: 1 }} />
            <button onClick={() => step === 0 ? setStep(1) : setStep(2)} style={primaryBtn}>הבא</button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 items-center flex-1 justify-center text-center">
          <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 19, color: 'var(--ink)' }}>רוצה לקבל משוב סטואי?</p>
          <button onClick={getAnalysis} disabled={loading} style={primaryBtn}>
            {loading ? 'מנתח...' : 'קבל משוב סטואי'}
          </button>
          <button onClick={saveAndBack} style={secondaryBtn}>דלג וסיים</button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
            <p className="font-overline mb-2" style={{ color: 'var(--sienna)' }}>ניתוח סטואי</p>
            <p style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: 17, color: 'var(--ink)', lineHeight: 1.7 }}>{analysis}</p>
          </div>
          <button onClick={saveAndBack} style={primaryBtn}>סיום</button>
        </div>
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = { background: 'var(--sienna)', color: 'var(--paper)', border: 'none', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', borderRadius: 9999, padding: '10px 28px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const textareaStyle: React.CSSProperties = { background: 'var(--paper-2)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '12px 16px', fontSize: 17, fontFamily: 'Frank Ruhl Libre, serif', color: 'var(--ink)', outline: 'none', direction: 'rtl', resize: 'vertical', width: '100%' }
