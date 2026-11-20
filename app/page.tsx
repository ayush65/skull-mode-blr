import { StorefrontHome } from '@/components/storefront-home'
import { getProducts } from '@/lib/products'

export default async function HomePage() {
  const products = await getProducts({ featuredOnly: true })
  return <StorefrontHome products={products} />
}
