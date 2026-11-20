import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Gamepad2, ShieldCheck, Truck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import type { RentalProductView } from '@/lib/products'

const trustPoints = [
  { label: 'Doorstep delivery', icon: Truck },
  { label: 'Safe & insured', icon: ShieldCheck },
  { label: 'Latest games', icon: Gamepad2 },
]

export function StorefrontHome({ products }: { products: RentalProductView[] }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Premium gaming console rentals</p>
            <h1>PLAY THE LATEST.<br /><span>RENT,</span> ANYTIME.</h1>
            <p className="hero-description">PS5 rentals in Bengaluru. Play top titles and experience next-gen gaming, without the commitment.</p>
            <div className="hero-actions">
              <Link className={buttonVariants({ size: 'lg', className: 'hero-cta' })} href="/consoles">
                Rent a PS5 <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
              <Link className="hero-secondary" href="#rentals">Explore consoles <ArrowDown aria-hidden="true" /></Link>
            </div>
            <ul className="trust-list" aria-label="Rental highlights">
              {trustPoints.map(({ label, icon: Icon }) => (
                <li key={label}><span><Icon aria-hidden="true" /></span>{label}</li>
              ))}
            </ul>
          </div>
          <div className="hero-visual">
            <div className="hero-red-orbit" aria-hidden="true" />
            <Image className="hero-product-image" src="/images/hero-console.png" alt="White next-generation gaming console and controller with subtle red studio lighting" width={1536} height={1024} priority sizes="(max-width: 760px) 100vw, 58vw" />
            <div className="hero-caption"><span className="caption-index">01 / 04</span><span>Ready when you are</span></div>
          </div>
        </div>
        <div className="hero-bottom-rule container" aria-hidden="true"><span /> <span>PLAY WITHOUT THE COMMITMENT</span></div>
      </section>

      <section className="catalog-section container" id="rentals">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Pick your weapon</p>
            <h2>PS5 <span>Rentals</span></h2>
            <p className="section-subtitle">Choose your console. Play your way.</p>
          </div>
          <Link className="view-all-link" href="/consoles">View all consoles <ArrowRight aria-hidden="true" /></Link>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty">
            <Gamepad2 aria-hidden="true" />
            <h3>Console catalog is being prepared</h3>
            <p>Products will appear here when they are active in the rental catalog.</p>
          </div>
        )}
        <p className="catalog-footnote">Rental prices and durations are loaded from the live catalog. Inventory and delivery coverage are confirmed before booking.</p>
      </section>

      <section className="experience-strip">
        <div className="container experience-content">
          <div><p className="eyebrow"><span className="eyebrow-line" /> The SKULL MODE difference</p><h2>Your next<br /><span>game night</span> starts here.</h2></div>
          <p>Choose a console, select your dates, and keep the setup simple. Every rental is checked against configured inventory before a booking can be confirmed.</p>
          <Link className="text-arrow-link" href="/how-it-works">See how it works <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  )
}
