import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-neon-yellow">404</h1>
        <h2 className="text-3xl font-headline mb-6 text-neon-cyan">Strony nie znaleziono</h2>
        <p className="text-gray-400 mb-8">Ta strona nie istnieje lub została przeniesiona.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-neon-yellow text-black font-bold rounded-lg hover:bg-neon-cyan transition-all"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  )
}

