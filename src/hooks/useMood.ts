'use client'

import { useCallback, useMemo } from 'react'
import { useEmotionProfile } from './useEmotionProfile'
import { MoodKey, MotionVariant, getMoodVariant, mapEmotionToMood } from '@/config/moodVariants'

export interface MoodSource {
  type: 'emoji' | 'aiAnalysis' | 'localStorage' | 'manual'
  value: MoodKey
  timestamp: string
  confidence?: number
}

export interface UseMoodReturn {
  mood: MoodKey
  moodVariant: ReturnType<typeof getMoodVariant>
  motion: MotionVariant
  setMood: (source: MoodKey | { type: MoodSource['type']; value: MoodKey; confidence?: number }) => void
  getMood: () => MoodKey
  moodMeta: {
    source: MoodSource | null
    intensity: number
    lastUpdated: string | null
  }
  reset: () => void
}

const MOOD_STORAGE_KEY = 'ffdh-mood-state'

function loadMoodFromStorage(): MoodKey | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(MOOD_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.mood as MoodKey
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

function saveMoodToStorage(mood: MoodKey, source: MoodSource) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify({ mood, source, lastUpdated: new Date().toISOString() }))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook do zarządzania nastrojem użytkownika
 * Integruje się z useEmotionProfile i dodaje warstwę nastrojową
 */
export function useMood(): UseMoodReturn {
  const { profile, setEmotion } = useEmotionProfile()

  // Mapuj emotion z profile na mood
  const currentMood = useMemo<MoodKey>(() => {
    // Najpierw sprawdź localStorage
    const storedMood = loadMoodFromStorage()
    if (storedMood) return storedMood

    // Potem zmapuj emotion z profile
    return mapEmotionToMood(profile.mood)
  }, [profile.mood])

  const moodVariant = useMemo(() => getMoodVariant(currentMood), [currentMood])

  const moodMeta = useMemo(() => {
    if (typeof window === 'undefined') {
      return { source: null, intensity: 0.5, lastUpdated: null }
    }

    try {
      const stored = localStorage.getItem(MOOD_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          source: parsed.source as MoodSource | null,
          intensity: parsed.source?.confidence ?? 0.5,
          lastUpdated: parsed.lastUpdated || null,
        }
      }
    } catch {
      // Ignore parse errors
    }

    return {
      source: {
        type: 'localStorage' as const,
        value: currentMood,
        timestamp: new Date().toISOString(),
      },
      intensity: 0.5,
      lastUpdated: null,
    }
  }, [currentMood])

  const setMood = useCallback(
    (source: MoodKey | { type: MoodSource['type']; value: MoodKey; confidence?: number }) => {
      let mood: MoodKey
      let sourceData: MoodSource

      if (typeof source === 'string') {
        mood = source
        sourceData = {
          type: 'manual',
          value: mood,
          timestamp: new Date().toISOString(),
        }
      } else {
        mood = source.value
        sourceData = {
          type: source.type,
          value: mood,
          timestamp: new Date().toISOString(),
          confidence: source.confidence,
        }
      }

      // Zapisz do localStorage
      saveMoodToStorage(mood, sourceData)

      // Mapuj mood na emotion i zaktualizuj profile
      // Mapowanie odwrotne: mood -> emotion
      let emotion: string = 'peace' // domyślnie
      if (mood === 'happy') emotion = 'joy'
      else if (mood === 'sad') emotion = 'sadness'
      else if (mood === 'angry') emotion = 'anger'
      else if (mood === 'calm') emotion = 'peace'
      else if (mood === 'mixed') emotion = 'nostalgia'

      setEmotion(emotion as any)
    },
    [setEmotion]
  )

  const getMood = useCallback(() => currentMood, [currentMood])

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MOOD_STORAGE_KEY)
    }
    setMood('calm')
  }, [setMood])

  return {
    mood: currentMood,
    moodVariant,
    motion: moodVariant.motion,
    setMood,
    getMood,
    moodMeta,
    reset,
  }
}

