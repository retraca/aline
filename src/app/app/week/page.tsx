"use client"
import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { WeekSummary } from '@/components/WeekSummary'

function isoWeekOf(date: Date) {
  const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  return Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
}

export default function WeekPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getUTCFullYear())
  const [week, setWeek] = useState(isoWeekOf(now))

  const { data } = useQuery({
    queryKey: ['week', year, week],
    queryFn: async () => {
      const res = await fetch(`/api/week?year=${year}&week=${week}`)
      if (!res.ok) throw new Error('failed')
      return res.json() as Promise<{ days: any[]; averages: any }>
    },
  })

  const days = useMemo(() => (data?.days ?? []).map((d) => ({ ...d, date: new Date(d.date).toISOString() })), [data])

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Week</h1>
      <div className="flex items-center gap-3">
        <input className="bg-neutral-900 border border-neutral-700 rounded p-2 w-28" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <input className="bg-neutral-900 border border-neutral-700 rounded p-2 w-20" type="number" value={week} onChange={(e) => setWeek(Number(e.target.value))} />
      </div>
      {data && <WeekSummary days={days as any} />}
      <div className="space-y-2">
        {(days as any[]).map((d) => (
          <div key={d.date} className="rounded-md border border-neutral-700 p-3 flex items-center justify-between">
            <span>{new Date(d.date).toLocaleDateString()}</span>
            <span>{d.alignment}%</span>
          </div>
        ))}
      </div>
    </main>
  )
}


