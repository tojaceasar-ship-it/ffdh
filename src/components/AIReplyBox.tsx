'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EmotionKey } from '@/config/emotions'
import { emitLocalComment, logFeedback } from '@/services/rewirService'

const emotionOptions: Array<{ key: EmotionKey | 'love' | 'surprise'; label: string; icon: string }> = [
  { key: 'joy', label: 'Joy', icon: '🌞' },
  { key: 'sadness', label: 'Sadness', icon: '🌧️' },
  { key: 'anger', label: 'Anger', icon: '🔥' },
  { key: 'peace', label: 'Peace', icon: '🌿' },
  { key: 'nostalgia', label: 'Nostalgia', icon: '📼' },
  { key: 'love', label: 'Love', icon: '❤️' },
  { key: 'surprise', label: 'Surprise', icon: '⚡' },
]

interface AIReplyBoxProps {
  sceneId: string
  sceneTitle: string
  nickname?: string
  mood?: EmotionKey
  onSubmit?: (payload: { comment: string; emotion?: string; aiResponse?: string }) => void
}

export default function AIReplyBox({ sceneId, sceneTitle, nickname = 'Anon', mood = 'peace', onSubmit }: AIReplyBoxProps) {
  const [comment, setComment] = useState('')
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWaitingAI, setIsWaitingAI] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneSlug: sceneId,
          content: comment,
          emotion: selectedEmotion,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit comment')
      }

      const commentResult = await response.json()
      const insertedCommentId = commentResult?.comment?.id as string | undefined

      setIsWaitingAI(true)
      const aiResponseCall = await fetch('/api/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment,
          sceneTitle,
          sceneSlug: sceneId,
          emotion: selectedEmotion ?? mood,
        }),
      })

      if (!aiResponseCall.ok) {
        throw new Error('AI reply failed')
      }

      const data = await aiResponseCall.json()
      const aiText = data.response?.text || data.response || data.text || 'Thanks for adding your voice.'
      setAiResponse(aiText)
      onSubmit?.({ comment, emotion: selectedEmotion ?? undefined, aiResponse: aiText })

      await logFeedback({
        sceneSlug: sceneId,
        comment,
        aiResponse: aiText,
        mood,
        nickname,
      })

      setComment('')
      setSelectedEmotion(null)

      emitLocalComment(sceneId, {
        id: insertedCommentId ?? `local-${Date.now()}`,
        content: comment,
        emotion: selectedEmotion ?? mood,
        ai_response: aiText,
        nickname,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error(err)
      setError('We could not send that right now. Try once more?')
    } finally {
      setIsSubmitting(false)
      setIsWaitingAI(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/15 bg-black/70 p-8 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold text-white">Share how this scene hits</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">AI companion</span>
      </div>

      <p className="mb-6 text-sm text-white/60">
        Drop a thought, feeling, or bar. Our poetic AI will riff back in the same vibe. Reactions stay anonymous.
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {emotionOptions.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => setSelectedEmotion(selectedEmotion === option.key ? null : option.key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
              selectedEmotion === option.key ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1 text-base">{option.icon}</span>
            {option.label}
          </motion.button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Tell the block what you feel…"
        className="mb-4 h-32 w-full resize-none rounded-2xl border border-white/15 bg-black/50 p-4 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none"
        disabled={isSubmitting || isWaitingAI}
      />

      <motion.button
        onClick={handleSubmit}
        disabled={!comment.trim() || isSubmitting || isWaitingAI}
        className={`w-full rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.3em] transition ${
          !comment.trim() || isSubmitting || isWaitingAI
            ? 'bg-white/10 text-white/40'
            : 'bg-white text-black hover:bg-white/90'
        }`}
        whileHover={!comment.trim() || isSubmitting || isWaitingAI ? {} : { scale: 1.02 }}
        whileTap={!comment.trim() || isSubmitting || isWaitingAI ? {} : { scale: 0.98 }}
      >
        {isWaitingAI ? 'AI weaving reply…' : isSubmitting ? 'Sending…' : 'Send to the grid'}
      </motion.button>

      {error && (
        <motion.div
          className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {aiResponse && (
        <motion.div
          className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">AI response</p>
          <p className="leading-relaxed">{aiResponse}</p>
        </motion.div>
      )}

      {isWaitingAI && (
        <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          AI typing…
        </div>
      )}
    </div>
  )
}

