import Link from 'next/link'
import { LockKeyhole, ShoppingBag } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const metadata = { title: 'Customer account' }

export default function AccountPage() {
  return (
    <main className="content-page container account-page">
      <div className="account-card">
        <span className="account-lock"><LockKeyhole aria-hidden="true" /></span>
        <p className="eyebrow"><span className="eyebrow-line" /> Customer account</p>
        <h1>Accounts are <span>not enabled yet.</span></h1>
        <p>Guest rental selections are available now. Sign-in and account history will stay unavailable until secure authentication is configured.</p>
        <Link className={buttonVariants({ size: 'lg' })} href="/cart"><ShoppingBag data-icon="inline-start" aria-hidden="true" /> Continue with guest cart</Link>
      </div>
    </main>
  )
}
