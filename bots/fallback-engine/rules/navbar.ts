export const generateNavbarRule = {
  name: "rule:generate-navbar",
  description: "Generate a standard navigation bar component",
  execute: (inputs: any) => ({
    component: `
export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">FFDH</div>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/lookbook" className="hover:text-gray-300">Lookbook</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>
      </div>
    </nav>
  );
}
    `,
    file: "components/Navbar.tsx"
  })
};
