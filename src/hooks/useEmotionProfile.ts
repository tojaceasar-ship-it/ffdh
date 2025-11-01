'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EmotionKey, EmotionTheme, getEmotionTheme, getRandomEmotion } from '@/config/emotions'

const STORAGE_KEY = 'ffdh-emotion-profile'

export interface EmotionProfile {
  mood: EmotionKey
  nickname: string
  lastSceneSlug?: string
  emotionHistory: EmotionKey[]
  createdAt: string
  updatedAt: string
}

const generateNickname = () => {
  const fragments = ['Dreamer', 'Soul', 'Wave', 'Glow', 'Pulse', 'Echo']
  const index = Math.floor(Math.random() * fragments.length)
  const number = Math.floor(Math.random() * 900 + 100)
  return `${fragments[index]}-${number}`
}

const createDefaultProfile = (): EmotionProfile => {
  const emotion = getRandomEmotion()
  const timestamp = new Date().toISOString()
  return {
    mood: emotion.key,
    nickname: generateNickname(),
    lastSceneSlug: undefined,
    emotionHistory: [emotion.key],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

const parseStoredProfile = (value: string | null): EmotionProfile | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<EmotionProfile>
    if (!parsed.mood) return null
    const timestamp = new Date().toISOString()
    return {
      ...createDefaultProfile(),
      ...parsed,
      createdAt: parsed.createdAt ?? timestamp,
      updatedAt: timestamp,
      emotionHistory: (parsed.emotionHistory ?? [parsed.mood]) as EmotionKey[],
    }
  } catch {
    return null
  }
}

export interface EmotionProfileApi {
  profile: EmotionProfile
  theme: EmotionTheme
  setEmotion: (emotion: EmotionKey) => void
  setNickname: (nickname: string) => void
  recordSceneVisit: (slug: string) => void
  resetProfile: () => void
}

export function useEmotionProfile(): EmotionProfileApi {
  const [profile, setProfile] = useState<EmotionProfile>(() => createDefaultProfile())

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = parseStoredProfile(window.localStorage.getItem(STORAGE_KEY))
    if (stored) {
      setProfile(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.warn('Failed to persist emotion profile', error)
    }
  }, [profile])

  const theme = useMemo(() => getEmotionTheme(profile.mood), [profile.mood])

  const setEmotion = useCallback((emotion: EmotionKey) => {
    setProfile((prev) => {
      const timestamp = new Date().toISOString()
      const updatedHistory = [...prev.emotionHistory.slice(-9), emotion]
      return {
        ...prev,
        mood: emotion,
        emotionHistory: updatedHistory,
        updatedAt: timestamp,
      }
    })
  }, [])

  const setNickname = useCallback((nickname: string) => {
    setProfile((prev) => ({
      ...prev,
      nickname: nickname.trim() || prev.nickname,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const recordSceneVisit = useCallback((slug: string) => {
    setProfile((prev) => ({
      ...prev,
      lastSceneSlug: slug,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const resetProfile = useCallback(() => {
    const nextProfile = createDefaultProfile()
    setProfile(nextProfile)
  }, [])

  return {
    profile,
    theme,
    setEmotion,
    setNickname,
    recordSceneVisit,
    resetProfile,
  }
}


