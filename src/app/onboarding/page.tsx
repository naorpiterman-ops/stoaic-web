'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

export default function OnboardingPage() {
  const [isSignup, setIsSignup] = useState(true)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if password already exists
    const hash = localStorage.getItem('stoic_password_hash')
    setIsSignup(!hash)
  }, [])

  function handleSignup() {
    setError('')

    if (!name.trim()) {
      setError('אנא הכנס שם')
      return
    }

    if (!password.trim()) {
      setError('אנא הגדר סיסמה')
      return
    }

    if (password.length < 6) {
      setError('הסיסמה צריכה להיות לפחות 6 תווים')
      return
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות לא תואמות')
      return
    }

    // Save profile
    const profile = {
      name: name.trim(),
      focusAreas: [],
      recurringThemes: [],
      currentChallenges: [],
      createdAt: Date.now(),
    }
    storage.setProfile(profile)

    // Save password
    const hash = btoa(password)
    localStorage.setItem('stoic_password_hash', hash)

    // Mark as onboarded
    storage.setOnboarded()

    router.push('/chat')
  }

  function handleLogin() {
    setError('')

    if (!password.trim()) {
      setError('אנא הכנס את הסיסמה')
      return
    }

    const hash = localStorage.getItem('stoic_password_hash')
    const inputHash = btoa(password)

    if (hash === inputHash) {
      storage.setOnboarded()
      router.push('/chat')
    } else {
      setError('סיסמה שגויה')
      setPassword('')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--paper-2)',
    border: '1px solid var(--hairline)',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 16,
    fontFamily: 'Frank Ruhl Libre, serif',
    color: 'var(--ink)',
    outline: 'none',
    direction: 'rtl',
  }

  const buttonStyle: React.CSSProperties = {
    background: 'var(--sienna)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 9999,
    padding: '14px 28px',
    fontSize: 17,
    fontFamily: 'Frank Ruhl Libre, serif',
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: 8,
    width: '100%',
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'var(--paper)' }}>
      <div style={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="text-center">
          <h1 style={{ fontFamily: 'EB Garamond, serif', fontSize: 44, color: 'var(--ink)', marginBottom: 8 }}>
            ἀρετή
          </h1>
          <p className="font-body" style={{ color: 'var(--ink-2)' }}>
            {isSignup ? 'רישום' : 'התחברות'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {isSignup && (
            <div className="flex flex-col gap-2">
              <label className="font-body-sm" style={{ color: 'var(--ink-1)' }}>שם</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="הכנס את שמך"
                style={inputStyle}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSignup()
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-body-sm" style={{ color: 'var(--ink-1)' }}>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isSignup ? 'לפחות 6 תווים' : 'הכנס את הסיסמה'}
              style={inputStyle}
              onKeyDown={e => {
                if (e.key === 'Enter') isSignup ? handleSignup() : handleLogin()
              }}
            />
          </div>

          {isSignup && (
            <div className="flex flex-col gap-2">
              <label className="font-body-sm" style={{ color: 'var(--ink-1)' }}>אימות סיסמה</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="חזור על הסיסמה"
                style={inputStyle}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSignup()
                }}
              />
            </div>
          )}

          {error && (
            <p className="font-body-sm text-center" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          )}

          <button
            onClick={isSignup ? handleSignup : handleLogin}
            style={buttonStyle}
          >
            {isSignup ? 'יצירת חשבון' : 'התחברות'}
          </button>
        </div>

        <p className="text-center font-caption" style={{ color: 'var(--ink-3)', lineHeight: 1.6 }}>
          המידע שלך מאוחסן בבטחה בדפדפן שלך בלבד. לא משודר לשום שרת.
        </p>
      </div>
    </div>
  )
}
