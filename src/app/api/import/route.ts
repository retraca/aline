import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { monthsRepo } from '@/lib/repos/monthsRepo'
import { daysRepo } from '@/lib/repos/daysRepo'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { days } = body as { days: { date: string; checks: any; values: any; note?: string }[] }
    if (!Array.isArray(days)) return NextResponse.json({ error: 'days array required' }, { status: 400 })

    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: 'No user' }, { status: 400 })
    const setting = await prisma.setting.findFirst()
    const config = { habits: (setting?.habits as string[]) ?? [], metrics: (setting?.metrics as any[]) ?? [] }

    for (const d of days) {
      const date = new Date(d.date)
      const year = date.getUTCFullYear()
      const month = date.getUTCMonth() + 1
      const utcMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
      const m = await monthsRepo.findOrCreate(user.id, year, month, config)
      await daysRepo.upsert({ monthId: m.id, date: utcMidnight, checks: d.checks ?? {}, values: d.values ?? {}, note: d.note, config })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid import' }, { status: 400 })
  }
}


