export type Habit = string

export type Metric = {
  name: string
  type: 'number' | 'scale10'
  goal?: number
}

export type DayPayload = {
  date: string // ISO date string (local day), will be normalized to UTC midnight
  checks: Record<string, boolean>
  values: Record<string, number>
  note?: string
}


