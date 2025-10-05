import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function startOfISOWeek(date: Date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay() || 7
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1))
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export const statsRepo = {
  async week(userId: string, year: number, weekNo: number) {
    // Approx: get Jan-4, then add (weekNo-1)*7 days to get week start
    const jan4 = new Date(Date.UTC(year, 0, 4))
    const weekStart = new Date(jan4)
    weekStart.setUTCDate(jan4.getUTCDate() + (weekNo - 1) * 7)
    const start = startOfISOWeek(weekStart)
    const end = new Date(start)
    end.setUTCDate(start.getUTCDate() + 7)

    const months = await prisma.month.findMany({ where: { userId, year: { in: [start.getUTCFullYear(), end.getUTCFullYear()] } } })
    const monthIds = months.map((m) => m.id)
    const days = await prisma.day.findMany({
      where: { monthId: { in: monthIds }, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
    })

    const avgAlignment = days.length ? Math.round(days.reduce((a, d) => a + d.alignment, 0) / days.length) : 0
    const avgSleep = ((): number => {
      const sleeps = days.map((d) => Number((d.values as any)?.['Sleep'] ?? 0)).filter((n) => !Number.isNaN(n))
      return sleeps.length ? Number((sleeps.reduce((a, n) => a + n, 0) / sleeps.length).toFixed(2)) : 0
    })()

    return { days, averages: { alignment: avgAlignment, sleep: avgSleep } }
  },

  async month(userId: string, year: number, month: number) {
    const m = await prisma.month.findFirst({ where: { userId, year, month } })
    if (!m) return { days: [], averages: { alignment: 0, sleep: 0 } }
    const days = await prisma.day.findMany({ where: { monthId: m.id }, orderBy: { date: 'asc' } })
    const avgAlignment = days.length ? Math.round(days.reduce((a, d) => a + d.alignment, 0) / days.length) : 0
    const sleeps = days.map((d) => Number((d.values as any)?.['Sleep'] ?? 0)).filter((n) => !Number.isNaN(n))
    const avgSleep = sleeps.length ? Number((sleeps.reduce((a, n) => a + n, 0) / sleeps.length).toFixed(2)) : 0
    return { month: m, days, averages: { alignment: avgAlignment, sleep: avgSleep } }
  },
}


