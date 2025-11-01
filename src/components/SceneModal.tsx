'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import { EmotionTheme, getEmotionTheme } from '@/config/emotions'
import { EmotionScene, SceneReactionType } from '@/services/rewirService'
import { useMoodContext } from '@/contexts/MoodContext'
import { MotionVariant } from '@/config/moodVariants'

const reactionIcons: Record<SceneReactionType, string> = {
  love: '❤️',
  rage: '😡',
  sad: '😢',
  joy: '😆',
  mindblown: '🤯',
}

/**
 * Motion variants dla SceneModal w zależności od nastroju
 */
const getModalVariants = (motionType: MotionVariant): Variants => {
  const baseInitial = { opacity: 0, scale: 0.95 }
  const baseExit = { opacity: 0, scale: 0.95 }

  switch (motionType) {
    case 'shake':
      return {
        initial: baseInitial,
        animate: { opacity: 1, scale: 1, x: [0, -3, 3, -3, 3, 0] },
        exit: baseExit,
      }
    case 'bounce':
      return {
        initial: baseInitial,
        animate: { opacity: 1, scale: 1, y: [0, -10, 0] },
        exit: baseExit,
      }
    case 'glow':
      return {
        initial: baseInitial,
        animate: {
          opacity: 1,
          scale: 1,
          boxShadow: [
            '0 0 20px rgba(147, 51, 234, 0.3)',
            '0 0 40px rgba(147, 51, 234, 0.6)',
            '0 0 20px rgba(147, 51, 234, 0.3)',
          ],
        },
        exit: baseExit,
      }
    case 'float':
      return {
        initial: baseInitial,
        animate: { opacity: 1, scale: 1, y: [0, -5, 0] },
        exit: baseExit,
      }
    case 'fade':
    default:
      return {
        initial: baseInitial,
        animate: { opacity: 1, scale: 1 },
        exit: baseExit,
      }
  }
}

interface SceneModalProps {
  scene?: EmotionScene
  isOpen: boolean
  onClose: () => void
}

export default function SceneModal({ scene, isOpen, onClose }: SceneModalProps) {
  // Hooks must be called unconditionally
  const { motion: moodMotion } = useMoodContext()
  const modalVariants = getModalVariants(moodMotion)

  if (!scene) return null

  const theme: EmotionTheme = getEmotionTheme(scene.dominantEmotion)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-4 z-50 mx-auto flex max-w-5xl grow flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/80 backdrop-blur-2xl md:inset-auto md:top-1/2 md:-translate-y-1/2"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative h-64 overflow-hidden">
              {scene.imageUrl ? (
                <img src={scene.imageUrl} alt={scene.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">🍉</div>
              )}
              <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-70`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                aria-label="Close scene preview"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/60">Emotional Scene</p>
                <h2 className="text-3xl font-headline font-bold text-white md:text-4xl">{scene.title}</h2>
              </div>
            </div>

            <div className="grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                {scene.description && <p className="text-sm text-white/70">{scene.description}</p>}
                {scene.narrative && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-inner">
                    <p className="leading-relaxed whitespace-pre-line">{scene.narrative}</p>
                  </div>
                )}

                {scene.emotionTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scene.emotionTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase text-white/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-xs text-white/70">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Pulse</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <span>👁️ Views {scene.viewCount}</span>
                    <span>💬 Comments {scene.commentCount}</span>
                    <span>🌡️ Mood {scene.dominantEmotion}</span>
                    <span>
                      🔥 Reactions {Object.values(scene.reactionSummary).reduce((acc, value) => acc + value, 0)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(Object.keys(reactionIcons) as SceneReactionType[]).map((key) => (
                      <div key={key} className="flex items-center justify-between rounded-full bg-white/5 px-3 py-2">
                        <span>{reactionIcons[key]}</span>
                        <span className="text-xs font-semibold">{scene.reactionSummary[key] ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/rewir/${scene.slug}`}
                  onClick={onClose}
                  className="block rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-black shadow transition hover:bg-white/90"
                >
                  Enter full scene ↗
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

