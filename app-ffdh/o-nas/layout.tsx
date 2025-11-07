import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nas | Fruits From Da Hood',
  description: 'Poznaj historię Fruits From Da Hood - markę streetwear łączącą miejską kulturę z owocowymi postaciami',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

