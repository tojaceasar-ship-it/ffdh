'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'

interface SceneModalProps {
  scene?: {
    slug: string
    title: string
    description?: string
    image?: string
    emotionTags?: string[]
    commentCount?: number
  }
  isOpen: boolean
  onClose: () => void
}

export default function SceneModal({ scene, isOpen, onClose }: SceneModalProps) {
  if (!scene) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl z-50 bg-black border-2 border-neon-yellow/30 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="relative h-64 bg-gray-900">
              {scene.image && (
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-3xl font-headline font-bold text-white mb-2">
                  {scene.title}
                </h2>
                <div className="flex gap-4 text-gray-400">
                  <span>💬 {scene.commentCount || 0} comments</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {scene.description && (
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {scene.description}
                </p>
              )}

              {/* Emotion Tags */}
              {scene.emotionTags && scene.emotionTags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {scene.emotionTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-neon-yellow/20 text-neon-yellow px-3 py-1 rounded-full text-sm font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link
                href={`/scena/${scene.slug}`}
                onClick={onClose}
                className="inline-block w-full text-center px-6 py-3 bg-neon-yellow text-black font-bold rounded-lg hover:bg-neon-cyan transition-all"
              >
                View Full Scene →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

