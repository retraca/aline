"use client"
import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlignmentPill } from '@/components/AlignmentPill'
import { useToast } from '@/components/ToastProvider'
import { computeAlignment, type Config } from '@/lib/computeAlignment'

async function fetchSettings() {
  const res = await fetch('/api/settings')
  if (!res.ok) throw new Error('Failed to load settings')
  return res.json() as Promise<{ habits: string[]; metrics: any[] }>
}

export function DayForm({ dateISO }: { dateISO: string }) {
  const qc = useQueryClient()
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState<Record<string, number>>({})
  const [note, setNote] = useState('')
  const { show } = useToast()

  const cfg: Config | undefined = settings
    ? { habits: settings.habits, metrics: settings.metrics as any }
    : undefined

  const alignment = useMemo(() => (cfg ? computeAlignment(checks, values, cfg) : 0), [checks, values, cfg])

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/day/upsert', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ date: dateISO, checks, values, note }),
      })
      if (!res.ok) throw new Error('Save failed')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['month'] })
      show({ title: 'Saved', description: 'Your day was saved.', variant: 'success' })
    },
    onError: (err: any) => {
      show({ title: 'Save failed', description: err?.message ?? 'Please try again', variant: 'error' })
    },
  })

  if (!cfg) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Today</h2>
        <AlignmentPill value={alignment} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cfg.habits.map((h) => (
          <label key={h} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!checks[h]}
              onChange={(e) => setChecks((c) => ({ ...c, [h]: e.target.checked }))}
            />
            <span>{h}</span>
          </label>
        ))}
      </div>

      <div className="space-y-4">
        {['Sleep', 'Energy', 'Emotion'].map((m) => (
          <div key={m} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{m}</span>
              <span className="text-sm text-gray-400">{values[m] ?? 0}</span>
            </div>
            <input
              type="range"
              min={m === 'Sleep' ? 0 : 0}
              max={m === 'Sleep' ? 12 : 10}
              step={m === 'Sleep' ? 0.1 : 1}
              value={values[m] ?? 0}
              onChange={(e) => setValues((v) => ({ ...v, [m]: Number(e.target.value) }))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <textarea
        placeholder="Notes"
        className="w-full rounded-md bg-neutral-900 border border-neutral-700 p-3"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={() => save.mutate()}
        className="sticky bottom-4 w-full rounded-md bg-blue-600 hover:bg-blue-500 text-white py-3"
        disabled={save.isPending}
      >
        {save.isPending ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}


