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
    { href: '/sklep', label: 'Shop' },
    { href: '/community', label: 'Community' },
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="text-2xl font-headline font-bold text-neon-yellow hover:text-neon-cyan transition-colors"
            >
              🍉 FFDH
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-neon-yellow transition-colors text-sm font-cta"
              >
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
                href="/koszyk"
                className="text-neon-yellow text-xl hover:text-neon-cyan transition-colors"
              >
                🛒
              </Link>
              {itemCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-neon-yellow text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
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
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-neon-yellow transition-colors"
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
          className="md:hidden bg-black/95 border-b border-neon-yellow/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors"
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
