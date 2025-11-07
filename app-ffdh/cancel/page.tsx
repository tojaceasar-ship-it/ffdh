'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black pt-20 text-white">
      <motion.div
        className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-black/70 p-12 text-center backdrop-blur"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 6, ease: 'easeInOut' }}
        >
          <span className="text-3xl">🍋</span>
        </motion.div>

        <h1 className="text-4xl font-headline font-bold">Checkout flow paused</h1>
        <p className="mt-4 text-sm text-white/60">
          No stress—your cart is safe. Feel free to edit selections, explore new drops, or return whenever you’re
          ready to complete the order.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black shadow hover:bg-white/90"
          >
            Back to shop
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40 hover:text-white"
          >
            Resume checkout
          </Link>
        </div>
      </motion.div>
    </main>
  )
}


