import autoScenes from '../../content/auto_scenes.json'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { EmotionKey, emotionThemes, isEmotionKey } from '@/config/emotions'
import { normalizeValue, normalizeArray, normalizeNumber, normalizeBoolean } from '@/utils/normalize'

type AutoScene = (typeof autoScenes)[number]

export type SceneReactionType = 'love' | 'rage' | 'sad' | 'joy' | 'mindblown'

export interface SceneReactionSummary {
  love: number
  rage: number
  sad: number
  joy: number
  mindblown: number
}

export interface EmotionScene {
  slug: string
  title: string
  description?: string
  narrative?: string
  imageUrl?: string
  emotionTags: string[]
  dominantEmotion: EmotionKey
  commentCount: number
  viewCount: number
  source: 'supabase' | 'sanity' | 'auto' | 'generated'
  reactionSummary: SceneReactionSummary
  createdAt?: string
  updatedAt?: string
}

const DEFAULT_REACTIONS: SceneReactionSummary = {
  love: 0,
  rage: 0,
  sad: 0,
  joy: 0,
  mindblown: 0,
}

const computeSummaryFromRows = (rows: Array<{ reaction: SceneReactionType }>): SceneReactionSummary => {
  const summary: SceneReactionSummary = { ...DEFAULT_REACTIONS }
  rows.forEach((row) => {
    if (row.reaction in summary) {
      summary[row.reaction] += 1
    }
  })
  return summary
}

const fetchReactionSummary = async (slug: string): Promise<SceneReactionSummary> => {
  try {
    const { data, error } = await supabase
      .from('scene_reaction_summary')
      .select('*')
      .eq('scene_slug', slug)
      .maybeSingle()

    if (!error && data) {
      return {
        love: data.love ?? 0,
        rage: data.rage ?? 0,
        sad: data.sad ?? 0,
        joy: data.joy ?? 0,
        mindblown: data.mindblown ?? 0,
      }
    }
  } catch (error) {
    console.warn('scene_reaction_summary view missing, falling back to direct aggregation', error)
  }

  try {
    const { data, error } = await supabase
      .from('scene_reactions')
      .select('reaction')
      .eq('scene_slug', slug)

    if (error || !data) {
      return { ...DEFAULT_REACTIONS }
    }

    return computeSummaryFromRows(data as Array<{ reaction: SceneReactionType }>)
  } catch (error) {
    console.error('Failed to aggregate reactions directly', error)
    return { ...DEFAULT_REACTIONS }
  }
}

const deriveDominantEmotion = (tags?: string[]): EmotionKey => {
  if (!tags || tags.length === 0) {
    return 'peace'
  }

  const direct = tags.find((tag) => isEmotionKey(tag));
  if (direct && isEmotionKey(direct)) {
    return direct;
  }

  const mapped = tags.find((tag) => {
    const lowercaseTag = tag.toLowerCase();
    return (Object.keys(emotionThemes) as EmotionKey[]).some((emotion) => lowercaseTag.includes(emotion))
  })

  if (mapped && isEmotionKey(mapped)) {
    return mapped
  }

  return 'peace'
}

const normaliseScene = (scene: Partial<EmotionScene> & { slug?: string | null; title?: string | null }): EmotionScene | null => {
  const slug = scene.slug
  if (!slug) return null

  const emotionTags = normalizeArray(scene.emotionTags)
  const dominantEmotion = deriveDominantEmotion(emotionTags)

  return {
    slug,
    title: normalizeValue(scene.title, 'Untitled Scene'),
    description: normalizeValue(scene.description, ''),
    narrative: normalizeValue(scene.narrative, ''),
    imageUrl: scene.imageUrl,
    emotionTags,
    dominantEmotion,
    commentCount: normalizeNumber(scene.commentCount, 0),
    viewCount: normalizeNumber(scene.viewCount, 0),
    source: normalizeValue(scene.source, 'auto'),
    reactionSummary: { ...DEFAULT_REACTIONS, ...(scene.reactionSummary ?? {}) },
    createdAt: scene.createdAt,
    updatedAt: scene.updatedAt,
  }
}

const mapAutoScene = (scene: AutoScene): EmotionScene =>
  normaliseScene({
    slug: scene.slug,
    title: scene.title,
    description: scene.description,
    narrative: scene.narrative,
    imageUrl: scene.imageUrl,
    emotionTags: scene.emotionTags ?? [],
    source: 'auto',
  }) as EmotionScene

const dedupeScenes = (scenes: EmotionScene[]): EmotionScene[] => {
  const map = new Map<string, EmotionScene>()
  for (const scene of scenes) {
    if (!map.has(scene.slug)) {
      map.set(scene.slug, scene)
    }
  }
  return Array.from(map.values())
}

