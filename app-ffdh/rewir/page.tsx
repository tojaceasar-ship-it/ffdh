'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import EmotionFilter from '@/components/EmotionFilter'
import SceneCard from '@/components/SceneCard'
import SceneMap from '@/components/SceneMap'
import SceneModal from '@/components/SceneModal'
import EmotionDetector from '@/components/EmotionDetector'
import { useEmotionProfile } from '@/hooks/useEmotionProfile'
import {
  EmotionScene,
  SceneReactionType,
  fetchEmotionScenes,
  onReactionUpdate,
  requestGeneratedScene,
  submitReaction,
} from '@/services/rewirService'
import { isEmotionKey } from '@/config/emotions'

export default function RewirPage() {
  const { profile, theme, setEmotion, setNickname, recordSceneVisit } = useEmotionProfile()

  const [scenes, setScenes] = useState<EmotionScene[]>([])
  const [filteredScenes, setFilteredScenes] = useState<EmotionScene[]>([])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedScene, setSelectedScene] = useState<EmotionScene | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reactingSlug, setReactingSlug] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadScenes = async () => {
      try {
        const { scenes: loadedScenes } = await fetchEmotionScenes()
        if (!isMounted) return
        setScenes(loadedScenes)
        setFilteredScenes(loadedScenes)
      } catch (err) {
        console.error('Failed to load scenes', err)
        setError('Unable to load scenes right now. Using offline set.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadScenes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setFilteredScenes((prev) => {
      if (selectedEmotions.length === 0) {
        return scenes
      }
      const sceneMap = new Map(scenes.map((scene) => [scene.slug, scene]))
      return Array.from(sceneMap.values()).filter((scene) =>
        scene.emotionTags.some((tag) => selectedEmotions.includes(tag))
      )
    })
  }, [scenes, selectedEmotions])

  useEffect(() => {
    if (scenes.length === 0) return
    const unsubscribeFns = scenes.map((scene) =>
      onReactionUpdate(scene.slug, ({ summary }) => {
        setScenes((current) =>
          current.map((item) =>
            item.slug === scene.slug
              ? {
                  ...item,
                  reactionSummary: summary,
                }
              : item
          )
        )
      })
    )

    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe?.())
    }
  }, [scenes])

  const availableEmotions = useMemo(
    () => Array.from(new Set(scenes.flatMap((scene) => scene.emotionTags))).sort(),
    [scenes]
  )

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((value) => value !== emotion) : [...prev, emotion]
    )
  }

  const handleGenerateScene = async () => {
    setIsGenerating(true)
    try {
      const generated = await requestGeneratedScene({ emotion: profile.mood })
      if (generated) {
        setScenes((prev) => [generated, ...prev])
        setSelectedScene(generated)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to generate new scene', error)
      setError('Generation failed. Try again soon.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReaction = async (scene: EmotionScene, reaction: SceneReactionType) => {
    setReactingSlug(scene.slug)
    try {
      const summary = await submitReaction(scene.slug, reaction, {
        nickname: profile.nickname,
        mood: profile.mood,
      })

      setScenes((prev) =>
        prev.map((item) =>
          item.slug === scene.slug
            ? {
                ...item,
                reactionSummary: summary,
              }
            : item
        )
      )
    } catch (error) {
      console.error('Reaction failed', error)
      setError('We could not record that reaction. Try refreshing?')
    } finally {
      setReactingSlug(null)
    }
  }

  const handleOpenScene = (scene: EmotionScene) => {
    setSelectedScene(scene)
    setIsModalOpen(true)
    recordSceneVisit(scene.slug)
  }

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value.slice(0, 24))
  }

  const handleMoodChange = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions((prev) => prev.filter((value) => value !== emotion))
    }
    if (isEmotionKey(emotion)) {
      setEmotion(emotion)
    }
  }

  return (
    <main
      className="min-h-screen pt-24 text-white"
      style={{
        backgroundImage: `radial-gradient(circle at top, ${theme.accentHex}15, transparent 45%), radial-gradient(circle at bottom, ${theme.accentHex}10, transparent 55%)`,
        backgroundColor: '#020202',
      }}
    >
      <section className="px-6 py-8">
        <motion.div
          className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur-lg lg:grid-cols-[2fr,1fr]"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Fruits From Da Hood</p>
            <h1 className="text-4xl font-headline font-bold tracking-tight text-white md:text-6xl">
              Rewir 2.0 — Emotional Scene Grid
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              AI-crafted fruit stories that react to your vibe. Tune the mood, drop a reaction, spin up fresh
              narratives, and watch the block respond in real time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={handleGenerateScene}
                disabled={isGenerating}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-black/40 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40"
                whileHover={isGenerating ? {} : { scale: 1.05 }}
                whileTap={isGenerating ? {} : { scale: 0.95 }}
              >
                {isGenerating ? 'Summoning scene…' : 'Generate fresh scene'}
              </motion.button>
              <button
                onClick={() => setShowMap((prev) => !prev)}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
              >
                {showMap ? 'Show Grid' : 'Emotion Map'}
              </button>
              <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                Mood: {profile.mood}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Personalise</h2>
            <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-white/40">Nickname</label>
            <input
              value={profile.nickname}
              onChange={handleNicknameChange}
              className="mb-5 w-full rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm text-white focus:border-white/60 focus:outline-none"
            />

            <div className="mb-6">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">EmotiLayer – Nastrój</p>
              <EmotionDetector showAnalyzeButton={true} className="py-2" />
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">Switch Mood</p>
            <div className="flex flex-wrap gap-2">
              {availableEmotions.slice(0, 8).map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleMoodChange(emotion)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
                    profile.mood === emotion ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            {profile.lastSceneSlug && (
              <p className="mt-6 text-xs text-white/50">
                Last visited scene: <span className="text-white/80">{profile.lastSceneSlug}</span>
              </p>
            )}
          </div>
        </motion.div>
      </section>

      {!showMap && scenes.length > 0 && (
        <motion.section className="px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/5 bg-black/50 p-8 backdrop-blur-lg">
            <EmotionFilter emotions={availableEmotions} selectedEmotions={selectedEmotions} onToggle={handleEmotionToggle} />
            {selectedEmotions.length > 0 && (
              <button
                onClick={() => setSelectedEmotions([])}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 hover:text-white/70"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.section>
      )}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="py-24 text-center text-sm text-white/60">Loading the block…</div>
          ) : error && scenes.length === 0 ? (
            <div className="py-24 text-center text-sm text-red-400">{error}</div>
          ) : scenes.length === 0 ? (
            <div className="py-24 text-center text-sm text-white/60">
              No scenes yet. Add content in Sanity or generate a fresh drop.
            </div>
          ) : showMap ? (
            <SceneMap scenes={filteredScenes} onEmotionClick={handleEmotionToggle} />
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {filteredScenes.map((scene) => (
                <motion.div key={scene.slug} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <SceneCard
                    scene={scene}
                    onOpen={handleOpenScene}
                    onReact={(reaction) => handleReaction(scene, reaction)}
                    isReacting={reactingSlug === scene.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!showMap && !loading && filteredScenes.length === 0 && scenes.length > 0 && (
            <div className="py-20 text-center text-sm text-white/60">
              Nothing matches those emotions. Try clearing filters or change your mood.
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-black/60 p-10 text-white/70 backdrop-blur-lg">
          <h2 className="mb-4 text-2xl font-headline font-bold text-white">About Rewir</h2>
          <p className="mb-4">
            Rewir 2.0 is a living mural of fruit emotions—part archive, part AI dreamscape. Scenes stream in from
            Sanity CMS, Supabase, and on-device generators, weaving moods across the block.
          </p>
          <p className="mb-4">
            Reactions pulse in real time, comments ride through Supabase, and your personal vibe shifts the visual
            language. No account needed—nicknames stay local, emotions stay yours.
          </p>
          <p>
            Tip: fire off a new scene when the mood changes. The AI will mirror back a fresh fruit fable tuned to your
            wavelength.
          </p>
        </div>
      </section>

      <SceneModal scene={selectedScene ?? undefined} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
