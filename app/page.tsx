import Link from 'next/link'

export const metadata = {
  title: 'AgentDesk PRO_LUX - GitHub Pages',
  description: 'AI-powered project management deployed on GitHub Pages',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 transition-colors duration-700">
      <div className="relative">
        <main className="flex-grow">
          <div className="min-h-screen bg-gray-950 px-6 py-16 text-white">
            <div className="mx-auto flex max-w-5xl flex-col gap-12">
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold">AgentDesk PRO_LUX</h1>
                <p className="text-lg text-muted-foreground">
                  AI-Powered Project Management System
                </p>
                <p className="text-sm text-gray-400">
                  Deployed on GitHub Pages - Static Version
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/agentdesk"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    🚀 Open AgentDesk
                  </Link>
                  <a
                    href="https://github.com/tojaceasar-ship-it/ffdh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    📖 View Source Code
                  </a>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6 rounded-2xl border border-white/10 bg-gray-900/40 p-8">
                  <h2 className="text-xl font-semibold">✨ Features</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>🎯 AI Project Generation</li>
                    <li>🤖 Multi-Agent Architecture</li>
                    <li>📊 Real-time Task Monitoring</li>
                    <li>💬 Live Agent Chat</li>
                    <li>🔄 Smart Build Pipeline</li>
                    <li>📱 Responsive Design</li>
                  </ul>
                </div>

                <div className="space-y-6 rounded-2xl border border-white/10 bg-gray-900/40 p-8">
                  <h2 className="text-xl font-semibold">🛠️ Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">Next.js 15</span>
                    <span className="bg-cyan-900/30 text-cyan-300 px-3 py-1 rounded-full text-sm">TypeScript</span>
                    <span className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                    <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">OpenAI</span>
                    <span className="bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">Framer Motion</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Built with modern web technologies for optimal performance and developer experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
