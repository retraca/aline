import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center gap-4 p-4">
          <Link className="hover:underline" href="/app/today">Today</Link>
          <Link className="hover:underline" href="/app/week">Week</Link>
          <Link className="hover:underline" href="/app/month">Month</Link>
          <div className="flex-1" />
          <Link className="hover:underline" href="/settings">Settings</Link>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  )
}


