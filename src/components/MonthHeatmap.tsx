"use client"
import React from 'react'

export function MonthHeatmap({ days }: { days: { date: string; alignment: number }[] }) {
  const byDate = new Map(days.map((d) => [d.date.slice(0, 10), d.alignment]))
  const first = new Date(days[0]?.date ?? new Date().toISOString())
  const year = first.getUTCFullYear()
  const month = first.getUTCMonth() + 1
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1))
  const nextMonth = new Date(Date.UTC(year, month, 1))
  const daysInMonth = Math.round((+nextMonth - +firstOfMonth) / (1000 * 60 * 60 * 24))
  const cells = Array.from({ length: daysInMonth }, (_, i) => new Date(Date.UTC(year, month - 1, i + 1)).toISOString().slice(0, 10))

  function color(v: number | undefined) {
    if (v == null) return 'bg-neutral-800'
    if (v >= 80) return 'bg-green-600'
    if (v >= 60) return 'bg-yellow-600'
    if (v > 0) return 'bg-red-600'
    return 'bg-neutral-800'
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((iso) => (
        <div key={iso} className={`h-8 rounded ${color(byDate.get(iso))}`} title={`${iso}: ${byDate.get(iso) ?? '-'}%`} />
      ))}
    </div>
  )
}


