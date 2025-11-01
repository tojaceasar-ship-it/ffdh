import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import autoScenes from '@/../content/auto_scenes.json'
import { EmotionKey, emotionThemes, isEmotionKey } from '@/config/emotions'
import { generateSceneNarrative } from '@/services/aiService'
import { SceneReactionSummary } from '@/services/rewirService'

const requestSchema = z.object({
  prompt: z.string().min(3).max(200).optional(),
  emotion: z.string().optional(),
  seed: z.string().optional(),
})

const DEFAULT_IMAGES: Record<EmotionKey, string> = {
  joy: '/meta/scene-joy.svg',
  sadness: '/meta/scene-sadness.svg',
  anger: '/meta/scene-anger.svg',
  peace: '/meta/scene-peace.svg',
  nostalgia: '/meta/scene-nostalgia.svg',
}

const DEFAULT_REACTIONS: SceneReactionSummary = {
  love: 0,
  rage: 0,
  sad: 0,
  joy: 0,
  mindblown: 0,
}

const pickAutoSceneSeed = (emotion: EmotionKey | null) => {
  if (!emotion) {
    return autoScenes[Math.floor(Math.random() * autoScenes.length)]
  }

  const candidates = autoScenes.filter((scene) => scene.emotionTags?.includes(emotion))
  if (candidates.length === 0) {
    return autoScenes[Math.floor(Math.random() * autoScenes.length)]
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const buildTitle = (prompt?: string, emotion?: EmotionKey): string => {
  if (prompt) {
    const cleaned = prompt.trim()
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  if (emotion && emotionThemes[emotion]) {
    return `${emotionThemes[emotion].name} Scene`
  }

  return 'Untitled Street Tale'
}

const determineEmotion = (value?: string | null): EmotionKey => {
  if (isEmotionKey(value)) {
    return value
  }

  if (!value) {
    return 'peace'
  }

  const candidate = (Object.keys(emotionThemes) as EmotionKey[]).find((emotion) =>
    value.toLowerCase().includes(emotion)
  )

  return candidate ?? 'peace'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, emotion: requestedEmotion, seed } = requestSchema.parse(body)

    const emotion = determineEmotion(requestedEmotion)
    const autoSeed = pickAutoSceneSeed(emotion)

    const baseText = prompt ?? autoSeed.description ?? autoSeed.narrative ?? 'Urban fruit dreaming under neon skies.'
    const narrative = await generateSceneNarrative(`${emotion} :: ${baseText}`)

    const title = buildTitle(prompt ?? autoSeed.title, emotion)
    const slugSource = slugify(`${title}-${emotion}`) || slugify(autoSeed.slug)
    const hashSeed = seed ?? randomUUID()
    const slug = `${slugSource}-${hashSeed.slice(0, 6)}`

    const scene = {
      slug,
      title,
      description: baseText,
      narrative,
      imageUrl: DEFAULT_IMAGES[emotion],
      emotionTags: Array.from(new Set([emotion, ...(autoSeed.emotionTags ?? [])])),
      dominantEmotion: emotion,
      commentCount: 0,
      viewCount: 0,
      source: 'generated' as const,
      reactionSummary: { ...DEFAULT_REACTIONS },
    }

    return NextResponse.json({
      success: true,
      scene,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Invalid payload', errors: error.errors }, { status: 400 })
    }

    console.error('Error generating Rewir scene', error)
    return NextResponse.json({ success: false, message: 'Failed to generate scene' }, { status: 500 })
  }
}


