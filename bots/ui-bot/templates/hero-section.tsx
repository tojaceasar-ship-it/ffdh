export function generateHeroSection(colors: any, content: any): string {
  return `export default function HeroSection() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '${colors.background || '#0a0a0a'}' }}
    >
      <div className="text-center px-4 max-w-4xl">
        <h1 
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{ 
            color: '${colors.primary || '#FFD700'}',
            textShadow: '0 0 20px ${colors.primary || '#FFD700'}80'
          }}
        >
          ${content.title || 'FFDH STREETWEAR'}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-8"
          style={{ color: '${colors.foreground || '#ffffff'}' }}
        >
          ${content.tagline || 'Neon dreams, urban style, limitless expression'}
        </p>
        <button 
          className="px-8 py-4 text-lg font-bold rounded-lg transition-all hover:scale-105"
          style={{ 
            backgroundColor: '${colors.accent || '#FF4500'}',
            color: '${colors.background || '#0a0a0a'}'
          }}
        >
          ${content.cta || 'Explore Collection'}
        </button>
      </div>
    </section>
  );
}`;
}
