'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, MessageCircle, Dumbbell, Settings } from 'lucide-react'

const tabs = [
  { href: '/daily',     label: 'קריאה יומית', Icon: BookOpen },
  { href: '/chat',      label: 'שיחה',         Icon: MessageCircle },
  { href: '/exercises', label: 'תרגול',         Icon: Dumbbell },
  { href: '/settings',  label: 'הגדרות',        Icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex"
      style={{
        background: 'var(--paper)',
        borderTop: '1px solid var(--hairline)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-opacity"
            style={{ color: active ? 'var(--sienna)' : 'var(--ink-3)', textDecoration: 'none' }}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span className="font-caption" style={{ fontSize: 11 }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
