"use client"
import React from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

export function WeekSummary({ days }: { days: { date: string; alignment: number; values: any }[] }) {
  const sleepData = days.map((d) => ({ x: d.date, y: Number((d.values ?? {})['Sleep'] ?? 0) }))
  const alignData = days.map((d) => ({ x: d.date, y: d.alignment }))
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, n) => a + n, 0) / arr.length) : 0)
  const avgAlignment = avg(days.map((d) => d.alignment))
  const avgSleep = ((): number => {
    const vals = days.map((d) => Number((d.values ?? {})['Sleep'] ?? 0)).filter((n) => !Number.isNaN(n))
    return vals.length ? Number((vals.reduce((a, n) => a + n, 0) / vals.length).toFixed(2)) : 0
  })()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-md border border-neutral-700 p-3">
        <div className="text-sm text-neutral-400">Avg Alignment</div>
        <div className="text-2xl font-semibold">{avgAlignment}%</div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alignData}>
              <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-md border border-neutral-700 p-3">
        <div className="text-sm text-neutral-400">Avg Sleep</div>
        <div className="text-2xl font-semibold">{avgSleep}h</div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepData}>
              <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-md border border-neutral-700 p-3">
        <div className="text-sm text-neutral-400">Workouts</div>
        <div className="text-2xl font-semibold">{days.filter((d) => (d as any).checks?.['Workout']).length}</div>
      </div>
    </div>
  )
}


