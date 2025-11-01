'use client'

import { motion } from 'framer-motion'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cart.slice'

interface ProductCardProps {
  id: string
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
      className="relative group"
      whileHover={{ scale: isSoldOut ? 1 : 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Container */}
      <div className="bg-black border-2 border-neon-yellow/30 rounded-lg overflow-hidden hover:border-neon-yellow/80 transition-all">
        {/* Image */}
        <div className="relative h-64 bg-gray-900 overflow-hidden">
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
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-headline font-bold mb-2 line-clamp-2">
            {name}
          </h3>

          <p className="text-neon-yellow text-lg font-bold mb-4">
            €{price.toFixed(2)}
          </p>

          <motion.button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-full py-2 px-4 rounded-lg font-cta font-bold transition-all ${
              isSoldOut
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-neon-yellow text-black hover:bg-neon-cyan hover:scale-105'
            }`}
            whileTap={{ scale: isSoldOut ? 1 : 0.95 }}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
