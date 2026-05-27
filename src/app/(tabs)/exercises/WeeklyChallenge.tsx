'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { weeklyChallengess } from '@/lib/challenges'
import { storage } from '@/lib/storage'

interface WeekState {
  weekId: number
  challengeId: string
  startDate: number
  completedDays: number[]
}

export default function WeeklyChallenge({ onBack }: { onBack: () => void }) {
  const [challenge, setChallenge] = useState<typeof weeklyChallengess[0] | null>(null)
  const [weekState, setWeekState] = useState<WeekState | null>(null)
  const [completedDays, setCompletedDays] = useState<number[]>([])

  const getWeekId = () => Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))

  useEffect(() => {
    const weekId = getWeekId()
    const stored = localStorage.getItem(`weekly_challenge_${weekId}`)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const ch = weeklyChallengess.find(c => c.id === parsed.challengeId)
        if (ch) {
          setChallenge(ch)
          setWeekState(parsed)
          setCompletedDays(parsed.completedDays || [])
        }
      } catch { /* ignore */ }
    } else {
      const randomChallenge = weeklyChallengess[Math.floor(Math.random() * weeklyChallengess.length)]
      const newState: WeekState = {
        weekId,
        challengeId: randomChallenge.id,
        startDate: Date.now(),
        completedDays: [],
      }
      localStorage.setItem(`weekly_challenge_${weekId}`, JSON.stringify(newState))
      setChallenge(randomChallenge)
      setWeekState(newState)
      setCompletedDays([])
    }
  }, [])

  function toggleDayCompletion(dayIndex: number) {
    if (!weekState) return
    const updated = completedDays.includes(dayIndex)
      ? completedDays.filter(d => d !== dayIndex)
      : [...completedDays, dayIndex]
    setCompletedDays(updated)
    const newState = { ...weekState, completedDays: updated }
    localStorage.setItem(`weekly_challenge_${weekState.weekId}`, JSON.stringify(newState))
    storage.saveExercise({
      id: crypto.randomUUID(),
      type: 'weekly_challenge',
      completedAt: Date.now(),
      userInput: JSON.stringify(newState),
    })
  }

  const days = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-5" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 15 }}>← חזרה</button>

      {challenge ? (
        <>
          <div>
            <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)', marginBottom: 4 }}>
              {challenge.title}
            </h2>
            <p className="font-body-sm" style={{ color: 'var(--ink-2)' }}>{challenge.description}</p>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
            <p className="font-body-sm" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>עקוב אחר ההתקדמות שלך</p>
            <div className="flex gap-2 justify-end">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDayCompletion(idx)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: `2px solid ${completedDays.includes(idx) ? 'var(--sienna)' : 'var(--hairline)'}`,
                    background: completedDays.includes(idx) ? 'var(--sienna)' : 'var(--paper)',
                    color: completedDays.includes(idx) ? 'var(--paper)' : 'var(--ink)',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: 'var(--ink)' }}>הוראות</h3>
            <ol style={{ listStylePosition: 'inside', color: 'var(--ink)', lineHeight: 1.8, direction: 'rtl' }}>
              {challenge.instructions.map((instr, idx) => (
                <li key={idx} className="font-body" style={{ color: 'var(--ink)', marginBottom: 12 }}>
                  {instr}
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--ink-3)' }}>טוען...</p>
      )}
    </div>
  )
}
