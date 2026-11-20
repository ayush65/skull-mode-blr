import { createHash, randomBytes } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { rentalCartItems, rentalCarts, rentalPricing, rentalProducts } from '@/lib/db/schema'

const CART_COOKIE = 'skullmode_cart'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function hashSession(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function getGuestCart(create = false) {
  const cookieStore = await cookies()
  let token = cookieStore.get(CART_COOKIE)?.value

  if (!token && !create) return null

  if (!token) {
    token = randomBytes(32).toString('base64url')
    cookieStore.set(CART_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
      path: '/',
      maxAge: CART_COOKIE_MAX_AGE,
    })
  }

  const sessionHash = hashSession(token)
  const [existing] = await db
    .select({ id: rentalCarts.id, sessionHash: rentalCarts.sessionHash })
    .from(rentalCarts)
    .where(eq(rentalCarts.sessionHash, sessionHash))
    .limit(1)

  if (existing) return existing
  if (!create) return null

  const [cart] = await db
    .insert(rentalCarts)
    .values({ sessionHash })
    .onConflictDoUpdate({
      target: rentalCarts.sessionHash,
      set: { updatedAt: new Date() },
    })
    .returning({ id: rentalCarts.id, sessionHash: rentalCarts.sessionHash })

  return cart
}

export async function getCartSnapshot() {
  const cart = await getGuestCart()
  if (!cart) return []

  return db
    .select({
      lineId: rentalCartItems.id,
      productId: rentalProducts.id,
      slug: rentalProducts.slug,
      name: rentalProducts.name,
      edition: rentalProducts.edition,
      storage: rentalProducts.storage,
      imageUrl: rentalProducts.imageUrl,
      inventoryTotal: rentalProducts.inventoryTotal,
      startDate: rentalCartItems.startDate,
      durationDays: rentalCartItems.durationDays,
      quantity: rentalCartItems.quantity,
      pricePaise: rentalPricing.pricePaise,
      depositPaise: rentalPricing.depositPaise,
    })
    .from(rentalCartItems)
    .innerJoin(rentalProducts, eq(rentalProducts.id, rentalCartItems.productId))
    .leftJoin(
      rentalPricing,
      and(
        eq(rentalPricing.productId, rentalCartItems.productId),
        eq(rentalPricing.durationDays, rentalCartItems.durationDays),
        eq(rentalPricing.isActive, true),
      ),
    )
    .where(eq(rentalCartItems.cartId, cart.id))
}

export async function getCartCount() {
  const items = await getCartSnapshot()
  return items.reduce((total, item) => total + item.quantity, 0)
}
