import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getMonthName(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(date)
}

export const monthsRepo = {
  async findOrCreate(userId: string, year: number, month: number, config?: any) {
    let m = await prisma.month.findFirst({ where: { userId, year, month } })
    if (m) return m
    const name = `${getMonthName(new Date(Date.UTC(year, month - 1, 1)))} ${year}`
    m = await prisma.month.create({ data: { userId, year, month, name, config: config ?? {} } })
    // generate days skeleton
    const firstOfMonth = new Date(Date.UTC(year, month - 1, 1))
    const nextMonth = new Date(Date.UTC(year, month, 1))
    const daysInMonth = Math.round((+nextMonth - +firstOfMonth) / (1000 * 60 * 60 * 24))
    await prisma.$transaction(
      Array.from({ length: daysInMonth }, (_, i) =>
        prisma.day.create({
          data: { monthId: m!.id, date: new Date(Date.UTC(year, month - 1, i + 1)), checks: {}, values: {}, alignment: 0 },
        }),
      ),
    )
    return m
  },
}


