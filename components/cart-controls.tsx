'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function RemoveCartItem({ lineId }: { lineId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function removeItem() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'The item could not be removed.')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The item could not be removed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cart-remove-wrap">
      <Button variant="ghost" size="sm" onClick={removeItem} disabled={busy}>
        {busy ? 'Removing…' : 'Remove'}
      </Button>
      {error ? <span role="status">{error}</span> : null}
    </div>
  )
}
