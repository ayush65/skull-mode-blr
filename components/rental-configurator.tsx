'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CalendarDays, Check, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/money'
import { todayInBengaluru } from '@/lib/rental-dates'
import type { RentalProductView } from '@/lib/products'

type AvailabilityResult = {
  available: boolean
  availableQuantity: number
  returnDate: string
  message: string
}

export function RentalConfigurator({ product }: { product: RentalProductView }) {
  const router = useRouter()
  const [startDate, setStartDate] = useState(todayInBengaluru())
  const [durationDays, setDurationDays] = useState(product.pricing[0]?.durationDays ?? 0)
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null)
  const [message, setMessage] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const selectedPrice = product.pricing.find((rate) => rate.durationDays === durationDays)

  async function checkDates() {
    if (!selectedPrice) return
    setMessage('')
    setIsChecking(true)
    setAvailability(null)

    try {
      const params = new URLSearchParams({
        productId: product.id,
        startDate,
        durationDays: String(durationDays),
      })
      const response = await fetch(`/api/availability?${params.toString()}`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Availability could not be checked.')
      setAvailability(result)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Availability could not be checked.')
    } finally {
      setIsChecking(false)
    }
  }

  async function addToCart() {
    if (!selectedPrice) return
    setMessage('')
    setIsAdding(true)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, startDate, durationDays }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'This rental could not be saved.')
      setMessage(
        product.inventoryTotal === null
          ? 'Saved to your cart. Inventory is not configured yet, so checkout is unavailable.'
          : product.inventoryTotal === 0
            ? 'Saved to your cart, but no consoles are currently available.'
            : 'Rental selection saved to your cart. This is not a confirmed booking.',
      )
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'This rental could not be saved.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <section className="rental-configurator" aria-labelledby="rental-config-title">
      <div className="config-title-row">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Configure your rental</p>
          <h2 id="rental-config-title">Make it a <span>game night.</span></h2>
        </div>
        <span className="config-icon" aria-hidden="true"><CalendarDays /></span>
      </div>
      <div className="config-fields">
        <label className="config-field">
          <span>Start date</span>
          <input type="date" min={todayInBengaluru()} value={startDate} onChange={(event) => { setStartDate(event.target.value); setAvailability(null) }} />
        </label>
        <label className="config-field">
          <span>Rental duration</span>
          <select value={durationDays || ''} onChange={(event) => { setDurationDays(Number(event.target.value)); setAvailability(null) }} disabled={product.pricing.length === 0}>
            {product.pricing.length === 0 ? <option value="">No durations configured</option> : null}
            {product.pricing.map((rate) => <option key={rate.durationDays} value={rate.durationDays}>{rate.durationDays} days · {formatINR(rate.pricePaise)}</option>)}
          </select>
        </label>
      </div>
      <div className="config-price-row">
        <span><Clock3 aria-hidden="true" /> Price for this period</span>
        <strong>{selectedPrice ? formatINR(selectedPrice.pricePaise) : 'Not configured'}</strong>
      </div>
      <div className="config-actions">
        <Button variant="outline" size="lg" onClick={checkDates} disabled={!selectedPrice || isChecking}>
          {isChecking ? 'Checking…' : 'Check availability'}
        </Button>
        <Button size="lg" onClick={addToCart} disabled={!selectedPrice || isAdding}>
          {isAdding ? 'Saving…' : 'Add to cart'} <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
      {availability ? (
        <p className={availability.available ? 'availability-message is-available' : 'availability-message'} role="status">
          {availability.available ? <Check aria-hidden="true" /> : null}
          {availability.message}
          {availability.available ? ` · Return by ${availability.returnDate}` : ''}
        </p>
      ) : null}
      {message ? <p className="availability-message" role="status">{message}</p> : null}
      <p className="config-disclaimer">Adding to cart saves your selection only. Availability is checked again before booking; no payment or booking is created here.</p>
    </section>
  )
}
