export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />

        <h1 className="text-6xl font-bold text-center mb-6 text-yellow-400">
          Fruits From Da Hood
        </h1>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl text-center">
          Zero GMO, 100% ulicy
        </p>

        <p className="text-center text-gray-500 mb-16 max-w-3xl">
          Premium streetwear born on the block. Urban culture meets neon aesthetics.
        </p>

        <div className="flex gap-6 mb-12">
          <a
            href="/sklep"
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all"
          >
            Shop Now
          </a>
          <a
            href="/rewir"
            className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400/10 transition-all"
          >
            Explore Rewir
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-cyan-400">
          Why FFDH?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '🎨 Unique Design', desc: 'Street art meets premium fashion' },
            { title: '🌍 Community', desc: 'Join thousands of enthusiasts' },
            { title: '⚡ Exclusive Drops', desc: 'Limited releases, unlimited vibes' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border-2 border-yellow-400/30 rounded-lg bg-black hover:border-yellow-400/80 transition-all"
            >
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-black/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>&copy; 2025 Fruits From Da Hood. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
