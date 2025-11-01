'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'

// Temporary mock data - replace with Sanity/Printful
const mockProducts = [
  {
    id: '1',
    variantId: 'var_1',
    name: 'Classic FFDH T-Shirt',
    price: 29.99,
    image: 'https://via.placeholder.com/300x300?text=FFDH+Tee',
    isLimited: false,
    isSoldOut: false,
    stock: 10,
  },
  {
    id: '2',
    variantId: 'var_2',
    name: 'Neon Banana Hoodie',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Banana+Hoodie',
    isLimited: true,
    isSoldOut: false,
    stock: 3,
  },
  {
    id: '3',
    variantId: 'var_3',
    name: 'Urban Fruits Cap',
    price: 24.99,
    image: 'https://via.placeholder.com/300x300?text=FFDH+Cap',
    isLimited: false,
    isSoldOut: true,
  },
  {
    id: '4',
    variantId: 'var_4',
    name: 'Streetwear Jacket',
    price: 129.99,
    image: 'https://via.placeholder.com/300x300?text=Jacket',
    isLimited: true,
    isSoldOut: false,
    stock: 1,
  },
]

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      {/* Hero */}
      <motion.section
        className="py-12 px-6 bg-gradient-to-b from-neon-yellow/5 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 text-neon-yellow">
            Shop FFDH
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Exclusive streetwear drops, limited editions, and urban culture gear.
            Rep the FFDH lifestyle.
          </p>
        </div>
      </motion.section>

      {/* Filters (Placeholder) */}
      <motion.section className="py-8 px-6 border-b border-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="max-w-6xl mx-auto flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-neon-yellow text-black rounded-lg font-cta font-bold hover:bg-neon-cyan transition-all">
            All Products
          </button>
          <button className="px-4 py-2 border border-neon-yellow text-neon-yellow rounded-lg font-cta hover:bg-neon-yellow/10 transition-all">
            Limited Edition
          </button>
          <button className="px-4 py-2 border border-neon-yellow text-neon-yellow rounded-lg font-cta hover:bg-neon-yellow/10 transition-all">
            New Arrivals
          </button>
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section
        className="py-12 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              staggerChildren: 0.1,
              delayChildren: 0.3,
            }}
          >
            {mockProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Load More */}
      <motion.section
        className="py-12 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="px-8 py-3 border-2 border-neon-yellow text-neon-yellow rounded-lg font-cta font-bold hover:bg-neon-yellow/10 transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Load More Products
        </motion.button>
      </motion.section>
    </main>
  )
}
