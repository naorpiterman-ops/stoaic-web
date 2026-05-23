'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

const FOCUS_OPTIONS = ['כעס', 'חרדה', 'עבודה', 'יחסים', 'אובדן', 'זמן', 'מוות', 'תחושת שליטה']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(area: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(area) ? next.delete(area) : next.add(area)
      return next
    })
  }

  function finish() {
    storage.setProfile({
      name: name.trim(),
      focusAreas: [...selected],
      recurringThemes: [],
      currentChallenges: [],
      createdAt: Date.now(),
    })
    storage.setOnboarded()
    router.replace('/chat')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12"
      style={{ background: 'var(--paper)', maxWidth: 480, margin: '0 auto' }}>

      {/* Step 0 — Welcome */}
      {step === 0 && (
        <div className="flex flex-col items-center gap-8 flex-1 justify-center text-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ background: 'var(--paper-2)' }}>
            <span style={{ fontSize: 64, color: 'var(--ink-3)' }}>𓂀</span>
          </div>
          <div>
            <h1 className="font-h1" style={{ fontFamily: 'EB Garamond, serif', color: 'var(--ink)' }}>
              מלווה סטואי
            </h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: 'var(--sienna)', fontSize: 16 }}>
              ἀρετή — מצוינות אנושית
            </p>
          </div>
          <p className="font-body" style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
            האפליקציה הזו היא המלווה הסטואי האישי שלך — חכם, חם, וסוקרטי. היא לומדת אותך לאורך זמן.
          </p>
          <button onClick={() => setStep(1)} style={primaryBtn}>
            בוא נתחיל
          </button>
        </div>
      )}

      {/* Step 1 — Name */}
      {step === 1 && (
        <div className="flex flex-col gap-8 flex-1 justify-center w-full">
          <h2 className="font-h1 text-center" style={{ fontFamily: 'EB Garamond, serif', color: 'var(--ink)' }}>
            מה שמך?
          </h2>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="שם פרטי"
            className="w-full text-center font-body"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(0)} style={secondaryBtn}>חזרה</button>
            <button onClick={() => setStep(2)} disabled={!name.trim()} style={primaryBtn}>הבא</button>
          </div>
        </div>
      )}

      {/* Step 2 — Focus areas */}
      {step === 2 && (
        <div className="flex flex-col gap-6 flex-1 justify-center w-full">
          <h2 className="font-h2 text-center" style={{ fontFamily: 'EB Garamond, serif', color: 'var(--ink)' }}>
            על מה אתה עובד?
          </h2>
          <p className="text-center font-body-sm" style={{ color: 'var(--ink-2)' }}>
            בחר את התחומים שחשובים לך
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_OPTIONS.map(area => (
              <button key={area} onClick={() => toggle(area)}
                className="py-2 px-4 font-body-sm transition-all"
                style={{
                  borderRadius: 8,
                  border: `1px solid ${selected.has(area) ? 'transparent' : 'var(--hairline-strong)'}`,
                  background: selected.has(area) ? 'var(--sienna)' : 'var(--paper-2)',
                  color: selected.has(area) ? 'var(--paper)' : 'var(--ink)',
                }}>
                {area}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} style={secondaryBtn}>חזרה</button>
            <button onClick={() => setStep(3)} style={primaryBtn}>הבא</button>
          </div>
        </div>
      )}

      {/* Step 3 — Complete */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-8 flex-1 justify-center text-center">
          <div style={{ fontSize: 64 }}>🌿</div>
          <h2 className="font-h1" style={{ fontFamily: 'EB Garamond, serif', color: 'var(--ink)' }}>
            ברוך הבא, {name}
          </h2>
          <blockquote style={{ borderRight: '3px solid var(--sienna)', paddingRight: 16, textAlign: 'right' }}>
            <p className="font-body" style={{ fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.8 }}>
              לא האירועים מטרידים אותנו, אלא הדעות שלנו על האירועים.
            </p>
            <cite className="font-caption" style={{ color: 'var(--sienna)' }}>— אפיקטטוס</cite>
          </blockquote>
          <button onClick={finish} style={primaryBtn}>להתחיל</button>
        </div>
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  background: 'var(--sienna)',
  color: 'var(--paper)',
  border: 'none',
  borderRadius: 9999,
  padding: '10px 28px',
  fontSize: 17,
  fontFamily: 'Frank Ruhl Libre, serif',
  cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--ink)',
  border: '1px solid var(--hairline-strong)',
  borderRadius: 9999,
  padding: '10px 28px',
  fontSize: 17,
  fontFamily: 'Frank Ruhl Libre, serif',
  cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--paper-2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: '12px 16px',
  fontSize: 17,
  fontFamily: 'Frank Ruhl Libre, serif',
  color: 'var(--ink)',
  outline: 'none',
  direction: 'rtl',
}