export async function fetchEmotionScenes(): Promise<{ scenes: EmotionScene[]; usedSupabase: boolean }> {
  const autoSceneData = autoScenes.map(mapAutoScene)

  if (!isSupabaseConfigured) {
    return {
      scenes: autoSceneData,
      usedSupabase: false,
    }
  }

  try {
    const { data, error } = await supabase
      .from('scenes')
      .select('slug, title, description, narrative, image_url, emotion_tags, comment_count, view_count, updated_at, created_at, source')
      .order('updated_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('Supabase scenes fetch failed, falling back to auto scenes', error)
      return {
        scenes: autoSceneData,
        usedSupabase: false,
      }
    }

    const supabaseScenes = (data ?? [])
      .map((scene) =>
        normaliseScene({
          slug: scene.slug ?? undefined,
          title: scene.title ?? undefined,
          description: scene.description ?? undefined,
          narrative: scene.narrative ?? undefined,
          imageUrl: scene.image_url ?? undefined,
          emotionTags: (scene.emotion_tags as string[] | null) ?? [],
          commentCount: scene.comment_count ?? 0,
          viewCount: scene.view_count ?? 0,
          source: 'supabase',
          createdAt: scene.created_at ?? undefined,
          updatedAt: scene.updated_at ?? undefined,
        })
      )
      .filter((scene): scene is EmotionScene => Boolean(scene))

    return {
      scenes: dedupeScenes([...supabaseScenes, ...autoSceneData]),
      usedSupabase: true,
    }
  } catch (error) {
    console.warn('Failed to load scenes from Supabase, using fallback', error)
    return {
      scenes: autoSceneData,
      usedSupabase: false,
    }
  }
}

export async function fetchSceneBySlug(slug: string): Promise<EmotionScene | null> {
  const autoFallback = autoScenes.find((scene) => scene.slug === slug)
  if (!isSupabaseConfigured) {
    return autoFallback ? mapAutoScene(autoFallback) : null
  }

  try {
    const { data, error } = await supabase
      .from('scenes')
      .select('slug, title, description, narrative, image_url, emotion_tags, comment_count, view_count, updated_at, created_at, source')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.warn('Failed to load scene by slug from Supabase', error)
      return autoFallback ? mapAutoScene(autoFallback) : null
    }

    if (!data) {
      return autoFallback ? mapAutoScene(autoFallback) : null
    }

    return (
      normaliseScene({
        slug: data.slug ?? undefined,
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        narrative: data.narrative ?? undefined,
        imageUrl: data.image_url ?? undefined,
        emotionTags: (data.emotion_tags as string[] | null) ?? [],
        commentCount: data.comment_count ?? 0,
        viewCount: data.view_count ?? 0,
        source: 'supabase',
        createdAt: data.created_at ?? undefined,
        updatedAt: data.updated_at ?? undefined,
      }) ?? (autoFallback ? mapAutoScene(autoFallback) : null)
    )
  } catch (error) {
    console.error('Error fetching scene by slug', error)
    return autoFallback ? mapAutoScene(autoFallback) : null
  }
}

export interface GenerateScenePayload {
  prompt?: string
  emotion?: EmotionKey
  seed?: string
}

export async function requestGeneratedScene(payload: GenerateScenePayload): Promise<EmotionScene | null> {
  try {
    // Add timeout for fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

    let response: Response
    try {
      response = await fetch('/api/rewir/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (networkError) {
      clearTimeout(timeoutId)
      if (networkError instanceof Error && networkError.name === 'AbortError') {
        console.error('Request timeout: Scene generation did not respond in time')
        return null
      }
      console.error('Network error requesting generated scene:', networkError)
      return null
    }

    if (!response.ok) {
      console.warn('Failed to generate scene', await response.text())
      return null
    }

    const data = (await response.json()) as { scene?: EmotionScene }
    if (data.scene) {
      return normaliseScene({
        ...data.scene,
        source: 'generated',
      })
    }
  } catch (error) {
    console.error('Error requesting generated scene', error)
  }
  return null
}

const LOCAL_REACTION_KEY = 'ffdh-scene-reactions'

interface LocalReactionMap {
  [slug: string]: SceneReactionSummary
}

const getLocalReactions = (): LocalReactionMap => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = window.localStorage.getItem(LOCAL_REACTION_KEY)
    if (!stored) return {}
    return JSON.parse(stored) as LocalReactionMap
  } catch {
    return {}
  }
}

const persistLocalReactions = (map: LocalReactionMap) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCAL_REACTION_KEY, JSON.stringify(map))
  } catch (error) {
    console.warn('Failed to persist reactions locally', error)
  }
}

