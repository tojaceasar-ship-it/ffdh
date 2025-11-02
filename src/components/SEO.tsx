import { Metadata } from 'next'
import Script from 'next/script'

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

/**
 * Generate JSON-LD structured data for SEO
 */
export interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'Article' | 'WebSite' | 'BreadcrumbList'
  data: Record<string, any>
}

export function generateStructuredData({ type, data }: StructuredDataProps) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return JSON.stringify(baseStructure)
}

/**
 * Organization structured data for Fruits From Da Hood
 */
export const FFDH_ORGANIZATION_DATA = generateStructuredData({
  type: 'Organization',
  data: {
    name: 'Fruits From Da Hood',
    url: 'https://fruitsfromdahood.com',
    logo: 'https://fruitsfromdahood.com/logo.png',
    description: 'Authentic streetwear brand combining urban culture with emotional storytelling through the Rewir platform.',
    sameAs: [
      'https://instagram.com/fruitsfromdahood',
      'https://twitter.com/ffdh',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@fruitsfromdahood.com',
    },
  },
})

/**
 * WebSite structured data
 */
export function generateWebSiteStructuredData(siteUrl: string = 'https://fruitsfromdahood.com') {
  return generateStructuredData({
    type: 'WebSite',
    data: {
      name: 'Fruits From Da Hood',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  })
}

