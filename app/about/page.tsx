import Link from 'next/link'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'About SKULL MODE BLR',
  description: 'SKULL MODE BLR is a Bengaluru gaming console rental storefront.',
}

export default function AboutPage() {
  return (
    <main className="content-page container information-page about-page">
      <div className="about-mark"><Gamepad2 aria-hidden="true" /></div>
      <p className="eyebrow"><span className="eyebrow-line" /> About the brand</p>
      <h1>Gaming on <span>your terms.</span></h1>
      <p className="about-lede">SKULL MODE BLR is a Bengaluru-focused gaming console rental storefront built around flexible access to next-generation play.</p>
      <p className="about-copy">The catalog, rental prices, and inventory are managed as live data. Delivery coverage, rental policies, game stock, and payment options are not assumed; they are confirmed before a booking can be accepted.</p>
      <Link className={buttonVariants({ size: 'lg' })} href="/consoles">Explore the catalog <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
    </main>
  )
}
