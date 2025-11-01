'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

// Mock scene data - replace with Sanity fetch
const mockScenes: Record<string, any> = {
  'urban-banana-blues': {
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
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  const scene = mockScenes[params.slug] || mockScenes['urban-banana-blues']

  const emotions = ['joy', 'sadness', 'anger', 'love', 'fear', 'surprise', 'peace', 'nostalgia']

  const handleSubmitComment = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would call /api/comments to save the comment
      console.log('Comment submitted:', { text: comment, emotion: selectedEmotion })

      setComment('')
      setSelectedEmotion(null)
    } finally {
      setIsSubmitting(false)
    }
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
        </div>

        {/* Narrative */}
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

        {/* AI Reply Box */}
        <motion.div
          className="bg-gray-900/50 border-2 border-neon-yellow/30 rounded-lg p-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-headline font-bold mb-6 text-neon-yellow">
            🤖 Odpowiedz AI
          </h2>

          <p className="text-gray-400 mb-4">
            Powiedz nam, co o tym myślisz. AI odpowie Ci z empatią.
          </p>

          {/* Emotion Selector */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Jaka emocja? (opcjonalnie)</p>
            <div className="flex gap-2 flex-wrap">
              {emotions.map((emotion) => (
                <motion.button
                  key={emotion}
                  onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedEmotion === emotion
                      ? 'bg-neon-yellow text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {emotion}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napisz swoją odpowiedź... (anonimowo)"
            className="w-full bg-black border-2 border-neon-yellow/30 rounded-lg p-4 text-white placeholder-gray-600 focus:border-neon-yellow outline-none mb-4 resize-none"
            rows={4}
          />

          <motion.button
            onClick={handleSubmitComment}
            disabled={!comment.trim() || isSubmitting}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              !comment.trim() || isSubmitting
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-neon-yellow text-black hover:bg-neon-cyan'
            }`}
            whileHover={comment.trim() ? { scale: 1.02 } : {}}
            whileTap={comment.trim() ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? '⏳ Wysyłanie...' : '✉️ Wyślij odpowiedź'}
          </motion.button>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-headline font-bold mb-6 text-neon-cyan">
            Odpowiedzi ({scene.comments?.length || 0})
          </h2>

          <div className="space-y-4">
            {scene.comments?.map((c: any) => (
              <motion.div
                key={c.id}
                className="bg-gray-900/50 border border-neon-yellow/20 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-400">{c.user}</span>
                  <span className="text-xs bg-neon-yellow/20 text-neon-yellow px-2 py-1 rounded">
                    {c.emotion}
                  </span>
                </div>
                <p className="text-gray-300">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
