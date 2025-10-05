import { PrismaClient } from '@prisma/client'
import { SettingsSchema, type SettingsInput } from '@/lib/validation'

const prisma = new PrismaClient()

export const settingsRepo = {
  async get() {
    const s = await prisma.setting.findFirst()
    if (!s) return { habits: [], metrics: [] }
    return { habits: s.habits as string[], metrics: s.metrics as any[] }
  },

  async update(input: SettingsInput) {
    const data = SettingsSchema.parse(input)
    const existing = await prisma.setting.findFirst()
    if (!existing) {
      return prisma.setting.create({ data: { habits: data.habits, metrics: data.metrics } })
    }
    return prisma.setting.update({
      where: { id: existing.id },
      data: { habits: data.habits, metrics: data.metrics },
    })
  },
}


