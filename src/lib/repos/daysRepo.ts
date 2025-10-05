import { PrismaClient } from '@prisma/client'
import { computeAlignment } from '@/lib/computeAlignment'

const prisma = new PrismaClient()

export const daysRepo = {
  async upsert(params: {
    monthId: string
    date: Date
    checks: Record<string, boolean>
    values: Record<string, number>
    note?: string
    config: { habits: string[]; metrics: { name: string; type: 'number' | 'scale10'; goal?: number }[] }
  }) {
    const alignment = computeAlignment(params.checks, params.values, params.config)
    const existing = await prisma.day.findFirst({ where: { monthId: params.monthId, date: params.date } })
    if (existing) {
      return prisma.day.update({
        where: { id: existing.id },
        data: { checks: params.checks, values: params.values, note: params.note, alignment },
      })
    }
    return prisma.day.create({
      data: {
        monthId: params.monthId,
        date: params.date,
        checks: params.checks,
        values: params.values,
        note: params.note,
        alignment,
      },
    })
  },
}


