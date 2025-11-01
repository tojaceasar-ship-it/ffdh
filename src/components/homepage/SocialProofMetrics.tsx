'use client'

import { motion } from 'framer-motion'

export default function SocialProofMetrics() {
  const metrics = [
    { icon: '⭐', value: '4.9/5', label: 'Customer Rating' },
    { icon: '📦', value: '50K+', label: 'Orders Shipped' },
    { icon: '🌍', value: '100+', label: 'Countries Served' },
    { icon: '💬', value: '25K+', label: 'Happy Reviews' },
  ]

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{metric.icon}</div>
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-gray-400 font-body">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

