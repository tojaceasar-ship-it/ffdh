import { Metadata } from 'next'

/**
 * SEO Helper for Next.js 15 App Router
 * Note: Next.js 15 uses `export const metadata` instead of component-based SEO.
 * This helper generates metadata objects that can be used in page files.
 */

export interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  siteName?: string
}

/**
 * Generate SEO metadata for Next.js App Router
 * Usage:
 * export const metadata = generateSEOMetadata({
 *   title: 'Page Title',
 *   description: 'Page description',
 *   image: '/og-image.jpg',
 * })
 */
export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'Fruits From Da Hood',
}: SEOProps): Metadata {
  const fullTitle = title.includes('|') ? title : `${title} | ${siteName}`
  const imageUrl = image?.startsWith('http') ? image : image ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://fruitsfromdahood.com'}${image}` : undefined

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      url,
      type,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

