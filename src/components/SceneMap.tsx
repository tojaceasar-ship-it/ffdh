'use client'

import { useState } from 'react'
import SceneBubble from './SceneBubble'

interface SceneMapProps {
  scenes: Array<{
    slug: string
    title: string
    emotionTags?: string[]
  }>
  onEmotionClick?: (emotion: string) => void
}

export default function SceneMap({ scenes, onEmotionClick }: SceneMapProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)

  // Extract unique emotions and their counts
  const emotionCounts = scenes.reduce((acc, scene) => {
    (scene.emotionTags || []).forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Generate random positions for bubbles
  const generatePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2
    const radius = 200 + Math.random() * 150
    const centerX = 50 // percentage
    const centerY = 50 // percentage

    return {
      x: centerX + Math.cos(angle) * (radius / 10),
      y: centerY + Math.sin(angle) * (radius / 10),
    }
  }

  const uniqueEmotions = Object.keys(emotionCounts)

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-yellow/10 rounded-lg overflow-hidden border-2 border-neon-yellow/20">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Emotion Bubbles */}
      {uniqueEmotions.map((emotion, index) => {
        const position = generatePosition(index, uniqueEmotions.length)
        const count = emotionCounts[emotion]

        return (
          <div key={emotion} className="relative">
            <SceneBubble
              emotion={emotion}
              x={position.x}
              y={position.y}
              delay={index * 0.1}
              onClick={() => onEmotionClick?.(emotion)}
            />
            
            {/* Count badge */}
            {count > 1 && (
              <div className="absolute" style={{ 
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -150%)',
              }}>
                <span className="bg-neon-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
                  {count}
                </span>
              </div>
            )}
          </div>
        )
      })}

      {/* Info Text */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-sm text-gray-400">
          {uniqueEmotions.length} emotions detected across {scenes.length} scenes
        </p>
      </div>

      {/* Hovered emotion info */}
      {hoveredEmotion && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-neon-yellow/30 rounded-lg px-4 py-2">
          <p className="text-neon-yellow font-bold">{hoveredEmotion}</p>
          <p className="text-gray-400 text-sm">{emotionCounts[hoveredEmotion]} scenes</p>
        </div>
      )}
    </div>
  )
}

