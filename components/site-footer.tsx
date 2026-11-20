import Link from 'next/link'
import { ArrowUpRight, Gamepad2 } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="brand-lockup" href="/">
            <span className="brand-emblem" aria-hidden="true">SM</span>
            <span className="brand-wordmark">SKULL MODE <small>BLR</small></span>
          </Link>
          <p>Next-gen gaming, on your schedule.<br />A console rental brand from Bengaluru.</p>
        </div>
        <div className="footer-links">
          <div>
            <h2>Explore</h2>
            <Link href="/consoles">Consoles</Link>
            <Link href="/games">Games library</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
          <div>
            <h2>Rental note</h2>
            <p>Availability, delivery coverage, and payment setup are confirmed before any booking is accepted.</p>
            <Link className="footer-text-link" href="/about">About the service <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SKULL MODE BLR</span>
        <span className="footer-location"><Gamepad2 aria-hidden="true" /> Bengaluru, Karnataka</span>
      </div>
    </footer>
  )
}
