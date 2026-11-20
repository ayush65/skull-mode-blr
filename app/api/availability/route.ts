import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRentalAvailability } from '@/lib/availability'

export const runtime = 'nodejs'

const querySchema = z.object({
  productId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationDays: z.coerce.number().int().positive().max(365),
})

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Choose a valid rental date and duration.' }, { status: 400 })

  const result = await getRentalAvailability(parsed.data)
  if (!result) return NextResponse.json({ error: 'This console is not available in the catalog.' }, { status: 404 })
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
}
