'use client'
import { useState } from 'react'
import { Moon, PenLine, Sparkles, ChevronLeft } from 'lucide-react'
import EveningReview from './EveningReview'
import EveningReviewHistory from './EveningReviewHistory'
import FreeWriting from './FreeWriting'
import WeeklyChallenge from './WeeklyChallenge'

const exercises = [
  { id: 'free_writing',    title: 'כתיבה חופשית', subtitle: 'כתיבה דרך עדשה סטואית', Icon: PenLine },
  { id: 'evening_review',  title: 'סיכום יום', subtitle: 'חשבון נפש בסגנון מרקוס', Icon: Moon },
  { id: 'weekly_challenge', title: 'אתגר שבועי', subtitle: 'אתגר סטואי חדש כל שבוע', Icon: Sparkles },
]

export default function ExercisesPage() {
  const [active, setActive] = useState<string | null>(null)

  if (active === 'evening_review')      return <EveningReview onBack={() => setActive(null)} onShowHistory={() => setActive('evening_review_history')} />
  if (active === 'evening_review_history') return <EveningReviewHistory onBack={() => setActive('evening_review')} />
  if (active === 'free_writing')        return <FreeWriting onBack={() => setActive(null)} />
  if (active === 'weekly_challenge')    return <WeeklyChallenge onBack={() => setActive(null)} />

  return (
    <div className="px-5 py-8 flex flex-col gap-4" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>
        תרגול
      </h1>
      {exercises.map(({ id, title, subtitle, Icon }) => (
        <button key={id} onClick={() => setActive(id)}
          className="flex items-center gap-4 p-4 rounded-xl text-right w-full"
          style={{
            background: 'var(--paper-2)',
            border: '1px solid var(--hairline)',
            boxShadow: '0 1px 2px rgba(58,40,24,0.08)',
            cursor: 'pointer',
          }}>
          <div className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 44, height: 44, background: 'rgba(139,69,19,0.12)' }}>
            <Icon size={22} color="var(--sienna)" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-h3" style={{ fontFamily: 'EB Garamond, serif', color: 'var(--ink)' }}>{title}</p>
            <p className="font-body-sm" style={{ color: 'var(--ink-2)' }}>{subtitle}</p>
          </div>
          <ChevronLeft size={16} color="var(--ink-3)" />
        </button>
      ))}
    </div>
  )
}
