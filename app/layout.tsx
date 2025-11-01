import type { Metadata } from 'next'
import { Orbitron, Inter, Rajdhani, Bungee_Shade } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-headline' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const rajdhani = Rajdhani({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-cta' })
const bungee = Bungee_Shade({ weight: '400', subsets: ['latin'], variable: '--font-accent' })

export const metadata: Metadata = {
  title: 'Fruits From Da Hood | Premium Streetwear',
  description: 'Urban culture meets premium streetwear. Zero GMO, 100% ulicy.',
  keywords: ['streetwear', 'urban', 'fashion', 'neon', 'community'],
  openGraph: {
    title: 'Fruits From Da Hood',
    description: 'Born on the block, raised in style',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bungee:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className={`${orbitron.variable} ${inter.variable} ${rajdhani.variable} ${bungee.variable} bg-black text-white font-body`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
