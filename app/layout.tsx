import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AgentDesk PRO_LUX',
  description: 'AI-powered project management deployed on GitHub Pages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
