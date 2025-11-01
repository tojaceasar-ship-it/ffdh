/**
 * Prompt Enhancer
 * Standardizes and enhances AI prompts with FFDH brand voice
 */

import { buildSystemPrompt as getSystemPrompt, buildEnhancedPrompt as getEnhancedPrompt } from '@/services/promptContext'

export interface PromptConfig {
  language?: 'pl' | 'en'
  tone?: 'empathetic' | 'energetic' | 'contemplative' | 'poetic'
  maxTokens?: number
  temperature?: number
}

export interface EnhancedPrompt {
  system: string
  user: string
  config: {
    temperature: number
    max_tokens: number
  }
}

/**
 * Standard prompt templates by use case
 */
const PROMPT_TEMPLATES = {
  aiResponse: {
    system: (language: 'pl' | 'en') => getSystemPrompt(language),
    config: {
      temperature: 0.9,
      max_tokens: 150,
    },
  },
  narrativeGeneration: {
    system: (language: 'pl' | 'en') =>
      language === 'pl'
        ? `Jesteś poetyckim opowiadaczem dla FFDH. Generuj krótkie (2-3 zdania), żywe, neonowe narracje o owocach w miejskich sceneriach.
Styl: poezja uliczna, metaforyczna, emocjonalnie rezonująca, miejskie wibracje, mieszanka smutku i nadziei.
Język: polski.`
        : `You are a poetic AI storyteller for FFDH. Generate short (2-3 sentences), vivid, neon-tinged narratives about fruits in urban settings.
Style: street poetry, metaphorical, emotionally resonant, urban vibes, mix of sadness and hope.
Language: English.`,
    config: {
      temperature: 1.0,
      max_tokens: 200,
    },
  },
  emotionAnalysis: {
    system: () =>
      'You are an emotion analyzer. Respond in JSON format with { emotion: string, confidence: number 0-1, sentiment: positive|negative|neutral }',
    config: {
      temperature: 0.7,
      max_tokens: 100,
    },
  },
} as const

/**
 * Enhance prompt with FFDH brand voice
 */
export function enhancePrompt(
  useCase: keyof typeof PROMPT_TEMPLATES,
  userPrompt: string,
  context?: any,
  config?: PromptConfig
): EnhancedPrompt {
  const template = PROMPT_TEMPLATES[useCase]
  const language = config?.language || 'en'

  let systemPrompt: string
  if (typeof template.system === 'function') {
    systemPrompt = template.system(language)
  } else {
    systemPrompt = template.system
  }

  // Apply tone adjustments if specified
  if (config?.tone) {
    systemPrompt = applyTone(systemPrompt, config.tone)
  }

  // Build enhanced user prompt if context provided
  let enhancedUserPrompt = userPrompt
  if (context && useCase === 'aiResponse' && context.scene) {
    enhancedUserPrompt = getEnhancedPrompt(context, userPrompt)
  }

  return {
    system: systemPrompt,
    user: enhancedUserPrompt,
    config: {
      temperature: config?.temperature ?? template.config.temperature,
      max_tokens: config?.maxTokens ?? template.config.max_tokens,
    },
  }
}

/**
 * Apply tone to system prompt
 */
function applyTone(prompt: string, tone: PromptConfig['tone']): string {
  const toneModifiers: Record<string, string> = {
    empathetic: '\nBe extra empathetic and understanding in your responses.',
    energetic: '\nRespond with energy and enthusiasm while maintaining authenticity.',
    contemplative: '\nProvide thoughtful, reflective responses that encourage introspection.',
    poetic: '\nUse more poetic language and imagery in your responses.',
  }

  return prompt + (tone ? (toneModifiers[tone] || '') : '')
}

/**
 * Validate prompt structure
 */
export function validatePrompt(prompt: EnhancedPrompt): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!prompt.system || prompt.system.trim().length === 0) {
    errors.push('System prompt is required')
  }

  if (!prompt.user || prompt.user.trim().length === 0) {
    errors.push('User prompt is required')
  }

  if (prompt.config.temperature < 0 || prompt.config.temperature > 2) {
    errors.push('Temperature must be between 0 and 2')
  }

  if (prompt.config.max_tokens < 1 || prompt.config.max_tokens > 4096) {
    errors.push('Max tokens must be between 1 and 4096')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Version prompt for tracking
 */
export function versionPrompt(prompt: EnhancedPrompt, version: string): EnhancedPrompt & { version: string } {
  return {
    ...prompt,
    version,
  }
}

export const promptEnhancer = {
  enhancePrompt,
  validatePrompt,
  versionPrompt,
  templates: PROMPT_TEMPLATES,
}

