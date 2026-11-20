import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getCartCount } from '@/lib/cart'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' })
const orbitron = Orbitron({ variable: '--font-orbitron', subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'SKULL MODE BLR | PS5 Rentals in Bengaluru',
    template: '%s | SKULL MODE BLR',
  },
  description: 'Rent a PS5 in Bengaluru. Compare console editions, check rental pricing, and save your dates with SKULL MODE BLR.',
  applicationName: 'SKULL MODE BLR',
  openGraph: {
    title: 'SKULL MODE BLR | PS5 Rentals in Bengaluru',
    description: 'Next-gen gaming, on your schedule.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#070708',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cartCount = await getCartCount()

  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} app-body`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader cartCount={cartCount} />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
