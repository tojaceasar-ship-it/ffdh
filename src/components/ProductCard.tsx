'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cart.slice'

interface ProductCardProps {
  id: string
  slug: string
  variantId: string
  name: string
  price: number
  image: string
  isLimited?: boolean
  isSoldOut?: boolean
  stock?: number
}

export default function ProductCard({
  id,
  slug,
  variantId,
  name,
  price,
  image,
  isLimited,
  isSoldOut,
  stock = 1,
}: ProductCardProps) {
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    if (!isSoldOut) {
      dispatch(
        addToCart({
          id,
          variantId,
          name,
          priceEUR: price,
          quantity: 1,
          image,
        })
      )
    }
  }

  return (
    <motion.div
      data-testid="product-card"
      data-sold-out={isSoldOut ? 'true' : 'false'}
      className="relative group"
      whileHover={{ scale: isSoldOut ? 1 : 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Container */}
      <div className="bg-black border-2 border-neon-yellow/30 rounded-lg overflow-hidden hover:border-neon-yellow/80 transition-all">
        {/* Image */}
        <Link href={`/product/${slug}`} className="relative block h-64 bg-gray-900 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlays */}
          {isLimited && (
            <div className="absolute top-3 right-3 bg-neon-cyan text-black px-3 py-1 rounded-full text-xs font-bold">
              LIMITED
            </div>
          )}

          {isSoldOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-neon-yellow text-lg font-bold">SOLD OUT</span>
            </div>
          )}

          {stock && stock < 5 && !isSoldOut && (
            <div className="absolute bottom-3 left-3 bg-neon-yellow/20 text-neon-yellow px-3 py-1 rounded text-xs font-bold">
              Only {stock} left
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/product/${slug}`} className="text-white font-headline font-bold mb-2 line-clamp-2 block hover:text-neon-yellow transition-colors">
            {name}
          </Link>

          <p className="text-neon-yellow text-lg font-bold mb-4">
            €{price.toFixed(2)}
          </p>

          <motion.button
            data-testid="add-to-cart"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-full py-2 px-4 rounded-lg font-cta font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              isSoldOut
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed opacity-60'
                : 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-2 focus:ring-brand-600'
            }`}
            whileTap={{ scale: isSoldOut ? 1 : 0.95 }}
          >
            {isSoldOut ? 'Sold Out' : 'Add to cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
