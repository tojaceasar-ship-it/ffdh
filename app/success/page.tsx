'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/store'
import { clearCart } from '@/store/slices/cart.slice'
import Link from 'next/link'

export default function SuccessPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Clear cart on successful payment
    dispatch(clearCart())
  }, [dispatch])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
      <motion.div
        className="text-center max-w-2xl px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon */}
        <motion.div
          className="mb-8"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
        >
          <div className="text-9xl">🎉</div>
        </motion.div>

        {/* Main Message */}
        <motion.h1
          className="text-5xl md:text-6xl font-headline font-bold mb-4 text-neon-yellow animate-neon-pulse"
          variants={itemVariants}
        >
          Zamówienie Potwierdzone!
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 mb-6"
          variants={itemVariants}
        >
          Dziękujemy za zakup! 🍉
        </motion.p>

        {/* Order Details */}
        <motion.div
          className="bg-gray-900/50 border-2 border-neon-yellow/30 rounded-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-headline font-bold mb-4 text-neon-cyan">
            Co dalej?
          </h2>
          <ul className="text-left space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-neon-yellow text-xl">✓</span>
              <span>Potwierdzenie zamówienia zostało wysłane na Twój email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-neon-yellow text-xl">✓</span>
              <span>Twój produkt będzie drukowany i wysyłany w ciągu 2-3 dni roboczych</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-neon-yellow text-xl">✓</span>
              <span>Otrzymasz numer śledzenia wysyłki via email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-neon-yellow text-xl">✓</span>
              <span>Szybko wrócisz do FFDH community! 🌱</span>
            </li>
          </ul>
        </motion.div>

        {/* Order Number */}
        <motion.div className="mb-12" variants={itemVariants}>
          <p className="text-gray-500 text-sm mb-2">Numer zamówienia:</p>
          <p className="text-2xl font-bold text-neon-cyan font-mono">
            #FDH{Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link
            href="/sklep"
            className="px-8 py-3 bg-neon-yellow text-black font-bold rounded-lg hover:bg-neon-cyan transition-all hover:scale-105"
          >
            Kontynuuj Zakupy
          </Link>
          <Link
            href="/rewir"
            className="px-8 py-3 border-2 border-neon-yellow text-neon-yellow font-bold rounded-lg hover:bg-neon-yellow/10 transition-all"
          >
            Wróć do Rewiru
          </Link>
        </motion.div>

        {/* Support */}
        <motion.p
          className="mt-12 text-gray-500 text-sm"
          variants={itemVariants}
        >
          Masz pytania?{' '}
          <a
            href="mailto:support@fruitsfromdahood.pl"
            className="text-neon-yellow hover:text-neon-cyan transition-colors"
          >
            Skontaktuj się z nami
          </a>
        </motion.p>
      </motion.div>
    </main>
  )
}
