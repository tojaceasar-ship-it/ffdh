'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CommunityShowcase() {
  const stats = [
    { label: 'Community Members', value: '10K+', color: 'primary' },
    { label: 'Scenes Shared', value: '2.5K+', color: 'secondary' },
    { label: 'AI Conversations', value: '15K+', color: 'accent' },
  ]

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-white">
            Join the Community
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Connect with others, share emotions, and explore AI-powered narratives
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center p-8 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-primary/50 transition-all"
            >
              <div className={`text-5xl font-headline font-bold mb-2 text-${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-400 font-body">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/rewir"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-black font-bold rounded-lg hover:shadow-neon transition-all"
          >
            Explore Rewir AI
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

