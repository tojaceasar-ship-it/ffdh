export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🍉 Fruits From Da Hood</h1>
      <p>Welcome to FFDH - Local Development</p>
      <p>Visit /api/health for API status</p>
      <nav style={{ marginTop: '2rem' }}>
        <a href="/sklep" style={{ marginRight: '1rem' }}>Shop</a>
        <a href="/rewir">Rewir</a>
      </nav>
    </div>
  )
}
