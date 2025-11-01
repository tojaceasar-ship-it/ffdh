'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface QRScannerProps {
  onScan?: (data: string) => void
  onClose?: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Camera access would require external library like html5-qrcode
    // For MVP, we'll use manual input fallback
    setIsScanning(false)
    setError('Camera scanning requires additional setup. Please use manual code entry.')
  }, [])

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return

    // Parse scene slug from QR data
    const sceneSlug = manualCode.trim().replace(/^.*\/scena\//, '').replace(/[#?].*$/, '')
    
    if (sceneSlug) {
      router.push(`/scena/${sceneSlug}`)
      onScan?.(sceneSlug)
    } else {
      setError('Invalid scene code. Format: /scena/[scene-slug]')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-black border-2 border-neon-yellow/30 rounded-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-headline font-bold mb-6 text-neon-yellow">
          📷 Scan Scene QR
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Video preview (would show camera feed) */}
        <div className="mb-6 bg-gray-900 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-gray-700">
          <div className="text-center">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-400 text-sm">Camera scanning not available</p>
            <p className="text-gray-500 text-xs mt-2">Use manual code entry below</p>
          </div>
        </div>

        {/* Manual entry */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Or enter scene code manually:
          </label>
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Scene URL or slug (e.g. urban-banana-blues)"
            className="w-full bg-black border-2 border-neon-yellow/30 rounded-lg p-4 text-white placeholder-gray-600 focus:border-neon-yellow outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleManualSubmit}
            disabled={!manualCode.trim()}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              !manualCode.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-neon-yellow text-black hover:bg-neon-cyan'
            }`}
          >
            Open Scene
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-700 text-gray-400 rounded-lg font-bold hover:border-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

