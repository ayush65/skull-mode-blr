'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Rent console', href: '/consoles' },
  { label: 'Games library', href: '/games' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
]

export function SiteHeader({ cartCount }: { cartCount: number }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="nav-shell container">
        <Link className="brand-lockup" href="/" aria-label="SKULL MODE BLR home">
          <span className="brand-emblem" aria-hidden="true">SM</span>
          <span className="brand-wordmark">SKULL MODE <small>BLR</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>

        <div className="nav-actions">
          <Button variant="ghost" size="icon" aria-label={searchOpen ? 'Close search' : 'Open search'} onClick={() => setSearchOpen((open) => !open)}>
            {searchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
          </Button>
          <Link className={buttonVariants({ variant: 'ghost', size: 'icon' })} href="/account" aria-label="Customer account">
            <UserRound aria-hidden="true" />
          </Link>
          <Link className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'cart-trigger' })} href="/cart" aria-label={`Shopping cart, ${cartCount} items`}>
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 ? <span className="cart-count" aria-hidden="true">{cartCount}</span> : null}
          </Link>
          <Button className="mobile-menu-trigger" variant="ghost" size="icon" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {searchOpen ? (
        <form className="site-search container" action="/consoles" role="search">
          <label className="sr-only" htmlFor="site-search-input">Search consoles</label>
          <Search aria-hidden="true" />
          <input id="site-search-input" name="q" autoFocus placeholder="Search consoles, editions, storage…" />
          <Button type="submit" size="sm">Search</Button>
        </form>
      ) : null}

      {mobileOpen ? (
        <nav className="mobile-nav container" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
