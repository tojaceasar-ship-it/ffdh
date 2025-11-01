'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <motion.main
      className="min-h-screen bg-black text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex flex-col items-center justify-center px-6 pt-20 md:pt-0"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neon-yellow/5 to-transparent pointer-events-none" />

        <motion.h1
          className="text-5xl md:text-7xl font-headline font-bold text-center mb-6 text-neon-yellow drop-shadow-lg"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 40px rgba(255, 215, 0, 0.6)',
              '0 0 20px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Fruits From Da Hood
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl text-center font-cta"
          variants={itemVariants}
        >
          Zero GMO, 100% ulicy
        </motion.p>

        <motion.p className="text-center text-gray-500 mb-16 max-w-3xl">
          Premium streetwear born on the block. Urban culture meets neon aesthetics.
          Join the community of fruit characters and exclusive drops.
        </motion.p>

        <motion.div className="flex gap-6 mb-12" variants={itemVariants}>
          <Link
            href="/sklep"
            className="px-8 py-3 bg-neon-yellow text-black font-cta font-bold rounded-lg hover:bg-neon-cyan transition-all hover:scale-105"
          >
            Shop Now
          </Link>
          <Link
            href="/rewir"
            className="px-8 py-3 border-2 border-neon-yellow text-neon-yellow font-cta font-bold rounded-lg hover:bg-neon-yellow/10 transition-all"
          >
            Explore Rewir
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section className="py-20 px-6 max-w-6xl mx-auto" variants={itemVariants}>
        <h2 className="text-4xl font-headline font-bold mb-12 text-center text-neon-cyan">
          Why FFDH?
        </h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              title: '🎨 Unique Design',
              desc: 'Street art meets premium fashion in every piece',
            },
            {
              title: '🌍 Community',
              desc: 'Join thousands of FFDH enthusiasts worldwide',
            },
            {
              title: '⚡ Exclusive Drops',
              desc: 'Limited releases, unlimited vibes',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 border-2 border-neon-yellow/30 rounded-lg bg-black hover:border-neon-yellow/80 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              variants={itemVariants}
            >
              <h3 className="text-2xl font-headline mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 px-6 bg-gradient-to-r from-neon-yellow/5 to-neon-cyan/5 text-center"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-headline font-bold mb-6">Ready to rep FFDH?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Drop updates, exclusive previews, and streetwear culture delivered to your inbox.
        </p>
        <motion.button className="px-8 py-3 bg-neon-yellow text-black font-cta font-bold rounded-lg hover:scale-105 transition-transform">
          Subscribe Now
        </motion.button>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-black/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-headline font-bold mb-4">FFDH</h4>
            <p className="text-sm text-gray-500">Premium streetwear for urban culture.</p>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/sklep" className="hover:text-neon-yellow">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/rewir" className="hover:text-neon-yellow">
                  Rewir
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-4">Info</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600">
          © 2025 Fruits From Da Hood. All rights reserved.
        </div>
      </footer>
    </motion.main>
  )
}