const submitReactionLocally = (slug: string, reaction: SceneReactionType): SceneReactionSummary => {
  const reactions = getLocalReactions()
  const existing = reactions[slug] ?? { ...DEFAULT_REACTIONS }
  existing[reaction] = (existing[reaction] ?? 0) + 1
  reactions[slug] = existing
  persistLocalReactions(reactions)
  announceLocalReaction(slug, existing)
  return existing
}

export async function submitReaction(
  slug: string,
  reaction: SceneReactionType,
  profile: { nickname: string; mood: EmotionKey }
): Promise<SceneReactionSummary> {
  if (!isSupabaseConfigured) {
    return submitReactionLocally(slug, reaction)
  }

  try {
    const { error } = await supabase
      .from('scene_reactions')
      .insert({
        scene_slug: slug,
        reaction,
        nickname: profile.nickname,
        mood: profile.mood,
      })

    if (error) {
      console.warn('Supabase reaction insert failed, falling back to local store', error)
      return submitReactionLocally(slug, reaction)
    }

    const summary = await fetchReactionSummary(slug)

    announceLocalReaction(slug, summary)
    return summary
  } catch (error) {
    console.error('Error recording reaction, using local fallback', error)
    return submitReactionLocally(slug, reaction)
  }
}

type ReactionListener = (payload: { slug: string; summary: SceneReactionSummary }) => void

const LOCAL_REACTION_EVENT = 'ffdh.rewir.reaction'

function announceLocalReaction(slug: string, summary: SceneReactionSummary) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(LOCAL_REACTION_EVENT, { detail: { slug, summary } }))
}

export function onReactionUpdate(slug: string, listener: ReactionListener) {
  if (typeof window === 'undefined') return () => {}

  if (isSupabaseConfigured) {
    const channel = supabase
      .channel(`scene-reactions-${slug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scene_reactions',
          filter: `scene_slug=eq.${slug}`,
        },
        async () => {
          try {
            const summary = await fetchReactionSummary(slug)
            listener({ slug, summary })
          } catch (error) {
            console.error('Failed to refresh reaction summary', error)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ slug: string; summary: SceneReactionSummary }>
    if (customEvent.detail.slug === slug) {
      listener(customEvent.detail)
    }
  }

  window.addEventListener(LOCAL_REACTION_EVENT, handler)
  return () => window.removeEventListener(LOCAL_REACTION_EVENT, handler)
}

const LOCAL_FEEDBACK_KEY = 'ffdh-feedback-log'

export interface FeedbackPayload {
  sceneSlug: string
  comment: string
  aiResponse: string
  mood: EmotionKey
  nickname: string
}

const storeFeedbackLocally = (payload: FeedbackPayload) => {
  if (typeof window === 'undefined') {
    return { storedLocally: true }
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(LOCAL_FEEDBACK_KEY) ?? '[]') as FeedbackPayload[]
    stored.push(payload)
    window.localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(stored.slice(-50)))
  } catch (error) {
    console.warn('Failed to store feedback locally', error)
  }

  return { storedLocally: true }
}

export async function logFeedback(payload: FeedbackPayload) {
  if (!isSupabaseConfigured) {
    return storeFeedbackLocally(payload)
  }

  try {
    const { error } = await supabase.from('feedback_logs').insert([
      {
        scene_slug: payload.sceneSlug,
        comment: payload.comment,
        ai_response: payload.aiResponse,
        mood: payload.mood,
        nickname: payload.nickname,
      },
    ])

    if (error) {
      console.warn('Supabase feedback insert failed, using fallback', error)
      return storeFeedbackLocally(payload)
    }

    return { storedLocally: false }
  } catch (error) {
    console.error('Error logging feedback, using fallback', error)
    return storeFeedbackLocally(payload)
  }
}

export const rewirConfig = {
  isSupabaseConfigured,
}

export interface SceneCommentPayload {
  id: string
  content: string
  emotion?: string | null
  ai_response?: string | null
  nickname?: string | null
  created_at?: string | null
}

const LOCAL_COMMENT_EVENT = 'ffdh.rewir.comment'

export function emitLocalComment(slug: string, comment: SceneCommentPayload) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(LOCAL_COMMENT_EVENT, { detail: { slug, comment } }))
}

export function onSceneComment(slug: string, listener: (comment: SceneCommentPayload) => void) {
  if (typeof window === 'undefined') return () => {}

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ slug: string; comment: SceneCommentPayload }>
    if (customEvent.detail.slug === slug) {
      listener(customEvent.detail.comment)
    }
  }

  window.addEventListener(LOCAL_COMMENT_EVENT, handler)
  return () => window.removeEventListener(LOCAL_COMMENT_EVENT, handler)
}


