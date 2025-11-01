'use client'

import { motion } from 'framer-motion'

interface Character {
  _id?: string
  name?: string
  nickname?: string
  description?: string
  image?: string
  emoji?: string
}

interface CharacterSpotlightProps {
  characters: Character[]
}

export default function CharacterSpotlight({ characters }: CharacterSpotlightProps) {
  if (!characters || characters.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-white">
            Character Universe
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Meet the fruits that define our culture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.slice(0, 6).map((character, idx) => (
            <motion.div
              key={character._id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border-2 border-gray-800 rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
            >
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name || character.nickname || 'Character'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-8xl">
                    {character.emoji || '🍉'}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-headline font-bold mb-2 text-white">
                  {character.name || character.nickname || 'Character'}
                </h3>
                {character.description && (
                  <p className="text-gray-400 line-clamp-3">{character.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

