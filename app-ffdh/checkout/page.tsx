'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/store'
import Link from 'next/link'

type PaymentMethod = 'stripe' | 'paypal' | null

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { items, total } = useAppSelector((state) => state.cart)

  const handleCheckout = async () => {
    if (!paymentMethod || items.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          paymentMethod,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white pt-20">
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          <h1 className="mb-6 text-4xl font-headline font-bold text-neon-yellow">Your cart is empty</h1>
          <p className="mb-8 text-gray-400">Add pieces from the collection to continue the checkout flow.</p>
          <Link
            href="/shop"
            className="inline-block rounded-lg bg-neon-yellow px-8 py-3 font-bold text-black transition-all hover:bg-neon-cyan"
          >
            Explore the shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="mb-12 text-4xl font-headline font-bold text-neon-yellow">🛒 Checkout</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            className="border-2 border-neon-yellow/30 rounded-lg p-8 bg-gray-900/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="mb-6 text-2xl font-headline font-bold text-neon-cyan">Order summary</h2>

            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex justify-between items-center pb-4 border-b border-gray-700"
                >
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-neon-yellow font-bold">
                    €{(item.priceEUR * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t-2 border-neon-yellow/30 pt-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping:</span>
                <span>€10.00</span>
              </div>
              <div className="flex justify-between pt-4 text-2xl font-bold text-neon-yellow">
                <span>Total:</span>
                <span>€{(total + 10).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <h2 className="mb-6 text-2xl font-headline font-bold text-neon-cyan">Payment method</h2>

              {/* Stripe Option */}
              <motion.button
                onClick={() => setPaymentMethod('stripe')}
                className={`w-full p-6 rounded-lg border-2 mb-4 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-neon-yellow bg-neon-yellow/10'
                    : 'border-neon-yellow/30 bg-gray-900/50 hover:border-neon-yellow/60'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-left">
                  <h3 className="mb-2 text-lg font-bold text-white">💳 Credit / debit</h3>
                  <p className="text-sm text-gray-400">Processed via Stripe</p>
                </div>
              </motion.button>

              {/* PayPal Option */}
              <motion.button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full p-6 rounded-lg border-2 mb-8 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-neon-yellow bg-neon-yellow/10'
                    : 'border-neon-yellow/30 bg-gray-900/50 hover:border-neon-yellow/60'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-left">
                  <h3 className="mb-2 text-lg font-bold text-white">🅿️ PayPal</h3>
                  <p className="text-sm text-gray-400">Fast & secure checkout</p>
                </div>
              </motion.button>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                disabled={!paymentMethod || isLoading}
                className={`w-full py-4 rounded-lg font-headline font-bold text-lg transition-all ${
                  paymentMethod && !isLoading
                    ? 'bg-neon-yellow text-black hover:bg-neon-cyan'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={paymentMethod ? { scale: 1.02 } : {}}
                whileTap={paymentMethod ? { scale: 0.98 } : {}}
              >
                {isLoading ? '⏳ Processing...' : 'Proceed to payment'}
              </motion.button>

              <p className="text-center text-sm text-gray-500 mt-4">
                All payments are encrypted and secured with Stripe
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
