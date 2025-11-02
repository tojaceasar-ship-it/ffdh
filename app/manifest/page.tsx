import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

export const metadata: Metadata = {
  title: 'Manifest | Fruits From Da Hood',
  description: 'Our mission, vision, and values. Learn about the story behind Fruits From Da Hood and our commitment to authentic urban culture.',
  keywords: 'manifest, mission, vision, values, about us, culture',
  openGraph: {
    title: 'FFDH Manifest - Our Mission & Vision',
    description: 'Learn about the story behind Fruits From Da Hood and our commitment to authentic urban culture.',
    images: [
      {
        url: '/assets/images/manifest-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Fruits From Da Hood Manifest',
      },
    ],
  },
}

interface ManifestContent {
  _id: string
  title: string
  content: any[]
  images?: Array<{
    _key: string
    asset: {
      _ref: string
      url: string
    }
    alt?: string
  }>
}

// Portable Text components for rich content rendering
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={value.asset.url}
          alt={value.alt || 'Manifest image'}
          width={800}
          height={600}
          className="w-full h-auto rounded-lg"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-neon-yellow mb-6 mt-12 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4 mt-10">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-headline font-semibold text-neon-yellow/90 mb-3 mt-8">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-white/80 leading-relaxed mb-4 text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-neon-yellow pl-6 my-6 text-white/90 italic text-xl">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-neon-yellow/80">{children}</em>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-neon-yellow hover:text-neon-yellow/80 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside text-white/80 mb-4 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-white/80">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="text-white/80">{children}</li>
    ),
  },
}

async function getManifestContent(): Promise<ManifestContent | null> {
  try {
    const manifest = await sanityFetch<ManifestContent>({
      query: `*[_type == "manifest"][0]{
        _id,
        title,
        content,
        images[]{
          _key,
          asset,
          alt
        }
      }`
    })

    return manifest
  } catch (error) {
    console.error('Error fetching manifest:', error)
    return null
  }
}

export default async function ManifestPage() {
  const manifest = await getManifestContent()

  if (!manifest) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-headline font-bold text-neon-yellow mb-4">
            Manifest Loading...
          </h1>
          <p className="text-white/70">
            Our story is being prepared. Please check back soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        {manifest.images && manifest.images.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={manifest.images[0].asset.url}
              alt={manifest.images[0].alt || 'Manifest hero image'}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-neon-yellow mb-6">
              MANIFEST
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our vision, mission, and commitment to authentic urban culture.
              This is the story of Fruits From Da Hood.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg prose-invert max-w-none">
          <PortableText
            value={manifest.content}
            components={portableTextComponents}
          />
        </div>

        {/* Additional Images Gallery */}
        {manifest.images && manifest.images.length > 1 && (
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {manifest.images.slice(1).map((image) => (
              <div key={image._key} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={image.asset.url}
                  alt={image.alt || 'Manifest gallery image'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
              Join Our Movement
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Be part of a community that celebrates authentic urban culture
              and creative expression through fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="px-8 py-4 bg-neon-yellow text-black font-bold uppercase tracking-wider rounded-full hover:bg-neon-yellow/90 transition-colors"
              >
                Explore Our World
              </a>
              <Link
                href="/rewir"
                className="px-8 py-4 border border-white/20 text-white font-semibold uppercase tracking-wider rounded-full hover:border-white/40 hover:bg-white/10 transition-colors"
              >
                Create Your Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
