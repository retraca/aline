import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))
  const format = (searchParams.get('format') || 'json').toLowerCase()
  if (!year || !month) return NextResponse.json({ error: 'year and month required' }, { status: 400 })

  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({ error: 'No user' }, { status: 400 })

  const m = await prisma.month.findFirst({ where: { userId: user.id, year, month } })
  if (!m) return NextResponse.json({ error: 'Month not found' }, { status: 404 })
  const days = await prisma.day.findMany({ where: { monthId: m.id }, orderBy: { date: 'asc' } })

  if (format === 'csv') {
    const headers = ['date', 'alignment', 'note', 'checks', 'values']
    const rows = days.map((d) => [d.date.toISOString(), String(d.alignment), JSON.stringify(d.note ?? ''), JSON.stringify(d.checks), JSON.stringify(d.values)])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(','))].join('\n')
    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': `attachment; filename="aline-${year}-${month}.csv"`,
      },
    })
  }

  return NextResponse.json({ month: m, days })
}


