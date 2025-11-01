'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LookbookPreview() {
  const lookbookItems = [
    { id: 1, title: 'Urban Collection', image: '/assets/images/lookbook-1.jpg', category: 'Streetwear' },
    { id: 2, title: 'Neon Nights', image: '/assets/images/lookbook-2.jpg', category: 'Fashion' },
    { id: 3, title: 'City Vibes', image: '/assets/images/lookbook-3.jpg', category: 'Lifestyle' },
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-white">
            Lookbook Explorer
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover our latest styles and lifestyle photography
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {lookbookItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative h-96 bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-end p-6 z-20">
                <div>
                  <div className="text-sm text-primary mb-2">{item.category}</div>
                  <h3 className="text-2xl font-headline font-bold text-white">{item.title}</h3>
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/lookbook"
            className="inline-block px-8 py-4 border-2 border-secondary text-secondary font-bold rounded-lg hover:bg-secondary/10 transition-all"
          >
            View Full Lookbook
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

