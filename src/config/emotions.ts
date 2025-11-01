import emotionMap from '../../config/emotionMap.json'

type EmotionMap = typeof emotionMap

export type EmotionKey = keyof EmotionMap

export interface EmotionTheme {
  key: EmotionKey
  name: string
  gradient: string
  accentHex: string
  shadow: string
  emojiBurst: string[]
  fallbackResponses: string[]
}

const DEFAULT_EMOTION: EmotionKey = 'peace'

const normalisedMap: Record<EmotionKey, EmotionTheme> = Object.entries(emotionMap).reduce(
  (acc, [key, value]) => {
    const emotionKey = key as EmotionKey
    acc[emotionKey] = {
      key: emotionKey,
      name: value.name,
      gradient: value.gradient,
      accentHex: value.accentHex,
      shadow: value.shadow,
      emojiBurst: value.emojiBurst,
      fallbackResponses: value.fallbackResponses,
    }
    return acc
  },
  {} as Record<EmotionKey, EmotionTheme>
)

export function isEmotionKey(emotion?: string | null): emotion is EmotionKey {
  return !!emotion && Object.prototype.hasOwnProperty.call(normalisedMap, emotion)
}

export function getEmotionTheme(emotion?: string | null): EmotionTheme {
  if (isEmotionKey(emotion)) {
    return normalisedMap[emotion]
  }
  return normalisedMap[DEFAULT_EMOTION]
}

export function getRandomEmotion(): EmotionTheme {
  const keys = Object.keys(normalisedMap) as EmotionKey[]
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return normalisedMap[randomKey]
}

export const emotionThemes = normalisedMap

