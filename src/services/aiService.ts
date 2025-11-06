/**
 * AI Service for FFDH
 * Handles emotion analysis, response generation, and content moderation
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = 'gpt-4-turbo'

interface EmotionAnalysisResult {
  emotion: string
  confidence: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface AIResponse {
  text: string
  emotion: string
  timestamp: string
}

/**
 * Analyze emotion from user comment
 */
export async function analyzeEmotion(text: string): Promise<EmotionAnalysisResult> {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured')
      return {
        emotion: 'neutral',
        confidence: 0.5,
        sentiment: 'neutral',
      }
    }

    // Add timeout for fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    let response: Response
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are an emotion analyzer. Respond in JSON format with { emotion: string, confidence: number 0-1, sentiment: positive|negative|neutral }',
            },
            {
              role: 'user',
              content: `Analyze the emotion in this text: "${text}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (networkError) {
      clearTimeout(timeoutId)
      if (networkError instanceof Error && networkError.name === 'AbortError') {
        throw new Error('Request timeout: OpenAI API did not respond in time')
      }
      throw networkError
    }

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (content) {
      const result = JSON.parse(content)
      return result
    }

    return {
      emotion: 'neutral',
      confidence: 0.5,
      sentiment: 'neutral',
    }
  } catch (error) {
    console.error('Error analyzing emotion:', error)
    return {
      emotion: 'unknown',
      confidence: 0,
      sentiment: 'neutral',
    }
  }
}

/**
 * Generate AI response to user comment
 * Enhanced version with prompt context support
 */
export async function generateAIResponse(
  userComment: string,
  sceneTitle: string,
  emotion?: string,
  sceneSlug?: string
): Promise<AIResponse> {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, returning mock response')
      return {
        text: 'Thank you for sharing your thoughts. Your perspective enriches our community. 🍉',
        emotion: emotion || 'neutral',
        timestamp: new Date().toISOString(),
      }
    }

    // Try to use enhanced prompt context if sceneSlug provided
    let systemPrompt = `You are the AI companion of FFDH (Fruits From Da Hood), an urban streetwear & emotional scenes community. 
            You respond empathetically, with street-smart wisdom, in Polish or English (match user language).
            Keep responses short (1-2 sentences), poetic, and encouraging.
            Reference the scene title in your response when appropriate.
            Emojis are welcome. Be friendly, authentic, never preachy.`
    
    let userPrompt = `Scene: "${sceneTitle}"\nUser comment: "${userComment}"\nUser emotion: ${emotion || 'not specified'}`

    // Use static import for promptContext (better tree-shaking, no race conditions)
    if (sceneSlug) {
      try {
        const { buildPromptContext, buildEnhancedPrompt, buildSystemPrompt, detectLanguage } = await import('./promptContext')
        const language = detectLanguage(userComment)
        const context = await buildPromptContext(sceneSlug, {
          selectedEmotion: emotion,
          language,
        })

        if (context) {
          systemPrompt = buildSystemPrompt(language)
          userPrompt = buildEnhancedPrompt(context, userComment)
        }
      } catch (contextError) {
        console.warn('Failed to build prompt context, using basic prompt:', contextError)
        // Fall back to basic prompt
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || 'Thank you for your thoughts.'

    return {
      text,
      emotion: emotion || 'neutral',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    return {
      text: 'Your words matter. Thank you for being part of this journey. 🍉',
      emotion: emotion || 'neutral',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Moderate content for toxic language
 */
export async function moderateContent(text: string): Promise<{ isToxic: boolean; confidence: number }> {
  try {
    if (!OPENAI_API_KEY) {
      return { isToxic: false, confidence: 0 }
    }

    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI Moderation API error: ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.results[0]

    return {
      isToxic: result.flagged,
      confidence: Math.max(...Object.values(result.category_scores) as number[]),
    }
  } catch (error) {
    console.error('Error moderating content:', error)
    return { isToxic: false, confidence: 0 }
  }
}

/**
 * Generate emotional scene narrative
 */
export async function generateSceneNarrative(scenePrompt: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      return 'A moment of reflection in the urban landscape, where fruits meet destiny...'
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a poetic AI storyteller for FFDH. Generate short (2-3 sentences), vivid, neon-tinged narratives about fruits in urban settings.
            Style: street poetry, metaphorical, emotionally resonant, urban vibes, mix of sadness and hope.
            Language: Polish or English (use Polish).`,
          },
          {
            role: 'user',
            content: `Generate a scene narrative for: ${scenePrompt}`,
          },
        ],
        temperature: 1,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'A tale untold in the neon glow of the city.'
  } catch (error) {
    console.error('Error generating scene narrative:', error)
    return 'A moment suspended between past and present, where fruit dreams meet urban reality.'
  }
}

export const aiService = {
  analyzeEmotion,
  generateAIResponse,
  moderateContent,
  generateSceneNarrative,
}

export default aiService
