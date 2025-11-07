import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop | Fruits From Da Hood',
  description: 'Limited-run streetwear, accessories, and art drops from Fruits From Da Hood.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


