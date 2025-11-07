import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Fruits From Da Hood',
  description: 'Reach the Fruits From Da Hood studio for orders, partnerships, and press.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


