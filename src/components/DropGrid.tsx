'use client'

import { ProductSummary } from '@/services/productService'
import ProductCard from './ProductCard'

interface DropGridProps {
  products: ProductSummary[]
  className?: string
}

/**
 * DropGrid - Grid layout for displaying product drops
 * Alias component for spec compliance
 */
export default function DropGrid({ products, className }: DropGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 ${className || ''}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          variantId={product.printfulVariantId || product.id}
          name={product.name}
          price={product.priceEUR}
          image={product.imageUrl}
          isLimited={product.isLimited}
          isSoldOut={product.stock !== undefined ? product.stock <= 0 : false}
          stock={product.stock}
        />
      ))}
    </div>
  )
}

