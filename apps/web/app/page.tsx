import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">FFDH Next</h1>

        <div className="grid gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">🤖 FFDH Bot Army</h2>
            <p className="text-gray-600 mb-4">
              Autonomiczny system botów do budowy aplikacji Next.js
            </p>
            <Link
              href="/lookbook"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Zobacz Lookbook →
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📊 Status systemu</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>✅ CodeBot: Aktywny</div>
              <div>✅ ContentBot: Aktywny</div>
              <div>✅ TestBot: Aktywny</div>
              <div>⚠️ DeployBot: Wymaga konfiguracji</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
