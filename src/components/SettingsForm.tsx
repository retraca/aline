"use client"
import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

async function fetchSettings() {
  const res = await fetch('/api/settings')
  if (!res.ok) throw new Error('Failed to load settings')
  return res.json() as Promise<{ habits: string[]; metrics: any[] }>
}

export function SettingsForm() {
  const { data } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
  const [habits, setHabits] = useState<string[]>(data?.habits ?? ['Deep Work', 'Workout', 'THC-Free', 'Nutrition', 'Journal', 'Love'])
  const [sleepGoal, setSleepGoal] = useState<number>(7.5)

  const save = useMutation({
    mutationFn: async () => {
      const metrics = [
        { name: 'Sleep', type: 'number', goal: sleepGoal },
        { name: 'Energy', type: 'scale10' },
        { name: 'Emotion', type: 'scale10' },
      ]
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ habits, metrics }),
      })
      if (!res.ok) throw new Error('Save failed')
      return res.json()
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Habits</h2>
        <div className="space-y-2">
          {habits.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded-md bg-neutral-900 border border-neutral-700 p-2"
                value={h}
                onChange={(e) => setHabits((arr) => arr.map((x, idx) => (idx === i ? e.target.value : x)))}
              />
              <button className="px-2 border border-neutral-700 rounded" onClick={() => setHabits((arr) => arr.filter((_, idx) => idx !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button className="mt-2 px-3 py-1 border border-neutral-700 rounded" onClick={() => setHabits((arr) => [...arr, 'New Habit'])}>
            Add Habit
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Sleep Goal (hours)</h2>
        <input
          type="number"
          className="rounded-md bg-neutral-900 border border-neutral-700 p-2"
          value={sleepGoal}
          step={0.1}
          onChange={(e) => setSleepGoal(Number(e.target.value))}
        />
      </div>

      <button onClick={() => save.mutate()} className="rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-2">
        Save Settings
      </button>
    </div>
  )
}


