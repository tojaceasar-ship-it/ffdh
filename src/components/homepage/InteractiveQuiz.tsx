'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InteractiveQuiz() {
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null)

  const fruits = [
    { id: 'banana', emoji: '🍌', name: 'Banana', description: 'Urban wisdom & nostalgia' },
    { id: 'apple', emoji: '🍎', name: 'Apple', description: 'Fresh & bold energy' },
    { id: 'orange', emoji: '🍊', name: 'Orange', description: 'Creative & vibrant' },
    { id: 'grape', emoji: '🍇', name: 'Grape', description: 'Sophisticated & deep' },
  ]

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-white">
            Find Your Fruit
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover which fruit character matches your vibe
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fruits.map((fruit, idx) => (
            <motion.button
              key={fruit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFruit(selectedFruit === fruit.id ? null : fruit.id)}
              className={`p-6 bg-gray-900 border-2 rounded-lg transition-all ${
                selectedFruit === fruit.id
                  ? 'border-primary shadow-neon'
                  : 'border-gray-800 hover:border-primary/50'
              }`}
            >
              <div className="text-6xl mb-4">{fruit.emoji}</div>
              <div className="text-xl font-headline font-bold text-white mb-2">{fruit.name}</div>
              <div className="text-sm text-gray-400">{fruit.description}</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedFruit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 p-6 bg-gray-900 border-2 border-primary rounded-lg text-center"
            >
              <div className="text-4xl mb-4">
                {fruits.find(f => f.id === selectedFruit)?.emoji}
              </div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-2">
                {fruits.find(f => f.id === selectedFruit)?.name}
              </h3>
              <p className="text-gray-300">
                {fruits.find(f => f.id === selectedFruit)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

