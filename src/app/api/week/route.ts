import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { statsRepo } from '@/lib/repos/statsRepo'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get('year'))
  const week = Number(searchParams.get('week'))
  if (!year || !week) return NextResponse.json({ error: 'year and week required' }, { status: 400 })

  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({ error: 'No user' }, { status: 400 })

  const data = await statsRepo.week(user.id, year, week)
  return NextResponse.json(data)
}


