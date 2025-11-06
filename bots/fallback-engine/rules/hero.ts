export const generateHeroRule = {
  name: "rule:generate-hero",
  description: "Generate a hero section with neon styling",
  execute: (inputs: any) => ({
    component: `
export default function Hero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyan-400">
          FFDH Streetwear
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Neon dreams, urban style, limitless expression
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-lg text-lg">
          Explore Collection
        </button>
      </div>
    </section>
  );
}
    `,
    file: "components/Hero.tsx"
  })
};
