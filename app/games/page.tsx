import Link from 'next/link'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Games library',
  description: 'Game titles available with SKULL MODE BLR console rentals.',
}

export default function GamesPage() {
  return (
    <main className="content-page container information-page">
      <div className="page-intro">
        <p className="eyebrow"><span className="eyebrow-line" /> Games library</p>
        <h1>Pick your <span>next world.</span></h1>
        <p>The games library will list titles confirmed for rental alongside each console.</p>
      </div>
      <section className="catalog-empty games-empty">
        <Gamepad2 aria-hidden="true" />
        <h2>Game inventory is not configured yet</h2>
        <p>No game titles or availability have been added to the catalog, so we are not listing unverified stock.</p>
        <Link className={buttonVariants({ variant: 'outline', size: 'lg' })} href="/consoles">Explore consoles <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
      </section>
    </main>
  )
}
