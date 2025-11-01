'use client'

import { motion } from 'framer-motion'

const sections = [
  {
    title: 'General',
    body: [
      'Fruits From Da Hood (FFDH) is a trading name of FFDH Studio Sp. z o.o. All purchases made through our platforms are subject to these terms.',
      'By placing an order you confirm that you are authorised to use the selected payment method and that all information provided is accurate.',
    ],
  },
  {
    title: 'Fulfilment & shipping',
    body: [
      'Products are produced on demand by audited fulfilment partners located in the EU, UK, and US. Production time is typically 2–4 business days.',
      'Shipping times are estimated at checkout. Customs duties or import taxes are the responsibility of the recipient.',
    ],
  },
  {
    title: 'Returns & exchanges',
    body: [
      'We accept returns of unworn items within 14 days of delivery. Contact care@fruitsfromdahood.com with your order number to initiate a return.',
      'Custom items (e.g. personalised prints) are final sale unless the product arrives damaged or defective.',
    ],
  },
  {
    title: 'Data & privacy',
    body: [
      'We collect minimal personal data required to fulfil orders and improve the experience. Detailed information is available in our Privacy Policy.',
      'We never sell customer data to third parties. Analytics are anonymised and aggregated.',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-headline font-bold md:text-5xl">Terms of service</h1>
          <p className="mt-4 text-sm text-white/70">
            Effective date: 1 November 2025. These terms may be updated; continued use of our services constitutes acceptance of the latest version.
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
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}


