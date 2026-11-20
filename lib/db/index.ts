import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForPg = globalThis as typeof globalThis & { rentalPool?: Pool }

export const pool =
  globalForPg.rentalPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'production' ? 5 : 3,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg.rentalPool = pool
}

export const db = drizzle(pool, { schema })
