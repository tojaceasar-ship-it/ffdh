'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AIReplyBox from '@/components/AIReplyBox'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Scene {
  slug: string
  title: string
  description?: string
  narrative?: string
  image?: string
  emotionTags?: string[]
  viewCount?: number
  commentCount?: number
  comments?: Array<{ id: number; user: string; emotion?: string; text: string }>
}

// Fallback mock data if API unavailable
const mockScenes: Record<string, Scene> = {
  'urban-banana-blues': {
    slug: 'urban-banana-blues',
    title: 'Urban Banana Blues',
    description: 'A melancholic journey through city streets',
    narrative:
      'Yellow skin reflects the city lights. A wise old banana sits on a cold concrete bench, watching the world rush by. In this moment of solitude, memories of tropical warmth fade into neon glow.',
    image: 'https://via.placeholder.com/800x600?text=Urban+Banana+Blues',
    emotionTags: ['sadness', 'nostalgia', 'urban'],
    viewCount: 1203,
    commentCount: 12,
    comments: [
      { id: 1, user: 'Anonymous', emotion: 'sadness', text: 'This hits different 💛' },
      { id: 2, user: 'Anonymous', emotion: 'peace', text: 'So beautiful and melancholic' },
    ],
  },
}

export default function SceneDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const [scene, setScene] = useState<Scene | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch scene data from API
  useEffect(() => {
    async function fetchScene() {
      try {
        const response = await fetch(`/api/scenes/index?slug=${slug}&limit=1`)
        const data = await response.json()

        if (data.success && data.scenes && data.scenes.length > 0) {
          const apiScene = data.scenes[0]
          setScene({
            slug: apiScene.slug,
            title: apiScene.title || apiScene.name || 'Untitled Scene',
            description: apiScene.description,
            narrative: apiScene.narrative,
            image: apiScene.image_url,
            emotionTags: apiScene.emotion_tags || [],
            viewCount: apiScene.view_count || 0,
            commentCount: apiScene.comment_count || 0,
            comments: [], // Will be fetched separately if needed
          })
        } else {
          // Fallback to mock data
          setScene(mockScenes[slug] || mockScenes['urban-banana-blues'])
        }
      } catch (err) {
        console.error('Error fetching scene:', err)
        setError('Failed to load scene')
        // Fallback to mock data
        setScene(mockScenes[slug] || mockScenes['urban-banana-blues'])
      } finally {
        setLoading(false)
      }
    }

    fetchScene()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-gray-400">Loading scene...</p>
        </div>
      </main>
    )
  }

  if (!scene) {
    return (
      <main className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold mb-4 text-neon-yellow">Scene not found</h1>
          <Link href="/rewir" className="text-neon-cyan hover:underline">
            Back to Rewir
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      {/* Hero Image */}
      <motion.div
        className="relative h-96 md:h-screen bg-gray-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src={scene.image}
          alt={scene.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title & Meta */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 text-neon-yellow">
            {scene.title}
          </h1>

          <div className="flex gap-6 text-gray-400 mb-6">
            <span>👁️ {scene.viewCount} views</span>
            <span>💬 {scene.commentCount} comments</span>
          </div>

          {/* Emotion Tags */}
          {scene.emotionTags && scene.emotionTags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {scene.emotionTags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block bg-neon-yellow/20 text-neon-yellow px-4 py-2 rounded-full text-sm font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Narrative */}
        {scene.narrative && (
          <motion.div
            className="bg-gray-900/50 border-2 border-neon-cyan/30 rounded-lg p-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-headline font-bold mb-4 text-neon-cyan">
              Naracja
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">{scene.narrative}</p>
          </motion.div>
        )}

        {/* AI Reply Box */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AIReplyBox
            sceneId={scene.slug}
            sceneTitle={scene.title}
            onSubmit={(comment, emotion) => {
              console.log('Comment submitted:', { comment, emotion })
              // Scene will refresh to show new comment
            }}
          />
        </motion.div>

        {/* Comments Section */}
        {scene.comments && scene.comments.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-headline font-bold mb-6 text-neon-cyan">
              Odpowiedzi ({scene.comments.length})
            </h2>

            <div className="space-y-4">
              {scene.comments.map((c: any) => (
                <motion.div
                  key={c.id}
                  className="bg-gray-900/50 border border-neon-yellow/20 rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-400">{c.user}</span>
                    {c.emotion && (
                      <span className="text-xs bg-neon-yellow/20 text-neon-yellow px-2 py-1 rounded">
                        {c.emotion}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300">{c.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <Link
          href="/rewir"
          className="inline-block px-6 py-3 border-2 border-neon-yellow text-neon-yellow font-bold rounded-lg hover:bg-neon-yellow/10 transition-all"
        >
          ← Wróć do Rewiru
        </Link>
      </motion.div>
    </main>
  )
}
