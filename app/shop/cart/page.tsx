'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store'
import { removeFromCart } from '@/store/slices/cart.slice'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-headline font-bold">Cart</h1>
          <p className="mt-3 text-sm text-white/70">Review your selection before completing checkout.</p>

          {items.length === 0 ? (
            <div
              data-testid="empty-cart"
              className="mt-16 rounded-3xl border border-white/10 bg-black/60 p-12 text-center text-sm text-white/60"
            >
              Your cart is empty. <Link className="text-neon-yellow hover:underline" href="/shop">Browse the shop</Link>
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {items.map((item) => (
                <motion.div
                  data-testid="cart-item"
                  key={item.variantId}
                  className="flex items-center justify-between gap-6 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-white/50">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">€{(item.priceEUR * item.quantity).toFixed(2)}</span>
                    <button
                      data-testid="remove-item"
                      onClick={() => dispatch(removeFromCart(item.variantId))}
                      className="text-xs uppercase tracking-[0.3em] text-white/40 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
                <span>Total</span>
                <span className="text-lg font-bold text-white">€{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/checkout"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black hover:bg-white/90"
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}


