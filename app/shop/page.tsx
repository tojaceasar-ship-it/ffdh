'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { useEmotionProfile } from '@/hooks/useEmotionProfile'
import { ProductSummary, fetchProducts } from '@/services/productService'
import { useRouter } from 'next/navigation'

export default function ShopPage() {
  const { theme } = useEmotionProfile()
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductSummary[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const catalogue = await fetchProducts()
        if (!isMounted) return
        setProducts(catalogue)
        setFilteredProducts(catalogue)
      } catch (err) {
        console.error(err)
        setError('Catalog unavailable right now. Showing offline stock.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    products.forEach((product) => {
      product.tags?.forEach((tag) => tagSet.add(tag))
      if (product.isLimited) tagSet.add('limited')
    })
    return Array.from(tagSet)
  }, [products])

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProducts(products)
      return
    }

    if (activeFilter === 'limited') {
      setFilteredProducts(products.filter((product) => product.isLimited))
      return
    }

    setFilteredProducts(products.filter((product) => product.tags?.includes(activeFilter)))
  }, [activeFilter, products])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const filter = new URLSearchParams(window.location.search).get('filter')
    if (filter) {
      setActiveFilter(filter)
    }
  }, [])

  const applyFilter = (filter: string) => {
    setActiveFilter(filter)
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    const query = params.toString()
    router.replace(query ? `/shop?${query}` : '/shop', { scroll: false })
  }

  return (
    <main
      className="min-h-screen pt-24 text-white"
      style={{
        backgroundImage: `radial-gradient(circle at top, ${theme.accentHex}15, transparent 45%), radial-gradient(circle at bottom, ${theme.accentHex}10, transparent 55%)`,
        backgroundColor: '#020202',
      }}
    >
      <section className="px-6 py-12">
        <motion.div
          className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-black/70 p-10 backdrop-blur-xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">FFDH drop</p>
          <h1 className="mt-3 text-4xl font-headline font-bold md:text-5xl">Shop the Rewir capsule</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/60">
            Street-crafted silhouettes, AI-detailed graphics, and limited fruit lore pieces. Sustainably produced,
            printed on demand, delivered with care.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => applyFilter('all')}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                activeFilter === 'all' ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => applyFilter('limited')}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                activeFilter === 'limited' ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Limited
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => applyFilter(tag)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  activeFilter === tag ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="py-24 text-center text-sm text-white/60">Loading garments…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/60 p-12 text-center text-sm text-white/60">
              No items in this vibe yet. Try another filter.
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.slug} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    variantId={product.printfulVariantId ?? product.id}
                    name={product.name}
                    price={product.priceEUR}
                    image={product.imageUrl}
                    isLimited={product.isLimited}
                    stock={product.stock}
                    isSoldOut={product.stock !== undefined ? product.stock <= 0 : false}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {error && <p className="mt-6 text-center text-xs text-white/50">{error}</p>}
        </div>
      </section>
    </main>
  )
}


