'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppDispatch } from '@/store'
import { clearCart } from '@/store/slices/cart.slice'

export default function SuccessPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearCart())
  }, [dispatch])

  return (
    <main className="flex min-h-screen items-center justify-center bg-black pt-20 text-white">
      <motion.div
        className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-black/70 p-12 text-center backdrop-blur"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/10"
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 6, ease: 'easeInOut' }}
        >
          <span className="text-4xl">🍾</span>
        </motion.div>

        <h1 className="text-4xl font-headline font-bold md:text-5xl">Payment confirmed</h1>
        <p className="mt-4 text-sm text-white/70">
          Your gear is now in production. Expect an email with shipping details as soon as it leaves the warehouse.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-left text-sm text-white/70">
          <h2 className="text-lg font-headline font-bold text-white">Next steps</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-white/60">✓</span>
              <span>Confirmation email with order summary is already on its way.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-white/60">✓</span>
              <span>Print-on-demand partners prepare your piece within 2–4 business days.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-white/60">✓</span>
              <span>Tracking link arrives once the parcel is scanned by the courier.</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black shadow hover:bg-white/90"
          >
            Continue shopping
          </Link>
          <Link
            href="/rewir"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40 hover:text-white"
          >
            Dive into Rewir
          </Link>
        </div>

        <p className="mt-10 text-xs text-white/40">
          Need support? Email <a className="text-white/70 hover:text-white" href="mailto:care@fruitsfromdahood.com">care@fruitsfromdahood.com</a>
        </p>
      </motion.div>
    </main>
  )
}
