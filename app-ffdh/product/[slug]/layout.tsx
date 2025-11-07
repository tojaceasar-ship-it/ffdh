import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { fetchProductBySlug } from '@/services/productService'

interface ProductLayoutParams {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductLayoutParams): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product not found | Fruits From Da Hood',
      description: 'The requested product could not be located.',
    }
  }

  return {
    title: `${product.name} | Fruits From Da Hood`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Fruits From Da Hood`,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  }
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}


