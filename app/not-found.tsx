import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Error 404</p>
        <h1 className="mt-4 text-5xl font-headline font-bold text-neon-yellow md:text-6xl">Scene not found</h1>
        <p className="mt-6 max-w-md text-sm text-white/60">
          Looks like this page took a different route through the neighbourhood. Head back home or jump into the Rewir to keep exploring.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black hover:bg-white/90"
          >
            Go home
          </Link>
          <Link
            href="/rewir"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40 hover:text-white"
          >
            Explore Rewir
          </Link>
        </div>
      </div>
    </div>
  )
}

