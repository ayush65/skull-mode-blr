import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { getCartSnapshot } from '@/lib/cart'
import { formatINR } from '@/lib/money'

export const metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const items = await getCartSnapshot()
  const total = items.reduce((sum, item) => sum + (item.pricePaise ?? 0) * item.quantity, 0)
  const inventoryConfigured = items.length > 0 && items.every((item) => item.inventoryTotal !== null)
  const inventoryReady = inventoryConfigured && items.every((item) => (item.inventoryTotal ?? 0) > 0)

  return (
    <main className="content-page container checkout-page">
      <Link className="back-link" href="/cart"><ArrowLeft aria-hidden="true" /> Back to cart</Link>
      <div className="page-intro">
        <p className="eyebrow"><span className="eyebrow-line" /> Secure checkout</p>
        <h1>Before you <span>book.</span></h1>
        <p>Your rental selection is saved. No booking or payment is created on this page.</p>
      </div>
      {items.length === 0 ? (
        <div className="setup-notice">
          <ShieldAlert aria-hidden="true" />
          <div><h2>Your cart is empty</h2><p>Add a console and rental dates before checkout.</p></div>
          <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href="/consoles">Browse consoles</Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <section className="setup-notice" aria-live="polite">
            <ShieldAlert aria-hidden="true" />
            <div>
              <h2>{inventoryReady ? 'Payment setup is still required' : 'Checkout is not active yet'}</h2>
              <p>
                {!inventoryConfigured
                  ? 'Console inventory has not been configured, so this selection cannot be booked. No payment or reservation has been made.'
                  : !inventoryReady
                    ? 'No consoles are currently recorded as available, so this selection cannot be booked. No payment or reservation has been made.'
                    : 'Online payment has not been connected. Your selection is safe in the cart; no charge or booking has been made.'}
              </p>
            </div>
          </section>
          <aside className="cart-summary checkout-summary">
            <p className="eyebrow"><span className="eyebrow-line" /> Order summary</p>
            {items.map((item) => (
              <div className="summary-row" key={item.lineId}>
                <span>{item.name} · {item.durationDays} days</span>
                <strong>{formatINR((item.pricePaise ?? 0) * item.quantity)}</strong>
              </div>
            ))}
            <div className="summary-total"><span>Rental subtotal</span><strong>{formatINR(total)}</strong></div>
            <button className="checkout-disabled" type="button" disabled aria-describedby="checkout-blocker">Continue to payment</button>
            <p id="checkout-blocker" className="summary-note">Booking activates after inventory and a payment provider are configured.</p>
          </aside>
        </div>
      )}
    </main>
  )
}
