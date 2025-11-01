'use client'

import { motion } from 'framer-motion'

interface EmotionFilterProps {
  emotions: string[]
  selectedEmotions: string[]
  onToggle: (emotion: string) => void
}

const emotionIcons: Record<string, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😠',
  love: '❤️',
  fear: '😨',
  surprise: '😲',
  peace: '☮️',
  nostalgia: '🎭',
  hope: '🌟',
  excitement: '🎉',
}

export default function EmotionFilter({ emotions, selectedEmotions, onToggle }: EmotionFilterProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-headline font-bold mb-4 text-neon-cyan">
        Filter by Emotion
      </h3>
      <div className="flex gap-2 flex-wrap">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion)
          const icon = emotionIcons[emotion] || '🎯'
          
          return (
            <motion.button
              key={emotion}
              onClick={() => onToggle(emotion)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-neon-yellow text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{icon}</span>
              <span>{emotion}</span>
            </motion.button>
          )
        })}
      </div>
      
      {selectedEmotions.length > 0 && (
        <motion.button
          onClick={() => selectedEmotions.forEach(onToggle)}
          className="mt-4 text-sm text-neon-yellow hover:text-neon-cyan transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Clear filters
        </motion.button>
      )}
    </div>
  )
}

