import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Characters | Fruits From Da Hood',
  description: 'Meet the fruit personas that power the FFDH universe and Rewir emotional scenes.',
}

export default function CharactersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


