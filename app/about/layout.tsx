import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Fruits From Da Hood',
  description: 'Discover the story behind Fruits From Da Hood—where urban streetwear meets AI-driven storytelling.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


