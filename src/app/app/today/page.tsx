import { DayForm } from '@/components/DayForm'

export default function TodayPage() {
  const today = new Date()
  const iso = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString()
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Today</h1>
      <DayForm dateISO={iso} />
    </main>
  )
}


