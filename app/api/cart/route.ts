import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rentalCartItems, rentalPricing, rentalProducts } from '@/lib/db/schema'
import { getGuestCart } from '@/lib/cart'
import { isCalendarDate, todayInBengaluru } from '@/lib/rental-dates'

export const runtime = 'nodejs'

const addSchema = z.object({
  productId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationDays: z.number().int().positive().max(365),
})

const removeSchema = z.object({ lineId: z.string().uuid() })

export async function POST(request: Request) {
  const parsed = addSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || !isCalendarDate(parsed.data?.startDate ?? '') || parsed.data.startDate < todayInBengaluru()) {
    return NextResponse.json({ error: 'Choose a valid rental date and duration.' }, { status: 400 })
  }

  const [product] = await db
    .select({ id: rentalProducts.id, inventoryTotal: rentalProducts.inventoryTotal })
    .from(rentalProducts)
    .where(and(eq(rentalProducts.id, parsed.data.productId), eq(rentalProducts.isActive, true)))
    .limit(1)
  if (!product) return NextResponse.json({ error: 'This console is not available in the catalog.' }, { status: 404 })

  const [price] = await db
    .select({ id: rentalPricing.id })
    .from(rentalPricing)
    .where(
      and(
        eq(rentalPricing.productId, product.id),
        eq(rentalPricing.durationDays, parsed.data.durationDays),
        eq(rentalPricing.isActive, true),
      ),
    )
    .limit(1)
  if (!price) return NextResponse.json({ error: 'This rental duration is not currently priced.' }, { status: 400 })

  const cart = await getGuestCart(true)
  if (!cart) return NextResponse.json({ error: 'The cart could not be created.' }, { status: 500 })

  await db
    .insert(rentalCartItems)
    .values({
      cartId: cart.id,
      productId: product.id,
      startDate: parsed.data.startDate,
      durationDays: parsed.data.durationDays,
      quantity: 1,
    })
    .onConflictDoNothing()

  return NextResponse.json({
    ok: true,
    inventoryConfigured: product.inventoryTotal !== null,
    message: product.inventoryTotal === null
      ? 'Selection saved, but inventory is not configured and checkout remains unavailable.'
      : product.inventoryTotal === 0
        ? 'Selection saved, but no consoles are currently available.'
        : 'Selection saved. Inventory is rechecked before booking.',
  }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE(request: Request) {
  const parsed = removeSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'This cart item is invalid.' }, { status: 400 })

  const cart = await getGuestCart()
  if (!cart) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 404 })

  await db
    .delete(rentalCartItems)
    .where(and(eq(rentalCartItems.id, parsed.data.lineId), eq(rentalCartItems.cartId, cart.id)))

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
