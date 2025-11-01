'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan?: (data: string) => void
  onClose?: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current?.clear()
          })
          .catch(() => {})
      }
    }
  }, [])

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current?.clear()
          html5QrCodeRef.current = null
          setIsScanning(false)
        })
        .catch((err: unknown) => {
          console.error('Error stopping scanner:', err)
          html5QrCodeRef.current = null
          setIsScanning(false)
        })
    }
  }

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          handleQRSuccess(decodedText)
          stopScanning()
        },
        (_errorMessage: string) => {
          // Ignore errors during scanning (continuous scanning)
        }
      )
      setIsScanning(true)
      setCameraError(null)
    } catch (err) {
      console.error('Camera error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Camera access denied or unavailable'
      setCameraError(errorMsg)
      setIsScanning(false)
      html5QrCodeRef.current = null
    }
  }

  const handleQRSuccess = (decodedText: string) => {
    // Parse scene slug from QR data (support both /scena/ and /rewir/)
    const sceneSlug = decodedText
      .trim()
      .replace(/^.*\/(scena|rewir)\//, '')
      .replace(/[#?].*$/, '')

    if (sceneSlug) {
      router.push(`/rewir/${sceneSlug}`)
      onScan?.(sceneSlug)
      onClose?.()
    } else {
      setError('Invalid scene code. Expected URL format with scene slug.')
    }
  }

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return
    handleQRSuccess(manualCode)
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

        {/* QR Scanner */}
        <div className="mb-6 bg-gray-900 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-gray-700 overflow-hidden relative">
          <div id="qr-reader" className="w-full h-full" />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-400 text-sm">Camera scanning ready</p>
                <button
                  onClick={startScanning}
                  className="mt-4 px-4 py-2 bg-neon-yellow text-black rounded-lg font-bold hover:bg-neon-cyan transition-colors"
                >
                  Start Camera
                </button>
              </div>
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm">
              <p className="text-red-400 text-sm text-center px-4">{cameraError}</p>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="mb-4 text-center">
            <button
              onClick={stopScanning}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}

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

