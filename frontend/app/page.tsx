import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-40 pb-20">
        <span className="bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1 rounded-full mb-6 border border-blue-500/20">
          Now in Beta — Free to use
        </span>
        <h1 className="text-6xl font-bold mb-6 leading-tight max-w-3xl">
          Mock APIs <span className="text-blue-500">instantly.</span><br />
          Test smarter.
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-xl">
          Paste your API schema, get live mock endpoints and AI-generated test cases in seconds. No setup required.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard">
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition">
    Get Started Free
  </button>
</a>
          <button className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-3 rounded-lg text-lg transition">
            See Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to mock APIs fast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    icon: "⚡",
    title: "Instant Mock Endpoints",
    desc: "Paste any REST schema and get live mock endpoints running in seconds. No config needed.",
  },
  {
    icon: "🤖",
    title: "AI Test Case Generator",
    desc: "Claude AI analyzes your API and generates edge case tests automatically.",
  },
  {
    icon: "🔗",
    title: "Shareable URLs",
    desc: "Share your mock server with teammates via a public URL. Collaborate instantly.",
  },
  {
    icon: "📊",
    title: "Request Logs",
    desc: "See every request hitting your mock server in real time with full details.",
  },
  {
    icon: "🛡️",
    title: "Schema Validation",
    desc: "Automatically validates requests against your schema and returns proper errors.",
  },
  {
    icon: "🚀",
    title: "One-click Deploy",
    desc: "Deploy your mock server to a permanent URL with one click. Share with anyone.",
  },
]