'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (storage.isOnboarded()) {
      router.replace('/chat')
    } else {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--paper)' }}>
      <div style={{ color: 'var(--ink-3)', fontFamily: 'EB Garamond, serif', fontSize: 20 }}>
        ἀρετή
      </div>
    </div>
  )
}
