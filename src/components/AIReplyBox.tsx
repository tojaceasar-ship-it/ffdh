'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AIReplyBoxProps {
  sceneId: string
  sceneTitle: string
  onSubmit?: (comment: string, emotion?: string, aiResponse?: string) => void
}

export default function AIReplyBox({ sceneId, sceneTitle, onSubmit }: AIReplyBoxProps) {
  const [comment, setComment] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWaitingAI, setIsWaitingAI] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const emotions = ['joy', 'sadness', 'anger', 'love', 'fear', 'surprise', 'peace', 'nostalgia']

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Submit comment to API
      const commentResponse = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneSlug: sceneId,
          content: comment,
          emotion: selectedEmotion,
        }),
      })

      if (!commentResponse.ok) {
        throw new Error('Failed to submit comment')
      }

      // Generate AI response
      setIsWaitingAI(true)
      const aiResponseCall = await fetch('/api/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: comment,
          sceneTitle,
          sceneSlug: sceneId,
          emotion: selectedEmotion,
        }),
      })

      if (aiResponseCall.ok) {
        const data = await aiResponseCall.json()
        const aiText = data.response?.text || data.response || data.text
        setAiResponse(aiText)
        onSubmit?.(comment, selectedEmotion || undefined, aiText)
      }

      // Reset form
      setComment('')
      setSelectedEmotion(null)
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to submit comment. Please try again.')
    } finally {
      setIsSubmitting(false)
      setIsWaitingAI(false)
    }
  }

  return (
    <div className="bg-gray-900/50 border-2 border-neon-yellow/30 rounded-lg p-8">
      <h2 className="text-2xl font-headline font-bold mb-6 text-neon-yellow">
        🤖 Odpowiedz AI
      </h2>

      <p className="text-gray-400 mb-4">
        Powiedz nam, co o tym myślisz. AI odpowie Ci z empatią.
      </p>

      {/* Emotion Selector */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-3">Jaka emocja? (opcjonalnie)</p>
        <div className="flex gap-2 flex-wrap">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion}
              onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedEmotion === emotion
                  ? 'bg-neon-yellow text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {emotion}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Napisz swoją odpowiedź... (anonimowo)"
        className="w-full bg-black border-2 border-neon-yellow/30 rounded-lg p-4 text-white placeholder-gray-600 focus:border-neon-yellow outline-none mb-4 resize-none"
        rows={4}
        disabled={isSubmitting || isWaitingAI}
      />

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!comment.trim() || isSubmitting || isWaitingAI}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          !comment.trim() || isSubmitting || isWaitingAI
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-neon-yellow text-black hover:bg-neon-cyan'
        }`}
        whileHover={comment.trim() && !isSubmitting && !isWaitingAI ? { scale: 1.02 } : {}}
        whileTap={comment.trim() && !isSubmitting && !isWaitingAI ? { scale: 0.98 } : {}}
      >
        {isWaitingAI
          ? '🤖 AI is thinking...'
          : isSubmitting
          ? '⏳ Wysyłanie...'
          : '✉️ Wyślij odpowiedź'}
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <motion.div
          className="mt-6 p-4 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm text-neon-yellow font-bold mb-2">AI Response</p>
              <p className="text-gray-300 leading-relaxed">{aiResponse}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

