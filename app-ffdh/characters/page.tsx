'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { charactersService } from '@/services/charactersService'

interface CharacterProfile {
  id: number
  name: string
  nickname?: string
  personality?: string
  backstory?: string
  traits?: string[]
  quote?: string
  image?: string
  bgGradient?: string
  color?: string
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<CharacterProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await charactersService.getCharacters()
        if (!isMounted) return
        setCharacters(data)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Rewir roster</p>
          <h1 className="mt-4 text-4xl font-headline font-bold md:text-5xl">Fruit personas of the block</h1>
          <p className="mt-6 text-sm text-white/70">
            Meet the characters anchoring our universe—each with their own mood, rhythm, and backstory. These profiles feed directly into Rewir scenes.
          </p>
        </motion.div>
      </section>

      <section className="px-6 pb-20">
        {loading ? (
          <div className="py-24 text-center text-sm text-white/60">Loading crew files…</div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3">
            {characters.map((character, index) => (
              <motion.article
                key={character.id}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-headline font-bold text-white">{character.name}</h2>
                    <span className="text-sm text-white/50">{character.nickname}</span>
                  </div>
                  {character.quote && <p className="mt-4 text-sm text-neon-yellow">“{character.quote}”</p>}
                  {character.backstory && <p className="mt-4 text-sm text-white/70">{character.backstory}</p>}
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/40">
                  {character.traits?.slice(0, 4).map((trait) => (
                    <span key={trait} className="rounded-full bg-white/10 px-3 py-1 text-white/70">
                      {trait}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}


