import { and, eq, gt, inArray, lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rentalBookings, rentalPricing, rentalProducts } from '@/lib/db/schema'
import { addRentalDays, isCalendarDate, todayInBengaluru } from '@/lib/rental-dates'

const blockingStatuses = [
  'awaiting_payment',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'active_rental',
  'return_scheduled',
]

export async function getRentalAvailability(input: {
  productId: string
  startDate: string
  durationDays: number
}) {
  if (
    !isCalendarDate(input.startDate) ||
    input.startDate < todayInBengaluru() ||
    !Number.isInteger(input.durationDays) ||
    input.durationDays < 1
  ) {
    return { error: 'Choose a valid rental start date and duration.' } as const
  }

  const [product] = await db
    .select({ id: rentalProducts.id, inventoryTotal: rentalProducts.inventoryTotal })
    .from(rentalProducts)
    .where(and(eq(rentalProducts.id, input.productId), eq(rentalProducts.isActive, true)))
    .limit(1)

  if (!product) return null

  const [price] = await db
    .select({ pricePaise: rentalPricing.pricePaise, depositPaise: rentalPricing.depositPaise })
    .from(rentalPricing)
    .where(
      and(
        eq(rentalPricing.productId, input.productId),
        eq(rentalPricing.durationDays, input.durationDays),
        eq(rentalPricing.isActive, true),
      ),
    )
    .limit(1)

  if (!price) return { error: 'This rental duration is not currently priced.' } as const

  const returnDate = addRentalDays(input.startDate, input.durationDays)
  const [reserved] = await db
    .select({ quantity: sql<number>`coalesce(sum(${rentalBookings.quantity}), 0)` })
    .from(rentalBookings)
    .where(
      and(
        eq(rentalBookings.productId, input.productId),
        inArray(rentalBookings.status, blockingStatuses),
        lt(rentalBookings.startDate, returnDate),
        gt(rentalBookings.returnDate, input.startDate),
      ),
    )

  const reservedQuantity = Number(reserved?.quantity ?? 0)
  const availableQuantity = product.inventoryTotal === null
    ? 0
    : Math.max(0, product.inventoryTotal - reservedQuantity)

  return {
    available: availableQuantity > 0,
    availableQuantity,
    inventoryTotal: product.inventoryTotal,
    startDate: input.startDate,
    returnDate,
    durationDays: input.durationDays,
    pricePaise: price.pricePaise,
    depositPaise: price.depositPaise,
    message:
      product.inventoryTotal === null
        ? 'Inventory has not been configured for this console yet.'
        : availableQuantity > 0
          ? 'This rental period is currently available.'
          : 'No consoles are available for those dates.',
  } as const
}
