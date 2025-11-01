'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useMood, UseMoodReturn } from '@/hooks/useMood'

const MoodContext = createContext<UseMoodReturn | null>(null)

export const useMoodContext = () => {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMoodContext must be used within MoodProvider')
  }
  return context
}

interface MoodProviderProps {
  children: ReactNode
}

/**
 * EmotiProvider - dostarcza globalny kontekst nastroju
 * Zapina się w Providers.tsx i pozwala komponentom na dostęp do mood
 */
export function MoodProvider({ children }: MoodProviderProps) {
  const mood = useMood()

  return <MoodContext.Provider value={mood}>{children}</MoodContext.Provider>
}

