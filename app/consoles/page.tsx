import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Rent a PS5 console',
  description: 'Compare PS5 rental consoles and choose a rental period from the SKULL MODE BLR catalog.',
}

type ConsolesPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function ConsolesPage({ searchParams }: ConsolesPageProps) {
  const { q = '' } = await searchParams
  const products = await getProducts({ query: q })

  return (
    <main className="content-page container">
      <div className="page-intro">
        <p className="eyebrow"><span className="eyebrow-line" /> Console catalog</p>
        <h1>Pick your <span>console.</span></h1>
        <p>Real catalog pricing, shown in INR. Available rental periods are only those configured for each console.</p>
      </div>
      {q ? <p className="search-summary">Showing catalog results for <strong>“{q}”</strong> · <Link href="/consoles">Clear search</Link></p> : null}
      {products.length ? (
        <div className="product-grid catalog-page-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="catalog-empty">
          <Gamepad2 aria-hidden="true" />
          <h2>{q ? 'No consoles match that search' : 'No active consoles yet'}</h2>
          <p>{q ? 'Try a different model, edition, or storage size.' : 'Active rental products will appear here once they are configured.'}</p>
          {q ? <Link className="back-link" href="/consoles"><ArrowLeft aria-hidden="true" /> Browse all consoles</Link> : null}
        </div>
      )}
    </main>
  )
}
