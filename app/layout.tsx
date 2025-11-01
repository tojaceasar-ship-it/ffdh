import type { Metadata } from 'next'
import { Orbitron, Inter, Rajdhani, Bungee } from 'next/font/google'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'

// Fonts
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
  title: 'Fruits From Da Hood - Urban Streetwear & Emotional AI Scenes',
  description:
    'Premium streetwear meets emotional AI narratives. Explore FFDH drops, urban culture, and interactive scenes with the community.',
  keywords: 'streetwear, urban culture, e-commerce, AI, emotional scenes, FFDH',
  openGraph: {
    title: 'Fruits From Da Hood',
    description: 'Premium streetwear & emotional experiences',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://fruitsfromdahood.com',
    siteName: 'FFDH',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} ${rajdhani.variable} ${bungee.variable}`}
    >
      <head>
        <style>{`
          :root {
            --neon-yellow: #ffd700;
            --neon-cyan: #00d9ff;
            --neon-orange: #ff6600;
            --neon-pink: #ff1493;
          }
        `}</style>
      </head>
      <body className="bg-black text-white font-sans antialiased">
        <Provider store={store}>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  )
}
