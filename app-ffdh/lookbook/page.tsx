import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lookbook | Fruits From Da Hood',
  description: 'Explore our latest streetwear collections and fashion looks. Discover premium urban fashion with unique fruit-inspired designs.',
  keywords: 'lookbook, streetwear, urban fashion, collections, style guide',
  openGraph: {
    title: 'FFDH Lookbook - Urban Streetwear Collections',
    description: 'Explore our latest streetwear collections and fashion looks.',
    images: [
      {
        url: '/assets/images/lookbook-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Fruits From Da Hood Lookbook',
      },
    ],
  },
}

interface LookbookItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  featured: boolean
  products: Array<{
    id: string
    name: string
    slug: string
  }>
}

const lookbookCollections: LookbookItem[] = [
  {
    id: 1,
    title: 'Urban Nights',
    description: 'Dark, mysterious streetwear for the night owls who own the city streets.',
    image: '/assets/images/lookbook-1.jpg',
    category: 'Streetwear',
    featured: true,
    products: [
      { id: 'urban-hoodie-1', name: 'Midnight Berry Hoodie', slug: 'midnight-berry-hoodie' },
      { id: 'urban-pants-1', name: 'Shadow Fruit Cargo Pants', slug: 'shadow-fruit-cargo-pants' },
    ],
  },
  {
    id: 2,
    title: 'Neon Dreams',
    description: 'Bright, electric colors that light up the urban jungle.',
    image: '/assets/images/lookbook-2.jpg',
    category: 'Fashion',
    featured: false,
    products: [
      { id: 'neon-tee-1', name: 'Electric Lime Tee', slug: 'electric-lime-tee' },
      { id: 'neon-shorts-1', name: 'Neon Berry Shorts', slug: 'neon-berry-shorts' },
    ],
  },
  {
    id: 3,
    title: 'City Vibes',
    description: 'Concrete jungle aesthetics with fruit-inspired twists.',
    image: '/assets/images/lookbook-3.jpg',
    category: 'Lifestyle',
    featured: false,
    products: [
      { id: 'city-jacket-1', name: 'Concrete Apple Jacket', slug: 'concrete-apple-jacket' },
      { id: 'city-hat-1', name: 'Urban Fruit Snapback', slug: 'urban-fruit-snapback' },
    ],
  },
  {
    id: 4,
    title: 'Fruit Punk',
    description: 'Rebellious street style meets tropical fruit motifs.',
    image: '/assets/images/lookbook-4.jpg',
    category: 'Streetwear',
    featured: false,
    products: [
      { id: 'punk-vest-1', name: 'Rebel Mango Vest', slug: 'rebel-mango-vest' },
      { id: 'punk-boots-1', name: 'Spiked Fruit Boots', slug: 'spiked-fruit-boots' },
    ],
  },
]

export default function LookbookPage() {
  const featuredCollection = lookbookCollections.find(item => item.featured)
  const otherCollections = lookbookCollections.filter(item => !item.featured)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-neon-yellow mb-6">
              LOOKBOOK
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore our curated collections that blend urban streetwear culture with unique fruit-inspired designs.
              Each look tells a story from the hood.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      {featuredCollection && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-neon-yellow/20 text-neon-yellow text-sm font-semibold rounded-full">
                    FEATURED
                  </span>
                  <span className="text-white/60 text-sm">
                    {featuredCollection.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                  {featuredCollection.title}
                </h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  {featuredCollection.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {featuredCollection.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neon-yellow text-black font-bold uppercase tracking-wider rounded-full hover:bg-neon-yellow/90 transition-colors"
                >
                  Shop Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                  <Image
                    src={featuredCollection.image}
                    alt={`${featuredCollection.title} collection`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Collections Grid */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              More Collections
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Discover our complete range of urban fashion collections,
              each inspired by different aspects of street culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCollections.map((collection) => (
              <div key={collection.id} className="group">
                <div className="relative aspect-[4/5] mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={`${collection.title} collection`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                      {collection.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-headline font-bold mb-2">
                  {collection.title}
                </h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  {collection.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.products.slice(0, 2).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="text-neon-yellow hover:text-neon-yellow/80 text-sm underline"
                    >
                      {product.name}
                    </Link>
                  ))}
                  {collection.products.length > 2 && (
                    <span className="text-white/60 text-sm">
                      +{collection.products.length - 2} more
                    </span>
                  )}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-neon-yellow hover:text-neon-yellow/80 font-semibold transition-colors"
                >
                  View Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            Ready to Own Your Style?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join the FFDH community and express your unique personality through our
            premium streetwear collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-neon-yellow text-black font-bold uppercase tracking-wider rounded-full hover:bg-neon-yellow/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/rewir"
              className="px-8 py-4 border border-white/20 text-white font-semibold uppercase tracking-wider rounded-full hover:border-white/40 hover:bg-white/10 transition-colors"
            >
              Create with Rewir
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
