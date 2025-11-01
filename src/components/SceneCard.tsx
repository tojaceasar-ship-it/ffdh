'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { EmotionTheme, getEmotionTheme } from '@/config/emotions'
import { EmotionScene, SceneReactionType } from '@/services/rewirService'

const reactionIcons: Record<SceneReactionType, string> = {
  love: '❤️',
  rage: '😡',
  sad: '😢',
  joy: '😆',
  mindblown: '🤯',
}

interface SceneCardProps {
  scene: EmotionScene
  onOpen: (scene: EmotionScene) => void
  onReact: (reaction: SceneReactionType) => void
  isReacting?: boolean
}

export default function SceneCard({ scene, onOpen, onReact, isReacting = false }: SceneCardProps) {
  const theme: EmotionTheme = getEmotionTheme(scene.dominantEmotion)

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-black/90 via-black/70 to-black/40"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
      style={{ boxShadow: `0 0 25px -10px ${theme.accentHex}` }}
    >
      <div className={`absolute inset-0 pointer-events-none opacity-70 bg-gradient-to-br ${theme.gradient}`} />
      <div className="relative flex flex-col h-full">
        <div className="relative h-64 overflow-hidden">
          {scene.imageUrl ? (
            <img
              src={scene.imageUrl}
              alt={scene.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">🍉</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-wide text-white">
            <span>{reactionIcons.joy}</span>
            <span className="font-bold">{theme.name}</span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <div className="mb-4 space-y-2">
            <h3 className="text-2xl font-headline font-bold text-white drop-shadow-sm">{scene.title}</h3>
            {scene.description && (
              <p className="text-sm text-gray-200/80 line-clamp-3">{scene.description}</p>
            )}
          </div>

          {scene.emotionTags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {scene.emotionTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>👁️ {scene.viewCount}</span>
              <span>💬 {scene.commentCount}</span>
              <span>🌡️ {scene.dominantEmotion}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {(Object.keys(reactionIcons) as SceneReactionType[]).map((key) => (
                  <motion.button
                    key={key}
                    onClick={() => onReact(key)}
                    className={`flex items-center gap-1 rounded-full border border-white/20 px-3 py-2 text-sm text-white/90 backdrop-blur ${{
                      love: 'hover:bg-pink-500/20',
                      rage: 'hover:bg-red-500/20',
                      sad: 'hover:bg-blue-500/20',
                      joy: 'hover:bg-yellow-400/20',
                      mindblown: 'hover:bg-purple-500/20',
                    }[key]}`}
                    whileTap={{ scale: 0.92 }}
                    disabled={isReacting}
                    aria-label={`React with ${key}`}
                  >
                    <span>{reactionIcons[key]}</span>
                    <span className="text-xs font-semibold">
                      {scene.reactionSummary[key] ?? 0}
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => onOpen(scene)}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-black shadow-lg shadow-black/30 transition hover:bg-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Scene
              </motion.button>
            </div>

            <Link
              href={`/rewir/${scene.slug}`}
              className="block text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
            >
              Full story ↗
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
