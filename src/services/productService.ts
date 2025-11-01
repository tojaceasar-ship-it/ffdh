import autoProducts from '../../content/auto_products.json'
import { supabase } from '@/lib/supabase'

const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_SUPABASE_KEY = 'placeholder-key'

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== PLACEHOLDER_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== PLACEHOLDER_SUPABASE_KEY
)

type AutoProduct = (typeof autoProducts)[number]

export interface ProductSummary {
  id: string
  slug: string
  name: string
  description: string
  priceEUR: number
  imageUrl: string
  isLimited: boolean
  stock?: number
  printfulVariantId?: string
  tags?: string[]
  status?: 'active' | 'draft' | 'archived'
}

const normaliseProduct = (product: Partial<ProductSummary> & { slug?: string | null; name?: string | null }): ProductSummary | null => {
  if (!product.slug || !product.name) return null

  return {
    id: product.id ?? product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description ?? 'Limited drop from Fruits From Da Hood.',
    priceEUR: Number(product.priceEUR ?? 0),
    imageUrl: product.imageUrl ?? '/meta/scene-joy.svg',
    isLimited: Boolean(product.isLimited ?? false),
    stock: product.stock,
    printfulVariantId: product.printfulVariantId,
    tags: product.tags ?? [],
    status: product.status ?? 'active',
  }
}

const mapAutoProduct = (product: AutoProduct): ProductSummary =>
  normaliseProduct({
    id: product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceEUR: product.price_eur,
    imageUrl: product.imageUrl,
    isLimited: Boolean(product.is_limited),
    stock: product.stock,
    printfulVariantId: product.printfulVariantId,
  }) as ProductSummary

export async function fetchProducts(): Promise<ProductSummary[]> {
  const fallbackProducts = autoProducts.map(mapAutoProduct)

  if (!isSupabaseConfigured) {
    return fallbackProducts
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, description, price_eur, image_url, is_limited, stock, printful_variant_id, tags, status')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase products fetch failed. Using fallback data.', error)
      return fallbackProducts
    }

    const mapped = (data ?? [])
      .map((product) =>
        normaliseProduct({
          id: product.id ?? undefined,
          slug: product.slug ?? undefined,
          name: product.name ?? undefined,
          description: product.description ?? undefined,
          priceEUR: product.price_eur ?? undefined,
          imageUrl: product.image_url ?? undefined,
          isLimited: product.is_limited ?? undefined,
          stock: product.stock ?? undefined,
          printfulVariantId: product.printful_variant_id ?? undefined,
          tags: (product.tags as string[] | null) ?? undefined,
          status: (product.status as ProductSummary['status']) ?? undefined,
        })
      )
      .filter((product): product is ProductSummary => Boolean(product))

    if (mapped.length === 0) {
      return fallbackProducts
    }

    return mapped
  } catch (error) {
    console.error('Failed to fetch products, using fallback', error)
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<ProductSummary | null> {
  const fallback = autoProducts.find((product) => product.slug === slug)
  if (!isSupabaseConfigured) {
    return fallback ? mapAutoProduct(fallback) : null
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, description, price_eur, image_url, is_limited, stock, printful_variant_id, tags, status')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.warn('Products lookup failed, using fallback', error)
      return fallback ? mapAutoProduct(fallback) : null
    }

    if (!data) {
      return fallback ? mapAutoProduct(fallback) : null
    }

    return (
      normaliseProduct({
        id: data.id ?? undefined,
        slug: data.slug ?? undefined,
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        priceEUR: data.price_eur ?? undefined,
        imageUrl: data.image_url ?? undefined,
        isLimited: data.is_limited ?? undefined,
        stock: data.stock ?? undefined,
        printfulVariantId: data.printful_variant_id ?? undefined,
        tags: (data.tags as string[] | null) ?? undefined,
        status: (data.status as ProductSummary['status']) ?? undefined,
      }) ?? (fallback ? mapAutoProduct(fallback) : null)
    )
  } catch (error) {
    console.error('Error fetching product by slug', error)
    return fallback ? mapAutoProduct(fallback) : null
  }
}

export const productService = {
  fetchProducts,
  fetchProductBySlug,
}


