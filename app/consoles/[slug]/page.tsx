import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Disc3, Gamepad2, HardDrive, ShieldCheck } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { RentalConfigurator } from '@/components/rental-configurator'
import { getProductBySlug, getProducts } from '@/lib/products'
import { formatINR } from '@/lib/money'

type ProductPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Console not found' }
  return {
    title: `${product.name} ${product.edition} rental`,
    description: `${product.name} ${product.edition}, ${product.storage}. Browse current rental pricing and availability from SKULL MODE BLR.`,
  }
}

export default async function ConsoleDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = (await getProducts({ featuredOnly: true })).filter((item) => item.id !== product.id).slice(0, 3)
  const startingPrice = product.pricing[0]

  return (
    <main className="content-page container product-detail-page">
      <Link className="back-link" href="/consoles"><ArrowLeft aria-hidden="true" /> All consoles</Link>
      <div className="product-detail-grid">
        <div className="detail-gallery">
          {product.badge ? <span className="product-badge">{product.badge}</span> : null}
          <Image src={product.imageUrl} alt={`Illustrative render of ${product.name} ${product.edition} console`} width={900} height={900} priority sizes="(max-width: 800px) 100vw, 52vw" />
          <span className="gallery-caption">Product render · {product.edition}</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> SKULL MODE BLR · RENTAL</p>
          <h1>{product.name}<br /><span>{product.edition}</span></h1>
          <p className="detail-description">{product.description}</p>
          <div className="spec-grid">
            <div><Disc3 aria-hidden="true" /><span>Edition</span><strong>{product.edition}</strong></div>
            <div><HardDrive aria-hidden="true" /><span>Storage</span><strong>{product.storage}</strong></div>
            <div><Gamepad2 aria-hidden="true" /><span>Included</span><strong>{product.controllerCount} controller</strong></div>
          </div>
          <div className="detail-price">
            <span>Starting from</span>
            <strong>{startingPrice ? formatINR(startingPrice.pricePaise) : 'Price not configured'}</strong>
            {startingPrice ? <small>for {startingPrice.durationDays} days</small> : null}
          </div>
          <div className="included-list">
            <p><Check aria-hidden="true" /> Controller, cables &amp; setup</p>
            <p><ShieldCheck aria-hidden="true" /> Rental conditions confirmed before checkout</p>
          </div>
          <RentalConfigurator product={product} />
        </div>
      </div>
      {related.length ? (
        <section className="related-section">
          <div className="section-heading compact-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> Keep exploring</p><h2>More <span>consoles</span></h2></div></div>
          <div className="product-grid related-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      ) : null}
    </main>
  )
}
