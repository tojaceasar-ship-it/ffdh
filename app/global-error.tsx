'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global app error', error)
  }, [error])

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/40">Unexpected glitch</p>
          <h1 className="mt-4 text-4xl font-headline font-bold text-neon-yellow">Something went sideways</h1>
          <p className="mt-4 max-w-md text-sm text-white/60">
            We logged the issue and the crew is on it. You can retry the last action or head back to the homepage.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black hover:bg-white/90"
            >
              Retry
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40 hover:text-white"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}


