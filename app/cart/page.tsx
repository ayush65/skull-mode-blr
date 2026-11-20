import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { RemoveCartItem } from '@/components/cart-controls'
import { buttonVariants } from '@/components/ui/button'
import { getCartSnapshot } from '@/lib/cart'
import { addRentalDays, formatRentalDate } from '@/lib/rental-dates'
import { formatINR } from '@/lib/money'

export const metadata = { title: 'Your rental cart' }

export default async function CartPage() {
  const items = await getCartSnapshot()
  const subtotal = items.reduce((sum, item) => sum + (item.pricePaise ?? 0) * item.quantity, 0)

  return (
    <main className="content-page container cart-page">
      <div className="page-intro">
        <p className="eyebrow"><span className="eyebrow-line" /> Your selection</p>
        <h1>Rental <span>cart.</span></h1>
        <p>Selections are saved to this browser using a private, anonymous cart session.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon"><ShoppingBag aria-hidden="true" /></span>
          <h2>Your cart is ready for a console.</h2>
          <p>Explore the rental catalog and save a console with your preferred start date.</p>
          <Link className={buttonVariants({ size: 'lg' })} href="/consoles">Browse consoles <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {items.map((item) => (
              <article className="cart-line" key={item.lineId}>
                <Link className="cart-line-image" href={`/consoles/${item.slug}`}>
                  <Image src={item.imageUrl} alt={`Illustrative render of ${item.name} ${item.edition} console`} width={240} height={240} />
                </Link>
                <div className="cart-line-copy">
                  <p className="product-kicker">{item.edition} <span aria-hidden="true">·</span> {item.storage}</p>
                  <h2><Link href={`/consoles/${item.slug}`}>{item.name}</Link></h2>
                  <p className="cart-line-dates">{formatRentalDate(item.startDate)} – {formatRentalDate(addRentalDays(item.startDate, item.durationDays))} <span>({item.durationDays} days)</span></p>
                  <p className="cart-stock-note">{item.inventoryTotal === null ? 'Inventory has not been configured; checkout is unavailable.' : item.inventoryTotal === 0 ? 'No consoles are currently available for booking.' : 'Availability will be confirmed before booking.'}</p>
                  <RemoveCartItem lineId={item.lineId} />
                </div>
                <strong className="cart-line-price">{formatINR((item.pricePaise ?? 0) * item.quantity)}</strong>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow"><span className="eyebrow-line" /> Summary</p>
            <div className="summary-row"><span>Rental subtotal</span><strong>{formatINR(subtotal)}</strong></div>
            <div className="summary-row summary-muted"><span>Delivery &amp; deposit</span><span>Confirmed before booking</span></div>
            <div className="summary-total"><span>Estimated rental total</span><strong>{formatINR(subtotal)}</strong></div>
            <p className="summary-note">This is a saved selection, not a booking. Inventory, delivery coverage, and final charges are checked before payment.</p>
            <Link className={buttonVariants({ size: 'lg', className: 'checkout-link' })} href="/checkout">Continue to checkout <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
          </aside>
        </div>
      )}
    </main>
  )
}
