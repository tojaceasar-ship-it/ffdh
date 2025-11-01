'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface SceneCardProps {
  slug: string
  title: string
  description?: string
  image?: string
  emotionTags?: string[]
  commentCount?: number
}

export default function SceneCard({
  slug,
  title,
  description,
  image,
  emotionTags = [],
  commentCount = 0,
}: SceneCardProps) {
  return (
    <motion.div
      className="group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/scena/${slug}`}>
        <div className="bg-black border-2 border-neon-yellow/20 rounded-lg overflow-hidden hover:border-neon-cyan/80 transition-all">
          {/* Image */}
          <div className="relative h-56 bg-gray-900 overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-white font-headline font-bold text-lg mb-2 line-clamp-2">
              {title}
            </h3>

            {description && (
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                {description}
              </p>
            )}

            {/* Emotion Tags */}
            {emotionTags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {emotionTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-neon-yellow/10 text-neon-yellow text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>💬 {commentCount} comments</span>
              <span className="text-neon-yellow hover:text-neon-cyan transition-colors">
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
