import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { statsRepo } from '@/lib/repos/statsRepo'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))
  if (!year || !month) return NextResponse.json({ error: 'year and month required' }, { status: 400 })

  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({ error: 'No user' }, { status: 400 })

  const data = await statsRepo.month(user.id, year, month)
  return NextResponse.json(data)
}


