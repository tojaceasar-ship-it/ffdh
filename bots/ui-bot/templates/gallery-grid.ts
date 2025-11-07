export function generateGalleryGrid(colors: any, items: any[]): string {
  return `export default function GalleryGrid() {
  const items = ${JSON.stringify(items || [
    { title: 'Item 1', image: '/placeholder-1.jpg', price: '299 PLN' },
    { title: 'Item 2', image: '/placeholder-2.jpg', price: '399 PLN' },
    { title: 'Item 3', image: '/placeholder-3.jpg', price: '499 PLN' }
  ])};

  return (
    <section 
      className="py-20 px-4"
      style={{ backgroundColor: '${colors.background || '#0a0a0a'}' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-4xl font-bold mb-12 text-center"
          style={{ 
            color: '${colors.primary || '#FFD700'}',
            textShadow: '0 0 10px ${colors.primary || '#FFD700'}50'
          }}
        >
          Galeria Kolekcji
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
              style={{ 
                borderColor: '${colors.secondary || '#00CED1'}',
                backgroundColor: '${colors.background || '#0a0a0a'}'
              }}
            >
              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                <span style={{ color: '${colors.foreground || '#ffffff'}' }}>
                  {item.title}
                </span>
              </div>
              <div className="p-4">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: '${colors.foreground || '#ffffff'}' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-lg font-semibold"
                  style={{ color: '${colors.accent || '#FF4500'}' }}
                >
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}
