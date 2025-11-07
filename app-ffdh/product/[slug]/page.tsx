'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/slices/cart.slice'
import { ProductSummary, fetchProductBySlug } from '@/services/productService'
import { useEmotionProfile } from '@/hooks/useEmotionProfile'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { theme } = useEmotionProfile()

  const [product, setProduct] = useState<ProductSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const result = await fetchProductBySlug(slug)
        if (!isMounted) return
        if (!result) {
          setError('Product not found')
        }
        setProduct(result)
      } catch (err) {
        console.error(err)
        if (!isMounted) return
        setError('Unable to load this item.')
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
  }, [slug])

  const isSoldOut = useMemo(() => (product?.stock !== undefined ? product.stock <= 0 : false), [product])

  const handleAddToCart = () => {
    if (!product || isSoldOut) return
    dispatch(
      addToCart({
        id: product.id,
        variantId: product.printfulVariantId ?? product.id,
        name: product.name,
        priceEUR: product.priceEUR,
        quantity: 1,
        image: product.imageUrl,
      })
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="space-y-3 text-center">
          <div className="text-5xl">🛒</div>
          <p className="text-sm text-white/60">Loading product…</p>
        </div>
      </main>
    )
  }

  if (!product || error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
        <p className="text-white/70">{error ?? 'Product unavailable right now.'}</p>
        <button
          onClick={() => router.push('/shop')}
          className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
        >
          Back to catalog
        </button>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `radial-gradient(circle at top, ${theme.accentHex}15, transparent 45%), radial-gradient(circle at bottom, ${theme.accentHex}10, transparent 55%)`,
      }}
    >
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr,1fr]">
        <motion.div
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          className="rounded-3xl border border-white/10 bg-black/60 p-10 backdrop-blur-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">FFDH piece</p>
          <h1 className="mt-3 text-4xl font-headline font-bold">{product.name}</h1>
          <p className="mt-4 text-sm text-white/70">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
            {product.isLimited && <span className="rounded-full bg-white/10 px-4 py-1 text-white/80">Limited</span>}
            {product.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-4 py-1">{tag}</span>
            ))}
          </div>

          <div className="mt-10 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-white">€{product.priceEUR.toFixed(2)}</span>
            {product.stock !== undefined && (
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                {isSoldOut ? 'Sold out' : `${product.stock} remaining`}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`mt-8 w-full rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.3em] transition ${
              isSoldOut ? 'bg-white/10 text-white/40' : 'bg-white text-black hover:bg-white/90'
            }`}
            whileHover={isSoldOut ? {} : { scale: 1.02 }}
            whileTap={isSoldOut ? {} : { scale: 0.98 }}
          >
            {isSoldOut ? 'Sold out' : 'Add to cart'}
          </motion.button>

          <div className="mt-10 space-y-3 text-xs text-white/50">
            <p>Made to order · Ships worldwide from trusted fulfillment partners.</p>
            <p>Carbon-neutral packaging · Secure checkout via Stripe.</p>
          </div>

          <button
            onClick={() => router.push('/shop')}
            className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/50 hover:text-white/70"
          >
            ← Back to shop
          </button>
        </motion.div>
      </section>
    </main>
  )
}


