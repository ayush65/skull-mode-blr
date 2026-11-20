const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

export function formatINR(paise: number): string {
  return inrFormatter.format(paise / 100)
}
