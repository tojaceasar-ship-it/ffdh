'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SceneBubbleProps {
  emotion: string
  x: number
  y: number
  delay?: number
  onClick?: () => void
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

export default function SceneBubble({ emotion, x, y, delay = 0, onClick }: SceneBubbleProps) {
  const [position, setPosition] = useState({ x, y })
  const icon = emotionIcons[emotion] || '🎯'
  const size = 60 + Math.random() * 40 // Random size 60-100

  // Add floating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
      })
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [x, y])

  return (
    <motion.button
      className="absolute rounded-full bg-neon-yellow/80 backdrop-blur-sm text-black font-bold text-2xl hover:bg-neon-cyan/80 transition-colors cursor-pointer border-2 border-white/20 shadow-lg"
      style={{ width: size, height: size }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        delay,
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      title={`Filter ${emotion} scenes`}
    >
      {icon}
    </motion.button>
  )
}

