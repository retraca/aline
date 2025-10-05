import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { DaySaveSchema } from '@/lib/validation'
import { monthsRepo } from '@/lib/repos/monthsRepo'
import { daysRepo } from '@/lib/repos/daysRepo'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = DaySaveSchema.parse(body)

    // Single-user: fetch the first user
    const user = await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: 'No user' }, { status: 400 })

    const dLocal = new Date(input.date)
    const year = dLocal.getUTCFullYear()
    const month = dLocal.getUTCMonth() + 1
    const utcMidnight = new Date(Date.UTC(dLocal.getUTCFullYear(), dLocal.getUTCMonth(), dLocal.getUTCDate()))

    const setting = await prisma.setting.findFirst()
    const config = { habits: (setting?.habits as string[]) ?? [], metrics: (setting?.metrics as any[]) ?? [] }
    const m = await monthsRepo.findOrCreate(user.id, year, month, config)

    const day = await daysRepo.upsert({
      monthId: m.id,
      date: utcMidnight,
      checks: input.checks,
      values: input.values,
      note: input.note,
      config,
    })

    return NextResponse.json({ ok: true, day })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid request' }, { status: 400 })
  }
}


