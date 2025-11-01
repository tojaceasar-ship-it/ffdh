'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store'
import { removeFromCart, updateQuantity } from '@/store/slices/cart.slice'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l-2 border-neon-yellow z-50 flex flex-col"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neon-yellow/20">
              <h2 className="text-2xl font-headline font-bold text-neon-yellow">
                🛒 Koszyk
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-neon-yellow transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg mb-4">Twój koszyk jest pusty</p>
                  <p className="text-sm">Zacznij robić zakupy! 🍉</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.variantId}
                    className="bg-gray-900/50 border border-neon-yellow/20 rounded-lg p-4"
                    layout
                  >
                    <div className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-neon-yellow font-bold mb-2">
                          €{item.priceEUR.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  variantId: item.variantId,
                                  quantity: Math.max(0, item.quantity - 1),
                                })
                              )
                            }
                            className="px-2 py-1 bg-neon-yellow/20 text-neon-yellow rounded hover:bg-neon-yellow/40 transition-all"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  variantId: item.variantId,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="px-2 py-1 bg-neon-yellow/20 text-neon-yellow rounded hover:bg-neon-yellow/40 transition-all"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              dispatch(removeFromCart(item.variantId))
                            }
                            className="ml-auto text-red-400 hover:text-red-500 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neon-yellow/20 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-2xl font-bold text-neon-yellow">
                    €{total.toFixed(2)}
                  </span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <motion.button
                    className="w-full py-3 bg-neon-yellow text-black font-bold rounded-lg hover:bg-neon-cyan transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Checkout
                  </motion.button>
                </Link>
                <motion.button
                  onClick={onClose}
                  className="w-full py-2 border-2 border-neon-yellow text-neon-yellow font-bold rounded-lg hover:bg-neon-yellow/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
