'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl md:text-7xl font-headline font-bold mb-6 text-neon-yellow">
            🍉 O nas
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Marka, która łączy miejski streetwear z emocjonalnym storytellingiem
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-headline font-bold mb-6 text-neon-cyan">Nasza Historia</h2>
          <div className="prose prose-invert max-w-none space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              Fruits From Da Hood to coś więcej niż marka odzieżowa. To ruch kulturowy, który 
              celebruje miejskie opowieści, emocje i prawdziwe doświadczenia. Nasze owocowe postacie
              reprezentują różne aspekty ludzkiej egzystencji w mieście.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              W 2025 roku stworzyliśmy <Link href="/rewir" className="text-neon-yellow hover:underline">Rewir</Link> — 
              platformę AI, która generuje emocjonalne sceny z ulic. Każda scena to opowieść o tym, 
              co znaczy żyć, czuć i walczyć w mieście.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-headline font-bold mb-6 text-neon-cyan">Nasze Wartości</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Autentyczność', desc: 'Prawdziwe historie, prawdziwe emocje' },
              { icon: '🌍', title: 'Wspólnota', desc: 'Łączymy ludzi przez street culture' },
              { icon: '🎨', title: 'Kreatywność', desc: 'Innowacyjne projekty i AI storytelling' },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-gray-900/50 border-2 border-neon-yellow/20 rounded-lg p-6"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-headline font-bold mb-2 text-neon-yellow">{value.title}</h3>
                <p className="text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/rewir"
            className="inline-block px-8 py-4 bg-neon-yellow text-black font-bold rounded-lg hover:bg-neon-cyan transition-all text-lg"
          >
            Odkryj Rewir
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

