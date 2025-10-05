"use client"
import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MonthHeatmap } from '@/components/MonthHeatmap'

export default function MonthPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getUTCFullYear())
  const [month, setMonth] = useState(now.getUTCMonth() + 1)

  const { data } = useQuery({
    queryKey: ['month', year, month],
    queryFn: async () => {
      const res = await fetch(`/api/month?year=${year}&month=${month}`)
      if (!res.ok) throw new Error('failed')
      return res.json() as Promise<{ month: any; days: any[]; averages: any }>
    },
  })

  const days = useMemo(() => (data?.days ?? []).map((d) => ({ ...d, date: new Date(d.date).toISOString() })), [data])

  const exportJson = () => {
    window.location.href = `/api/export?year=${year}&month=${month}&format=json`
  }
  const exportCsv = () => {
    window.location.href = `/api/export?year=${year}&month=${month}&format=csv`
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Month</h1>
      <div className="flex items-center gap-3">
        <input className="bg-neutral-900 border border-neutral-700 rounded p-2 w-28" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <input className="bg-neutral-900 border border-neutral-700 rounded p-2 w-20" type="number" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
      </div>
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-neutral-700 p-3">
              <div className="text-sm text-neutral-400">Avg Alignment</div>
              <div className="text-2xl font-semibold">{data.averages?.alignment ?? 0}%</div>
            </div>
            <div className="rounded-md border border-neutral-700 p-3">
              <div className="text-sm text-neutral-400">Avg Sleep</div>
              <div className="text-2xl font-semibold">{data.averages?.sleep ?? 0}h</div>
            </div>
          </div>
          <MonthHeatmap days={days as any} />
        </>
      )}
      <div className="flex gap-3">
        <button className="rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2" onClick={exportJson}>
          Export JSON
        </button>
        <button className="rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
    </main>
  )
}


