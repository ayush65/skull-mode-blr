import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { formatINR } from '@/lib/money'
import type { RentalProductView } from '@/lib/products'

export function ProductCard({ product }: { product: RentalProductView }) {
  const startingRate = product.pricing[0]

  return (
    <article className="product-card">
      <Link className="product-media" href={`/consoles/${product.slug}`} aria-label={`View ${product.name} ${product.edition}`}>
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
        <Image
          src={product.imageUrl}
          alt={`Illustrative render of ${product.name} ${product.edition} console`}
          width={640}
          height={640}
          sizes="(max-width: 640px) 90vw, (max-width: 1100px) 44vw, 24vw"
        />
        <span className="product-image-halo" aria-hidden="true" />
      </Link>
      <div className="product-card-body">
        <div className="product-heading-row">
          <div>
            <p className="product-kicker">{product.edition} <span aria-hidden="true">·</span> {product.storage}</p>
            <h3><Link href={`/consoles/${product.slug}`}>{product.name}</Link></h3>
          </div>
          <span className="product-icon" aria-hidden="true"><Gamepad2 /></span>
        </div>
        {startingRate ? (
          <p className="product-price">From <strong>{formatINR(startingRate.pricePaise)}</strong><span> / {startingRate.durationDays} days</span></p>
        ) : (
          <p className="product-price product-price-muted">Pricing is being configured</p>
        )}
        <div className="product-includes">
          <span><Gamepad2 aria-hidden="true" /> {product.controllerCount} controller</span>
          <span><span className="include-dot" aria-hidden="true" /> Cables &amp; setup</span>
        </div>
        <Link className={buttonVariants({ variant: 'outline', size: 'lg', className: 'product-link' })} href={`/consoles/${product.slug}`}>
          Explore rental <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
