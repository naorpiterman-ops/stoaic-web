'use client'
import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { getDailyQuote } from '@/lib/quotes'
import type { StoicQuote } from '@/lib/types'

export default function DailyPage() {
  const [quote, setQuote] = useState<StoicQuote | null>(null)

  useEffect(() => { setQuote(getDailyQuote()) }, [])

  return (
    <div className="px-5 py-8 flex flex-col gap-8" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div className="text-center">
        <p className="font-overline" style={{ color: 'var(--ink-2)' }}>
          {new Date().toLocaleDateString('he-IL', { weekday: 'long' })}
        </p>
        <p className="font-caption" style={{ color: 'var(--ink-3)', marginTop: 2 }}>
          {new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>
      </div>

      <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 28, color: 'var(--ink)', textAlign: 'center' }}>
        קריאה יומית
      </h1>

      {/* Quote card */}
      {quote && (
        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{
          background: 'var(--paper-1)',
          border: '1px solid var(--hairline)',
          boxShadow: '0 2px 8px rgba(58,40,24,0.10)',
        }}>
          <div className="flex gap-4">
            {/* Sienna left border */}
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
            {quote.book && quote.chapter && (
              <p className="font-caption" style={{ color: 'var(--ink-3)' }}>
                ספר {quote.book}, פרק {quote.chapter}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {quote.tags.map(tag => (
              <span key={tag} className="font-caption px-2 py-0.5 rounded-full" style={{
                background: 'var(--sienna-soft)',
                color: 'var(--sienna-2)',
                opacity: 0.8,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={() => setQuote(getDailyQuote())}
        className="flex items-center justify-center gap-2 mx-auto font-body-sm"
        style={{ background: 'none', border: 'none', color: 'var(--sienna)', cursor: 'pointer', padding: '8px 16px' }}
      >
        <RefreshCw size={14} />
        ציטוט אחר
      </button>
    </div>
  )
}
