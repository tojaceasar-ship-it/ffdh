'use client'

import { motion } from 'framer-motion'

const sections = [
  {
    title: 'Information we collect',
    items: [
      'Contact details provided during checkout or newsletter sign-up.',
      'Order history, fulfilment updates, and support correspondence.',
      'Aggregated analytics (device type, pages viewed) via privacy-focused tooling.',
    ],
  },
  {
    title: 'How we use your data',
    items: [
      'To produce, ship, and service your orders.',
      'To send transactional emails and critical product updates.',
      'To refine Rewir experiences (emotion analytics remain anonymised).',
    ],
  },
  {
    title: 'Your rights',
    items: [
      'Request access to the data we hold about you.',
      'Ask for corrections or deletion (within legal retention requirements).',
      'Opt-out of marketing communications at any time via unsubscribe links.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-headline font-bold md:text-5xl">Privacy policy</h1>
          <p className="mt-4 text-sm text-white/70">
            We respect your data. This policy explains what we collect, why, and how you can control it. Last update: 1 November 2025.
          </p>
        </motion.div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-10 text-sm text-white/70">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              className="rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h2 className="text-lg font-headline font-bold text-white">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-xs uppercase tracking-[0.3em] text-white/40"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: sections.length * 0.1 }}
          >
            <p>Contact privacy@fruitsfromdahood.com for data requests.</p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}


