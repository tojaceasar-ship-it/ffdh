import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// Create fallback client for build time if no project ID
const getSanityClient = () => {
  if (!projectId) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '❌ CRITICAL: Sanity project ID is required in production. ' +
        'Please set NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.'
      )
    }
    console.warn('⚠️ Missing Sanity project ID - using fallback (development only)')
    return createClient({
      projectId: 'placeholder',
      dataset: 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
    })
  }
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_AUTH_TOKEN,
  })
}

export const sanityClient = getSanityClient()

// Export default for convenience
export default sanityClient

/**
 * Image builder for Sanity images
 * Usage: imageUrlBuilder(imageSource).width(400).url()
 */
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * GROQ queries for common content
 */
export const QUERIES = {
  // Characters
  allCharacters: `*[_type == "character"] | order(powerLevel desc)`,
  characterBySlug: `*[_type == "character" && slug.current == $slug][0]`,

  // Scenes (Emotional content)
  allScenes: `*[_type == "scene"] | order(_createdAt desc)`,
  sceneBySlug: `*[_type == "scene" && slug.current == $slug][0]`,

  // Drops (Collections)
  allDrops: `*[_type == "drop"] | order(startDate desc)`,
  dropBySlug: `*[_type == "drop" && slug.current == $slug][0]`,
  activeDrops: `*[_type == "drop" && now() >= startDate && now() <= endDate]`,

  // Products
  allProducts: `*[_type == "product"]`,
  productsByDrop: `*[_type == "product" && references($dropId)]`,

  // Navigation
  navigation: `*[_type == "navigation"][0]`,

  // Settings
  settings: `*[_type == "settings"][0]`,
}

/**
 * Fetch helper with error handling
 */
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string
  params?: Record<string, any>
}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}
