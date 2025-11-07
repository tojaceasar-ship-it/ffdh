import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms | Fruits From Da Hood',
  description: 'Legal terms of service for purchasing and engaging with Fruits From Da Hood.',
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


