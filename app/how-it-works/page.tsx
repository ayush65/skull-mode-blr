import { CalendarDays, Gamepad2, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'How rentals work',
  description: 'Learn how to choose console rental dates and check availability with SKULL MODE BLR.',
}

const steps = [
  { number: '01', title: 'Choose a console', text: 'Compare the active PS5 models and the rental durations currently priced in the catalog.', icon: Gamepad2 },
  { number: '02', title: 'Choose your dates', text: 'Select a start date and check current inventory for the full rental period.', icon: CalendarDays },
  { number: '03', title: 'Confirm before payment', text: 'A cart saves your selection only. Delivery coverage, final charges, and booking are confirmed before payment.', icon: ShieldCheck },
]

export default function HowItWorksPage() {
  return (
    <main className="content-page container information-page">
      <div className="page-intro">
        <p className="eyebrow"><span className="eyebrow-line" /> Rental guide</p>
        <h1>Play more.<br /><span>Commit less.</span></h1>
        <p>A clear path from choosing a console to confirming a rental.</p>
      </div>
      <div className="steps-grid">
        {steps.map(({ number, title, text, icon: Icon }) => (
          <article className="step-card" key={number}>
            <div className="step-top"><span>{number}</span><Icon aria-hidden="true" /></div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <section className="date-rule-card">
        <p className="eyebrow"><span className="eyebrow-line" /> Date counting</p>
        <h2>One date rule, clearly stated.</h2>
        <p>The selected start date is day one. The return date is the start date plus the selected rental duration; inventory checks use that half-open date range to avoid overlapping bookings.</p>
      </section>
    </main>
  )
}
