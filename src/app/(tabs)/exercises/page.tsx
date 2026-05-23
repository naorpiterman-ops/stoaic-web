'use client'
import { useState } from 'react'
import { Eye, Sun, Moon, PenLine, ChevronLeft } from 'lucide-react'
import ViewFromAbove from './ViewFromAbove'
import MorningPrep from './MorningPrep'
import EveningReview from './EveningReview'
import FreeWriting from './FreeWriting'

const exercises = [
  { id: 'view_from_above', title: 'מבט מעל', subtitle: 'תרגיל ויזואליזציה סטואי', Icon: Eye },
  { id: 'morning_prep',    title: 'תרגול בוקר', subtitle: 'הכנה לפי אפיקטטוס', Icon: Sun },
  { id: 'evening_review',  title: 'סיכום יום', subtitle: 'חשבון נפש בסגנון מרקוס', Icon: Moon },
  { id: 'free_writing',    title: 'מדיטציית כתיבה', subtitle: 'כתיבה חופשית דרך עדשה סטואית', Icon: PenLine },
]

export default function ExercisesPage() {
  const [active, setActive] = useState<string | null>(null)

  if (active === 'view_from_above') return <ViewFromAbove onBack={() => setActive(null)} />
  if (active === 'morning_prep')    return <MorningPrep onBack={() => setActive(null)} />
  if (active === 'evening_review')  return <EveningReview onBack={() => setActive(null)} />
  if (active === 'free_writing')    return <FreeWriting onBack={() => setActive(null)} />

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
