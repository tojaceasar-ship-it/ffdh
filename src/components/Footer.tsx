'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { routes } from '@/utils/routes'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    shop: [
      { label: 'All Products', href: routes.shop },
      { label: 'New Releases', href: routes.shop },
      { label: 'Lookbook', href: routes.shop },
      { label: 'Sizing Guide', href: routes.shop },
    ],
    rewir: [
      { label: 'Explore Scenes', href: routes.rewir },
      { label: 'How It Works', href: routes.rewir },
      { label: 'Submit Scene', href: routes.rewir },
    ],
    company: [
      { label: 'About Us', href: routes.about },
      { label: 'Contact', href: routes.home },
      { label: 'Shipping', href: routes.checkout },
      { label: 'Returns', href: routes.checkout },
    ],
  }

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'TikTok', href: '#', icon: '🎵' },
    { name: 'Discord', href: '#', icon: '💬' },
  ]

  return (
    <footer className="bg-black border-t border-neon-yellow/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={routes.home}>
              <motion.div
                className="text-3xl font-headline font-bold text-neon-yellow mb-4"
                whileHover={{ scale: 1.05 }}
              >
                🍉 FFDH
              </motion.div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Premium streetwear inspired by urban culture. Fruit characters. Emotional scenes. Real stories.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="text-2xl hover:text-neon-yellow transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-headline font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-yellow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rewir Links */}
          <div>
            <h3 className="text-white font-headline font-bold text-lg mb-4">Rewir</h3>
            <ul className="space-y-2">
              {footerLinks.rewir.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-yellow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-headline font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-yellow transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Fruits From Da Hood. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-neon-yellow transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-neon-yellow transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-neon-yellow transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

