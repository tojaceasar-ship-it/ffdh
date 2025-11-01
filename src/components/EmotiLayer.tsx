'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { useMoodContext } from '@/contexts/MoodContext'
import { MotionVariant } from '@/config/moodVariants'

interface EmotiLayerProps {
  children: ReactNode
}

/**
 * Motion variants dla różnych nastrojów
 */
const motionVariants: Record<MotionVariant, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  shake: {
    initial: { x: 0 },
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  },
  bounce: {
    initial: { y: 0, scale: 1 },
    animate: {
      y: [0, -10, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 },
    },
  },
  float: {
    initial: { y: 0 },
    animate: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  glow: {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      boxShadow: [
        '0 0 20px rgba(147, 51, 234, 0.3)',
        '0 0 40px rgba(147, 51, 234, 0.6)',
        '0 0 20px rgba(147, 51, 234, 0.3)',
      ],
      transition: { duration: 2, repeat: Infinity },
    },
  },
}

/**
 * EmotiLayer - warstwa emocjonalna nakładana na layout
 * Transformuje wizualną i funkcjonalną warstwę UI w zależności od nastroju
 */
export default function EmotiLayer({ children }: EmotiLayerProps) {
  const { moodVariant, motion: motionType } = useMoodContext()

  // Klasy tła z gradientem
  const backgroundClasses = `min-h-screen bg-gradient-to-br ${moodVariant.gradient} transition-colors duration-700`

  return (
    <div className={backgroundClasses}>
      {/* Warstwa noise/texture overlay dla niektórych nastrojów */}
      {moodVariant.motion === 'shake' && (
        <div
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Główna zawartość z animacją */}
      <motion.div
        className="relative"
        variants={motionVariants[motionType]}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </div>
  )
}

