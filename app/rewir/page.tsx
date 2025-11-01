'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SceneCard from '@/components/SceneCard'

interface Scene {
  slug: string
  title: string
  description?: string
  image?: string
  emotionTags?: string[]
  commentCount?: number
}

// Fallback mock data if Supabase fetch fails
const fallbackScenes: Scene[] = [
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
]

export default function RewirPage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchScenes() {
      try {
        const response = await fetch('/api/scenes/index?limit=50')
        const data = await response.json()

        if (data.success && data.scenes && data.scenes.length > 0) {
          // Transform Supabase scenes to SceneCard format
          const transformedScenes: Scene[] = data.scenes.map((scene: any) => ({
            slug: scene.slug,
            title: scene.title || scene.name || 'Untitled Scene',
            description: scene.description || '',
            image: scene.image_url || 'https://via.placeholder.com/300x300?text=Scene',
            emotionTags: scene.emotion_tags || [],
            commentCount: scene.comment_count || 0,
          }))
          setScenes(transformedScenes)
        } else {
          // Use fallback if no scenes found
          console.warn('No scenes found in Supabase, using fallback data')
          setScenes(fallbackScenes)
        }
      } catch (err) {
        console.error('Error fetching scenes:', err)
        setError('Failed to load scenes')
        // Use fallback on error
        setScenes(fallbackScenes)
      } finally {
        setLoading(false)
      }
    }

    fetchScenes()
  }, [])

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading scenes...</p>
            </div>
          ) : error && scenes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : scenes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No scenes available. Sync scenes from Sanity to get started.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                staggerChildren: 0.1,
                delayChildren: 0.2,
              }}
            >
              {scenes.map((scene, idx) => (
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
          )}
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
