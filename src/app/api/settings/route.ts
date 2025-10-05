import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { SettingsSchema } from '@/lib/validation'

const prisma = new PrismaClient()

export async function GET() {
  const s = await prisma.setting.findFirst()
  return NextResponse.json({
    habits: (s?.habits as any) ?? [],
    metrics: (s?.metrics as any) ?? [],
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = SettingsSchema.parse(body)
    const existing = await prisma.setting.findFirst()
    const setting = existing
      ? await prisma.setting.update({ where: { id: existing.id }, data: { habits: input.habits, metrics: input.metrics } })
      : await prisma.setting.create({ data: { habits: input.habits, metrics: input.metrics } })

    if (input.snapshotToCurrentMonth) {
      const user = await prisma.user.findFirst()
      if (user) {
        const now = new Date()
        const year = now.getUTCFullYear()
        const month = now.getUTCMonth() + 1
        const monthRec = await prisma.month.findFirst({ where: { userId: user.id, year, month } })
        if (monthRec) {
          await prisma.month.update({ where: { id: monthRec.id }, data: { config: { habits: setting.habits, metrics: setting.metrics } } })
        }
      }
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid input' }, { status: 400 })
  }
}


