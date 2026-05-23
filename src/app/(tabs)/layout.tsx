import BottomNav from '@/components/BottomNav'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--paper)' }}>
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  )
}
