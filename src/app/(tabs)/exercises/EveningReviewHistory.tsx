'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { storage } from '@/lib/storage'

interface ReviewEntry {
  date: Date
  good: string
  challenge: string
  tomorrow: string
}

export default function EveningReviewHistory({ onBack }: { onBack: () => void }) {
  const [reviews, setReviews] = useState<ReviewEntry[]>([])

  useEffect(() => {
    const exercises = storage.getExercises()
    const thirty_days_ago = Date.now() - 30 * 24 * 60 * 60 * 1000

    const reviews_map = new Map<string, ReviewEntry>()

    exercises
      .filter(e => e.type === 'evening_review' && e.completedAt >= thirty_days_ago)
      .forEach(e => {
        const date = new Date(e.completedAt)
        const key = date.toDateString()
        if (!reviews_map.has(key)) {
          try {
            const d = JSON.parse(e.userInput ?? '{}')
            reviews_map.set(key, {
              date,
              good: d.good ?? '',
              challenge: d.challenge ?? '',
              tomorrow: d.tomorrow ?? '',
            })
          } catch { /* ignore */ }
        }
      })

    const sorted = Array.from(reviews_map.values()).sort((a, b) => b.date.getTime() - a.date.getTime())
    setReviews(sorted)
  }, [])

  const formatDate = (d: Date) => d.toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 gap-5" style={{ background: 'var(--paper)', maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--ink-2)', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 15 }}>← חזרה</button>

      <div>
        <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 26, color: 'var(--ink)' }}>היסטוריית סיכומים</h2>
        <p className="font-caption" style={{ color: 'var(--ink-3)' }}>30 הימים האחרונים</p>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--ink-3)', textAlign: 'center', padding: '20px 0' }}>אין סיכומים עדיין</p>
        ) : (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 p-4 rounded-xl"
              style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
              <p className="font-body-sm" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>
                {formatDate(review.date)}
              </p>

              {review.good && (
                <div className="flex flex-col gap-1">
                  <label className="font-caption" style={{ color: 'var(--ink-2)' }}>דבר טוב שעשיתי היום</label>
                  <p style={{ color: 'var(--ink)', lineHeight: 1.6, fontSize: 15 }}>{review.good}</p>
                </div>
              )}

              {review.challenge && (
                <div className="flex flex-col gap-1">
                  <label className="font-caption" style={{ color: 'var(--ink-2)' }}>דבר שפחות הצלחתי בו</label>
                  <p style={{ color: 'var(--ink)', lineHeight: 1.6, fontSize: 15 }}>{review.challenge}</p>
                </div>
              )}

              {review.tomorrow && (
                <div className="flex flex-col gap-1">
                  <label className="font-caption" style={{ color: 'var(--ink-2)' }}>מה אעשה מחר כדי להשתפר</label>
                  <p style={{ color: 'var(--ink)', lineHeight: 1.6, fontSize: 15 }}>{review.tomorrow}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
