import { and, asc, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rentalPricing, rentalProducts } from '@/lib/db/schema'

export type RentalProductView = {
  id: string
  slug: string
  name: string
  edition: string
  storage: string
  description: string
  badge: string | null
  imageUrl: string
  inventoryTotal: number | null
  controllerCount: number
  pricing: Array<{ durationDays: number; pricePaise: number; depositPaise: number | null }>
}

export async function getProducts(options: { query?: string; featuredOnly?: boolean; slug?: string } = {}) {
  const predicates = [eq(rentalProducts.isActive, true)]
  const search = options.query?.trim()

  if (search) {
    const pattern = `%${search}%`
    predicates.push(
      or(
        ilike(rentalProducts.name, pattern),
        ilike(rentalProducts.edition, pattern),
        ilike(rentalProducts.storage, pattern),
      )!,
    )
  }

  if (options.featuredOnly) predicates.push(eq(rentalProducts.isFeatured, true))
  if (options.slug) predicates.push(eq(rentalProducts.slug, options.slug))

  const rows = await db
    .select({
      id: rentalProducts.id,
      slug: rentalProducts.slug,
      name: rentalProducts.name,
      edition: rentalProducts.edition,
      storage: rentalProducts.storage,
      description: rentalProducts.description,
      badge: rentalProducts.badge,
      imageUrl: rentalProducts.imageUrl,
      inventoryTotal: rentalProducts.inventoryTotal,
      controllerCount: rentalProducts.controllerCount,
      durationDays: rentalPricing.durationDays,
      pricePaise: rentalPricing.pricePaise,
      depositPaise: rentalPricing.depositPaise,
    })
    .from(rentalProducts)
    .leftJoin(
      rentalPricing,
      and(eq(rentalPricing.productId, rentalProducts.id), eq(rentalPricing.isActive, true)),
    )
    .where(and(...predicates))
    .orderBy(desc(rentalProducts.isFeatured), asc(rentalProducts.name), asc(rentalPricing.durationDays))

  const products = new Map<string, RentalProductView>()

  for (const row of rows) {
    let product = products.get(row.id)
    if (!product) {
      product = {
        id: row.id,
        slug: row.slug,
        name: row.name,
        edition: row.edition,
        storage: row.storage,
        description: row.description,
        badge: row.badge,
        imageUrl: row.imageUrl,
        inventoryTotal: row.inventoryTotal,
        controllerCount: row.controllerCount,
        pricing: [],
      }
      products.set(row.id, product)
    }

    if (row.durationDays !== null && row.pricePaise !== null) {
      product.pricing.push({
        durationDays: row.durationDays,
        pricePaise: row.pricePaise,
        depositPaise: row.depositPaise,
      })
    }
  }

  return [...products.values()]
}

export async function getProductBySlug(slug: string) {
  const [product] = await getProducts({ slug })
  return product ?? null
}
