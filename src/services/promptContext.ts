/**
 * Prompt Context Builder
 * Builds contextual prompts for AI responses using scene metadata and emotion tags
 */

import { supabase } from '@/lib/supabase'

export interface SceneContext {
  title: string
  description?: string
  narrative?: string
  emotionTags?: string[]
  slug: string
}

export interface UserContext {
  selectedEmotion?: string
  previousEmotions?: string[] // Anonymized history
  language?: 'pl' | 'en'
}

export interface PromptContext {
  scene: SceneContext
  user: UserContext
  timestamp: string
}

/**
 * Build scene context from Supabase scene data
 */
export async function buildSceneContext(sceneSlug: string): Promise<SceneContext | null> {
  try {
    const { data, error } = await supabase
      .from('scenes')
      .select('title, description, narrative, emotion_tags, slug')
      .eq('slug', sceneSlug)
      .single()

    if (error || !data) {
      console.error('Error fetching scene context:', error)
      return null
    }

    return {
      title: data.title,
      description: data.description,
      narrative: data.narrative,
      emotionTags: data.emotion_tags || [],
      slug: data.slug,
    }
  } catch (error) {
    console.error('Error building scene context:', error)
    return null
  }
}

/**
 * Get anonymized user emotion history (last 5 interactions)
 * Returns emotion tags without user identifiers
 */
export async function getAnonymizedEmotionHistory(sceneSlug: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('emotion')
      .eq('scene_id', sceneSlug)
      .not('emotion', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error || !data) {
      return []
    }

    return data.map((c: { emotion: string | null }) => c.emotion).filter(Boolean) as string[]
  } catch (error) {
    console.error('Error fetching emotion history:', error)
    return []
  }
}

/**
 * Build complete prompt context for AI response generation
 */
export async function buildPromptContext(
  sceneSlug: string,
  userContext: UserContext
): Promise<PromptContext | null> {
  try {
    const sceneContext = await buildSceneContext(sceneSlug)
    if (!sceneContext) {
      return null
    }

    // Get anonymized emotion history from other users' interactions
    const previousEmotions = await getAnonymizedEmotionHistory(sceneSlug)

    return {
      scene: sceneContext,
      user: {
        ...userContext,
        previousEmotions,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error building prompt context:', error)
    return null
  }
}

/**
 * Build enhanced prompt string for OpenAI
 */
export function buildEnhancedPrompt(context: PromptContext, userComment: string): string {
  const { scene, user } = context

  // Build scene context section
  let prompt = `Scene: "${scene.title}"\n`
  
  if (scene.description) {
    prompt += `Description: ${scene.description}\n`
  }
  
  if (scene.narrative) {
    prompt += `Narrative: ${scene.narrative}\n`
  }

  // Add emotion tags context
  if (scene.emotionTags && scene.emotionTags.length > 0) {
    prompt += `Scene emotions: ${scene.emotionTags.join(', ')}\n`
  }

  // Add user emotion if provided
  if (user.selectedEmotion) {
    prompt += `User emotion: ${user.selectedEmotion}\n`
  }

  // Add anonymized emotion history for context (community feeling)
  if (user.previousEmotions && user.previousEmotions.length > 0) {
    const emotionFrequency: Record<string, number> = {}
    user.previousEmotions.forEach((emotion) => {
      emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1
    })
    
    const topEmotions = Object.entries(emotionFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion)
    
    if (topEmotions.length > 0) {
      prompt += `Community emotions: ${topEmotions.join(', ')}\n`
    }
  }

  // Add user comment
  prompt += `User comment: "${userComment}"\n`

  // Add language preference
  if (user.language) {
    prompt += `Response language: ${user.language === 'pl' ? 'Polish' : 'English'}\n`
  }

  return prompt
}

/**
 * Detect user language from comment text
 */
export function detectLanguage(text: string): 'pl' | 'en' {
  // Simple heuristic: count Polish-specific characters
  const polishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g
  const polishMatches = text.match(polishChars)?.length || 0
  
  // If more than 2% Polish characters, assume Polish
  if (polishMatches > text.length * 0.02) {
    return 'pl'
  }
  
  return 'en'
}

/**
 * Build system prompt for AI response generation
 */
export function buildSystemPrompt(language?: 'pl' | 'en'): string {
  const isPolish = language === 'pl'
  
  return isPolish
    ? `Jesteś AI towarzyszem FFDH (Fruits From Da Hood), społeczności urban streetwear i emocjonalnych scen.
Odpowiadaj empatycznie, z uliczną mądrością, po polsku lub angielsku (dopasuj do języka użytkownika).
Utrzymuj odpowiedzi krótkie (1-2 zdania), poetyckie i zachęcające.
Odnaj się do tytułu sceny w odpowiedzi, gdy jest to odpowiednie.
Emotikony są mile widziane. Bądź przyjazny, autentyczny, nigdy nie moralizatorski.`
    : `You are the AI companion of FFDH (Fruits From Da Hood), an urban streetwear & emotional scenes community.
You respond empathetically, with street-smart wisdom, in Polish or English (match user language).
Keep responses short (1-2 sentences), poetic, and encouraging.
Reference the scene title in your response when appropriate.
Emojis are welcome. Be friendly, authentic, never preachy.`
}

export const promptContext = {
  buildSceneContext,
  buildPromptContext,
  buildEnhancedPrompt,
  buildSystemPrompt,
  detectLanguage,
  getAnonymizedEmotionHistory,
}

