/**
 * EmotiLayer - Mood Variants Configuration
 * Mapowanie nastrojów na klasy Tailwind i warianty animacji
 */

export type MoodKey = 'sad' | 'angry' | 'happy' | 'calm' | 'mixed'

export type MotionVariant = 'fade' | 'shake' | 'bounce' | 'float' | 'glow'

export interface MoodVariant {
  bg: string
  text: string
  bgSecondary?: string
  textSecondary?: string
  border?: string
  motion: MotionVariant
  gradient: string
  emoji: string
  description: string
}

export const moodVariants: Record<MoodKey, MoodVariant> = {
  sad: {
    bg: 'bg-blue-950',
    bgSecondary: 'bg-blue-900/20',
    text: 'text-sky-200',
    textSecondary: 'text-sky-300/80',
    border: 'border-blue-800/30',
    motion: 'fade',
    gradient: 'from-blue-950 via-slate-900 to-indigo-900',
    emoji: '😢',
    description: 'Spokojny, melancholijny nastrój',
  },
  angry: {
    bg: 'bg-red-900',
    bgSecondary: 'bg-red-950/30',
    text: 'text-red-100',
    textSecondary: 'text-rose-200/80',
    border: 'border-red-800/40',
    motion: 'shake',
    gradient: 'from-red-900 via-rose-800 to-orange-900',
    emoji: '😠',
    description: 'Intensywny, dynamiczny nastrój',
  },
  happy: {
    bg: 'bg-yellow-900',
    bgSecondary: 'bg-amber-950/20',
    text: 'text-amber-100',
    textSecondary: 'text-yellow-200/90',
    border: 'border-amber-800/30',
    motion: 'bounce',
    gradient: 'from-yellow-900 via-orange-800 to-amber-900',
    emoji: '😄',
    description: 'Radosny, energiczny nastrój',
  },
  calm: {
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800/20',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300/80',
    border: 'border-gray-700/30',
    motion: 'float',
    gradient: 'from-gray-900 via-slate-800 to-zinc-900',
    emoji: '😌',
    description: 'Spokojny, zrównoważony nastrój',
  },
  mixed: {
    bg: 'bg-purple-900',
    bgSecondary: 'bg-indigo-950/30',
    text: 'text-indigo-200',
    textSecondary: 'text-purple-300/80',
    border: 'border-purple-800/30',
    motion: 'glow',
    gradient: 'from-purple-900 via-indigo-900 to-violet-900',
    emoji: '🌀',
    description: 'Złożony, wielowymiarowy nastrój',
  },
}

/**
 * Mapowanie istniejących EmotionKey na MoodKey
 */
export function mapEmotionToMood(emotion?: string | null): MoodKey {
  if (!emotion) return 'calm'

  const emotionLower = emotion.toLowerCase()

  if (emotionLower.includes('joy') || emotionLower.includes('happy')) return 'happy'
  if (emotionLower.includes('sad') || emotionLower.includes('sorrow')) return 'sad'
  if (emotionLower.includes('anger') || emotionLower.includes('rage')) return 'angry'
  if (emotionLower.includes('peace') || emotionLower.includes('calm')) return 'calm'

  // Domyślnie mixed dla nostalgia i inne
  return 'mixed'
}

/**
 * Pobierz wariant nastroju
 */
export function getMoodVariant(mood?: MoodKey | null): MoodVariant {
  if (!mood || !moodVariants[mood]) {
    return moodVariants.calm
  }
  return moodVariants[mood]
}

