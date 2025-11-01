'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/store'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useAppSelector((state) => state.cart)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rewir', label: 'Rewir' },
    { href: '/shop', label: 'Shop' },
    { href: '/characters', label: 'Characters' },
    { href: '/about', label: 'About' },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neon-yellow/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-neon-yellow">
              <motion.span
                animate={{ textShadow: ['0 0 8px rgba(250,204,21,0.8)', '0 0 18px rgba(34,211,238,0.6)', '0 0 8px rgba(250,204,21,0.8)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                🍉
              </motion.span>
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="tracking-[0.3em]"
              >
                FFDH
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-cta text-gray-300 transition-colors hover:text-neon-yellow">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <Link
                href="/shop/cart"
                aria-label="Open cart"
                className="text-xl text-neon-yellow transition-colors hover:text-neon-cyan"
              >
                🛒
              </Link>
              {itemCount > 0 && (
                <motion.span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neon-yellow text-xs font-bold text-black"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:text-neon-yellow md:hidden"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="border-b border-neon-yellow/20 bg-black/95 md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-gray-300 transition-colors hover:bg-neon-yellow/10 hover:text-neon-yellow"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
