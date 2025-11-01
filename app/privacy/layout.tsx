import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy | Fruits From Da Hood',
  description: 'Privacy policy describing how Fruits From Da Hood processes and protects personal data.',
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


