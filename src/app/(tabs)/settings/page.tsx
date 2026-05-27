'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile } from '@/lib/types'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [apiKey, setApiKey] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [challengeText, setChallengeText] = useState('')

  useEffect(() => {
    setApiKey(storage.getApiKey())
    const p = storage.getProfile()
    setProfile(p)
    setChallengeText(p?.currentChallenges.join('\n') ?? '')
  }, [])

  function saveKey() {
    storage.setApiKey(apiKey)
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  function saveChallenges() {
    if (!profile) return
    const updated = { ...profile, currentChallenges: challengeText.split('\n').map(s => s.trim()).filter(Boolean) }
    storage.setProfile(updated)
    setProfile(updated)
  }

  return (
    <div className="px-5 py-8 flex flex-col gap-6" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 28, color: 'var(--ink)' }}>{t('settingsTitle')}</h1>

      {/* API Key */}
      <Section title={t('claudeAPIKey')}>
        <p className="font-body-sm" style={{ color: 'var(--ink-2)', marginBottom: 8 }}>
          {t('apiKeyInfo')}
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder={t('apiKeyPlaceholder')}
          style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.05em' }}
        />
        <button onClick={saveKey} style={{ ...primaryBtn, marginTop: 8 }}>
          {keySaved ? t('saved2') : t('save2')}
        </button>
      </Section>

      {/* Language */}
      <Section title={t('language')}>
        <div className="flex gap-2">
          {[{ v: 'he' as const, label: t('hebrew') }, { v: 'en' as const, label: t('english') }].map(({ v, label }) => (
            <button key={v} onClick={() => setLanguage(v)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid',
                borderColor: language === v ? 'transparent' : 'var(--hairline-strong)',
                background: language === v ? 'var(--sienna)' : 'var(--paper-2)',
                color: language === v ? 'var(--paper)' : 'var(--ink)',
                fontFamily: 'Frank Ruhl Libre, serif', fontSize: 16, cursor: 'pointer',
              }}>
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Profile */}
      {profile && (
        <Section title={t('myProfile')}>
          <InfoRow label={t('nameLabel')} value={profile.name} />
          <InfoRow label={t('focusAreas')} value={profile.focusAreas.join(', ') || '—'} />
          <InfoRow label={t('recurringThemes')} value={profile.recurringThemes.join(', ') || t('notDetected')} />
          <div className="mt-3">
            <label className="font-body-sm" style={{ color: 'var(--ink-1)', display: 'block', marginBottom: 6 }}>
              {t('currentChallenges')}
            </label>
            <textarea value={challengeText} onChange={e => setChallengeText(e.target.value)} rows={3} style={textareaStyle} />
            <button onClick={saveChallenges} style={{ ...secondaryBtn, marginTop: 8, fontSize: 15 }}>{t('update')}</button>
          </div>
        </Section>
      )}

      {/* About */}
      <Section title={t('about')}>
        <InfoRow label={t('version')} value="1.0.0" />
        <p className="font-caption" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
          {t('aboutText')}
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ background: 'var(--paper-2)', border: '1px solid var(--hairline)' }}>
      <p className="font-overline" style={{ color: 'var(--ink-2)' }}>{title}</p>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="font-body-sm" style={{ color: 'var(--ink-2)' }}>{label}</span>
      <span className="font-body-sm" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}

const primaryBtn: React.CSSProperties = { background: 'var(--sienna)', color: 'var(--paper)', border: 'none', borderRadius: 9999, padding: '10px 24px', fontSize: 16, fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const secondaryBtn: React.CSSProperties = { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', borderRadius: 9999, padding: '8px 20px', fontFamily: 'Frank Ruhl Libre, serif', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '10px 14px', fontSize: 16, color: 'var(--ink)', outline: 'none', width: '100%', direction: 'ltr' }
const textareaStyle: React.CSSProperties = { background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8, padding: '10px 12px', fontSize: 16, fontFamily: 'Frank Ruhl Libre, serif', color: 'var(--ink)', outline: 'none', direction: 'rtl', resize: 'vertical', width: '100%' }
