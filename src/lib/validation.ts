import { z } from 'zod'

export const MetricSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['number', 'scale10']),
  goal: z.number().optional(),
})

export const SettingsSchema = z.object({
  habits: z.array(z.string().min(1)).min(1),
  metrics: z.array(MetricSchema).min(1),
  snapshotToCurrentMonth: z.boolean().optional(),
})

export const DaySaveSchema = z.object({
  date: z.string().min(4),
  checks: z.record(z.boolean()).default({}),
  values: z.record(z.number()).default({}),
  note: z.string().optional(),
})

export type SettingsInput = z.infer<typeof SettingsSchema>
export type DaySaveInput = z.infer<typeof DaySaveSchema>


