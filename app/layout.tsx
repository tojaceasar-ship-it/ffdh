import type { Metadata } from 'next'
import { Orbitron, Inter } from 'next/font/google'
import '@/styles/globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Fruits From Da Hood',
  description: 'Urban streetwear & emotional AI scenes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="bg-black text-white font-sans antialiased">
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}
