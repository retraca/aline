import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_HABITS = [
  'Deep Work',
  'Workout',
  'THC-Free',
  'Nutrition',
  'Journal',
  'Love',
]

const DEFAULT_METRICS = [
  { name: 'Sleep', type: 'number', goal: 7.5 },
  { name: 'Energy', type: 'scale10' },
  { name: 'Emotion', type: 'scale10' },
]

function getMonthName(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(date)
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || null

  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({ data: { email: adminEmail || undefined, name: 'Owner' } })
  }

  const existingSetting = await prisma.setting.findFirst()
  const setting =
    existingSetting ||
    (await prisma.setting.create({
      data: {
        userId: user.id,
        habits: DEFAULT_HABITS,
        metrics: DEFAULT_METRICS,
      },
    }))

  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const monthName = `${getMonthName(now)} ${year}`

  let m = await prisma.month.findFirst({ where: { userId: user.id, year, month } })
  if (!m) {
    m = await prisma.month.create({
      data: {
        userId: user.id,
        year,
        month,
        name: monthName,
        config: { habits: setting.habits, metrics: setting.metrics },
      },
    })
  }

  // Pre-create days for month
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1))
  const nextMonth = new Date(Date.UTC(year, month, 1))
  const daysInMonth = Math.round((+nextMonth - +firstOfMonth) / (1000 * 60 * 60 * 24))

  for (let d = 1; d <= daysInMonth; d++) {
    const utcDate = new Date(Date.UTC(year, month - 1, d))
    const existing = await prisma.day.findFirst({ where: { monthId: m.id, date: utcDate } })
    if (!existing) {
      await prisma.day.create({
        data: {
          monthId: m.id,
          date: utcDate,
          checks: {},
          values: {},
          alignment: 0,
        },
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


