import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const rentalProducts = pgTable('rental_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  edition: text('edition').notNull(),
  storage: text('storage').notNull(),
  description: text('description').notNull().default(''),
  badge: text('badge'),
  imageUrl: text('image_url').notNull(),
  inventoryTotal: integer('inventory_total'),
  controllerCount: integer('controller_count').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const rentalPricing = pgTable(
  'rental_pricing',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').notNull(),
    durationDays: integer('duration_days').notNull(),
    pricePaise: integer('price_paise').notNull(),
    depositPaise: integer('deposit_paise'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique('rental_pricing_product_duration_unique').on(table.productId, table.durationDays)],
)

export const rentalCarts = pgTable('rental_carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionHash: text('session_hash').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const rentalCartItems = pgTable(
  'rental_cart_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cartId: uuid('cart_id').notNull(),
    productId: uuid('product_id').notNull(),
    startDate: date('start_date', { mode: 'string' }).notNull(),
    durationDays: integer('duration_days').notNull(),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique('rental_cart_line_unique').on(table.cartId, table.productId, table.startDate, table.durationDays),
  ],
)

export const rentalBookings = pgTable('rental_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingCode: text('booking_code').notNull().unique(),
  sessionHash: text('session_hash').notNull(),
  productId: uuid('product_id').notNull(),
  startDate: date('start_date', { mode: 'string' }).notNull(),
  returnDate: date('return_date', { mode: 'string' }).notNull(),
  durationDays: integer('duration_days').notNull(),
  quantity: integer('quantity').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: jsonb('delivery_address').$type<Record<string, string>>().notNull(),
  subtotalPaise: integer('subtotal_paise').notNull(),
  depositPaise: integer('deposit_paise').notNull().default(0),
  deliveryPaise: integer('delivery_paise').notNull().default(0),
  totalPaise: integer('total_paise').notNull(),
  status: text('status').notNull().default('awaiting_payment'),
  paymentStatus: text('payment_status').notNull().default('unconfigured'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
