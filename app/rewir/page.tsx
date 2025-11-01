'use client'

import { motion } from 'framer-motion'
import SceneCard from '@/components/SceneCard'

// Temporary mock data - replace with Sanity
const mockScenes = [
  {
    slug: 'urban-banana-blues',
    title: 'Urban Banana Blues',
    description: 'A melancholic journey through city streets with a wise old banana...',
    image: 'https://via.placeholder.com/300x300?text=Scene+1',
    emotionTags: ['sadness', 'nostalgia', 'urban'],
    commentCount: 12,
  },
  {
    slug: 'strawberry-revolution',
    title: 'Strawberry Revolution',
    description: 'When fruits rise up against the system. A tale of rebellion...',
    image: 'https://via.placeholder.com/300x300?text=Scene+2',
    emotionTags: ['anger', 'empowerment', 'political'],
    commentCount: 28,
  },
  {
    slug: 'mango-dreams',
    title: 'Mango Dreams',
    description: 'Sweet fantasies of tropical paradise in a concrete jungle...',
    image: 'https://via.placeholder.com/300x300?text=Scene+3',
    emotionTags: ['joy', 'hope', 'dreamy'],
    commentCount: 45,
  },
  {
    slug: 'apple-reflections',
    title: 'Apple Reflections',
    description: 'A serene moment of self-discovery beneath the city lights...',
    image: 'https://via.placeholder.com/300x300?text=Scene+4',
    emotionTags: ['contemplation', 'peace', 'introspection'],
    commentCount: 18,
  },
  {
    slug: 'grape-chaos',
    title: 'Grape Chaos',
    description: 'When the grapes go wild in the marketplace of life...',
    image: 'https://via.placeholder.com/300x300?text=Scene+5',
    emotionTags: ['confusion', 'energy', 'chaos'],
    commentCount: 33,
  },
  {
    slug: 'orange-connection',
    title: 'Orange Connection',
    description: 'Finding unity and connection in a fragmented world...',
    image: 'https://via.placeholder.com/300x300?text=Scene+6',
    emotionTags: ['love', 'unity', 'warmth'],
    commentCount: 52,
  },
]

export default function RewirPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      {/* Hero */}
      <motion.section
        className="py-12 px-6 bg-gradient-to-b from-neon-cyan/5 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 text-neon-cyan">
            🎭 Rewir
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Emotional scenes from the streets. AI-generated narratives exploring
            urban culture, feelings, and fruit-inspired tales. Join the community.
          </p>
        </div>
      </motion.section>

      {/* Observer Mode Toggle (Placeholder) */}
      <motion.section
        className="py-6 px-6 border-b border-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <label className="text-gray-400 text-sm">
            🎭 Observer Mode (Anonymous):
          </label>
          <motion.button
            className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-lg font-cta hover:bg-neon-cyan/30 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Enable
          </motion.button>
        </div>
      </motion.section>

      {/* Scenes Grid */}
      <motion.section
        className="py-12 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              staggerChildren: 0.1,
              delayChildren: 0.2,
            }}
          >
            {mockScenes.map((scene, idx) => (
              <motion.div
                key={scene.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <SceneCard {...scene} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Info Box */}
      <motion.section
        className="py-12 px-6 bg-neon-cyan/5 border-t border-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-headline font-bold mb-4 text-neon-cyan">
            ✨ About the Rewir
          </h2>
          <p className="text-gray-400 mb-6">
            The Rewir is an emotional sanctuary where urban tales come to life. Each scene
            combines street photography vibes with AI-generated narratives, creating unique
            stories about fruits navigating the concrete jungle.
          </p>
          <p className="text-gray-400">
            Engage with scenes, share your emotions, and let AI craft responses. Your feedback
            helps shape the narrative landscape. All interactions are anonymous and moderated
            for safety.
          </p>
        </div>
      </motion.section>
    </main>
  )
}
