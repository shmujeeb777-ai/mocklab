export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-50">
      <div className="text-xl font-bold text-white">
        Mock<span className="text-blue-500">Lab</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#features" className="text-gray-400 hover:text-white transition text-sm">Features</a>
        <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">Pricing</a>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          Get Started
        </button>
      </div>
    </nav>
  )
}