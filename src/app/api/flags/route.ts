import { NextResponse } from 'next/server'
import { FLAGS } from '@/lib/flags'

export async function GET() {
  return NextResponse.json(FLAGS)
}


