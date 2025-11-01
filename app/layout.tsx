import type { Metadata } from 'next'
import { Orbitron, Inter, Rajdhani, Bungee } from 'next/font/google'
import Providers from '../src/components/Providers'
import ScrollToTop from '../src/components/ScrollToTop'
import Footer from '../src/components/Footer'
import EmotiWrapper from '../src/components/EmotiWrapper'
import '../src/styles/globals.css'

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

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
})

const bungee = Bungee({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bungee',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://fruitsfromdahood.com'),
  title: 'Fruits From Da Hood',
  description: 'Urban streetwear & emotional AI scenes',
  keywords: 'streetwear, urban fashion, fruit characters, premium clothing',
  authors: [{ name: 'Fruits From Da Hood' }],
  creator: 'Fruits From Da Hood',
  publisher: 'Fruits From Da Hood',
  openGraph: {
    title: 'Fruits From Da Hood | Premium Streetwear',
    description: 'Discover premium streetwear inspired by urban culture and fruit characters',
    url: 'https://fruitsfromdahood.com',
    siteName: 'Fruits From Da Hood',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fruits From Da Hood',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fruits From Da Hood | Premium Streetwear',
    description: 'Discover premium streetwear inspired by urban culture and fruit characters',
    images: ['/assets/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${rajdhani.variable} ${bungee.variable}`}>
      <title>Fruits From Da Hood | Premium Streetwear & Emotional AI</title>
      <body className="font-inter antialiased flex flex-col min-h-screen">
        <Providers>
          <ScrollToTop />
          <EmotiWrapper>
            <main className="flex-grow">{children}</main>
          </EmotiWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
