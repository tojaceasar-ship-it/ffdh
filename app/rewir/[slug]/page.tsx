'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AIReplyBox from '@/components/AIReplyBox'
import CommentsFeed from '@/components/CommentsFeed'
import { useEmotionProfile } from '@/hooks/useEmotionProfile'
import {
  EmotionScene,
  SceneReactionType,
  fetchSceneBySlug,
  onReactionUpdate,
  submitReaction,
} from '@/services/rewirService'
import { getEmotionTheme } from '@/config/emotions'


export default function SceneDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const router = useRouter()
  const { profile, setEmotion, recordSceneVisit } = useEmotionProfile()

  const [scene, setScene] = useState<EmotionScene | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reacting, setReacting] = useState(false)


  useEffect(() => {
    let isMounted = true

    const hydrate = async () => {
      try {
        const loadedScene = await fetchSceneBySlug(slug)
        if (!isMounted) return

        if (!loadedScene) {
          setError('Scene not found. Maybe it moved?')
          setLoading(false)
          return
        }

        setScene(loadedScene)
        recordSceneVisit(loadedScene.slug)
        if (loadedScene.dominantEmotion) {
          setEmotion(loadedScene.dominantEmotion)
        }
      } catch (err) {
        console.error(err)
        if (!isMounted) return
        setError('We could not fetch this scene right now.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    hydrate()

    return () => {
      isMounted = false
    }
  }, [slug, recordSceneVisit, setEmotion])

  useEffect(() => {
    if (!scene) return
    const unsubscribe = onReactionUpdate(scene.slug, ({ summary }) => {
      setScene((current) => (current ? { ...current, reactionSummary: summary } : current))
    })
    return () => unsubscribe?.()
  }, [scene])

  // CommentsFeed handles comments via Supabase subscription

  const theme = useMemo(() => getEmotionTheme(scene?.dominantEmotion), [scene?.dominantEmotion])

  const handleReaction = async (reaction: SceneReactionType) => {
    if (!scene) return
    setReacting(true)
    try {
      const summary = await submitReaction(scene.slug, reaction, {
        nickname: profile.nickname,
        mood: profile.mood,
      })
      setScene((current) => (current ? { ...current, reactionSummary: summary } : current))
    } catch (error) {
      console.error(error)
      setError('Reaction failed. Try again later.')
    } finally {
      setReacting(false)
    }
  }

  const handleFeedbackSubmit = ({ comment, emotion, aiResponse }: { comment: string; emotion?: string; aiResponse?: string }) => {
    // CommentsFeed handles comment updates via Supabase subscription
    // This callback can be used for additional actions (e.g., analytics)
    console.log('Comment submitted:', { comment, emotion, hasAIResponse: !!aiResponse })
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="space-y-4 text-center">
          <div className="text-5xl">🍉</div>
          <p className="text-sm text-white/60">Loading scene…</p>
        </div>
      </main>
    )
  }

  if (!scene || error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
        <p className="text-lg text-white/70">{error || 'Scene went missing.'}</p>
        <button
          onClick={() => router.push('/rewir')}
          className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
        >
          Back to Rewir grid
        </button>
      </main>
    )
  }

  const totalReactions = Object.values(scene.reactionSummary).reduce((acc, value) => acc + value, 0)

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-[60vh] w-full overflow-hidden">
        {scene.imageUrl ? (
          <img src={scene.imageUrl} alt={scene.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">🍍</div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="absolute bottom-16 left-1/2 w-full max-w-5xl -translate-x-1/2 px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Fruit emotion story</p>
            <h1 className="mt-3 text-4xl font-headline font-bold md:text-6xl">{scene.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span>👁️ {scene.viewCount}</span>
              <span>💬 {scene.commentCount}</span>
              <span>🌡️ {scene.dominantEmotion}</span>
              <span>🔥 {totalReactions}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          {scene.description && (
            <p className="text-lg text-white/70">{scene.description}</p>
          )}

          {scene.narrative && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-base text-white/80 leading-relaxed whitespace-pre-line">
              {scene.narrative}
            </div>
          )}

          {scene.emotionTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {scene.emotionTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <CommentsFeed sceneSlug={scene.slug} onCommentAdded={() => {
              // Refresh comments if needed
            }} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-black/60 p-8">
            <h2 className="mb-6 text-lg font-headline font-bold">React to the vibe</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['love', 'joy', 'sad', 'rage', 'mindblown'] as SceneReactionType[]).map((reaction) => (
                <motion.button
                  key={reaction}
                  onClick={() => handleReaction(reaction)}
                  disabled={reacting}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:border-white/30"
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="mr-2 text-lg">{
                    {
                      love: '❤️',
                      joy: '😆',
                      sad: '😢',
                      rage: '😡',
                      mindblown: '🤯',
                    }[reaction]
                  }</span>
                  {scene.reactionSummary[reaction]} reacts
                </motion.button>
              ))}
            </div>
          </div>

          <AIReplyBox
            sceneId={scene.slug}
            sceneTitle={scene.title}
            nickname={profile.nickname}
            mood={profile.mood}
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </section>
    </main>
  )
}


