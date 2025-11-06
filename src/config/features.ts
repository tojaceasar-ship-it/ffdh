/**
 * Feature flags configuration
 * Controls optional features that can be enabled/disabled via environment variables
 */

export const features = {
  /**
   * Scene Map feature - Interactive emotion map with floating bubbles
   * Requires: SceneMap component, emotion data aggregation
   */
  REWIR_SCENE_MAP: process.env.NEXT_PUBLIC_SCENE_MAP_ENABLED === 'true',

  /**
   * QR Scanner feature - QR code scanner for scene redirect
   * Requires: QRScanner component, camera permissions
   */
  QR_SCANNER: process.env.NEXT_PUBLIC_QR_SCANNER_ENABLED === 'true',

  /**
   * Emotion Bubbles feature - Floating emotion bubbles animation
   * Requires: SceneBubble component, animation library
   */
  EMOTION_BUBBLES: process.env.NEXT_PUBLIC_EMOTION_BUBBLES_ENABLED === 'true',

  /**
   * AI Reply Enhanced - Enhanced AI response generation with prompt context
   * Always enabled - core feature
   */
  AI_REPLY_ENHANCED: true,
} as const

/**
 * Type-safe feature flag access
 */
export type FeatureFlag = keyof typeof features

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag] === true
}

