'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMoodContext } from '@/contexts/MoodContext'
import { useAIEmotion } from '@/hooks/useAIEmotion'
import { MoodKey, moodVariants } from '@/config/moodVariants'

interface EmotionDetectorProps {
  className?: string
  showAnalyzeButton?: boolean
}

/**
 * Komponent UI do wyboru emoji lub autoanalizy nastroju
 * Umożliwia użytkownikowi ustawienie nastroju strony
 */
export default function EmotionDetector({ className, showAnalyzeButton = true }: EmotionDetectorProps) {
  const { mood, setMood, moodVariant } = useMoodContext()
  const { analyzeText, isAnalyzing, error } = useAIEmotion()
  const [analyzeInput, setAnalyzeInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleEmojiSelect = (selectedMood: MoodKey) => {
    setMood({
      type: 'emoji',
      value: selectedMood,
    })
  }

  const handleAnalyze = async () => {
    if (!analyzeInput.trim()) return

    const result = await analyzeText(analyzeInput)
    if (result) {
      setMood({
        type: 'aiAnalysis',
        value: result.mood,
        confidence: result.confidence,
      })
      setAnalyzeInput('')
      setShowInput(false)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="text-center">
        <p className="mb-2 text-sm text-white/60">Dopasuj stronę do mojego nastroju</p>
        <div className="flex gap-3">
          {Object.entries(moodVariants).map(([key, variant]) => {
            const moodKey = key as MoodKey
            const isActive = mood === moodKey

            return (
              <motion.button
                key={key}
                onClick={() => handleEmojiSelect(moodKey)}
                className={`relative rounded-full p-3 text-2xl transition-all ${
                  isActive
                    ? `${variant.bg} ${variant.text} scale-110 shadow-lg`
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={variant.description}
                aria-label={`Set mood to ${variant.description}`}
              >
                {variant.emoji}
                {isActive && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      {showAnalyzeButton && (
        <div className="w-full max-w-sm">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              {isAnalyzing ? 'Analizowanie...' : 'Przeanalizuj mój tekst'}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={analyzeInput}
                onChange={(e) => setAnalyzeInput(e.target.value)}
                placeholder="Opisz jak się czujesz..."
                className="min-h-20 w-full rounded-lg border border-white/20 bg-black/40 p-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !analyzeInput.trim()}
                  className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analizowanie...' : 'Analizuj'}
                </button>
                <button
                  onClick={() => {
                    setShowInput(false)
                    setAnalyzeInput('')
                  }}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mood && (
        <motion.div
          className="text-xs text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Aktywny nastrój: <span className="font-semibold">{moodVariants[mood].description}</span>
        </motion.div>
      )}
    </div>
  )
}

