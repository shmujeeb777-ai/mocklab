"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

export default function Dashboard() {
  const router = useRouter()
  const { user, token, logout, isLoading } = useAuth()
  const [schema, setSchema] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [mockId, setMockId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleGenerate = async () => {
    if (!schema.trim()) return
    setLoading(true)
    setResult(null)
    setMockId(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema }),
      })
      const data = await res.json()
      if (data.error) {
        alert(`Error: ${data.error}`)
        setLoading(false)
        return
      }
      setResult(data)
      setMockId(data.mockId)
    } catch (err) {
      console.error(err)
      alert("Failed to generate endpoints")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MockLab</h1>
              <p className="text-xs text-slate-400">AI-Powered Mock API</p>
            </div>
          </div>
          
          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                )}
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!result ? (
          // INPUT SCREEN
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Describe Your API</h2>
                  <p className="text-sm text-slate-400">
                    Tell us about your endpoints and we'll generate production-ready mocks.
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    className="w-full h-80 bg-slate-900/80 border border-slate-600 rounded-2xl p-5 text-sm text-slate-100 font-mono resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-500"
                    placeholder={`Example:\n\nGET /api/users\nReturns list of all users\n\nPOST /api/users\nCreate new user with name and email\n\nGET /api/users/:id\nGet user details by ID`}
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !schema.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg"
                  >
                    <span>⚡</span>
                    {loading ? "Generating..." : "Generate Mock API"}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-400 mb-4">✨ How It Works</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400">
                      1
                    </span>
                    <p className="text-xs text-slate-300">Describe your API endpoints</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400">
                      2
                    </span>
                    <p className="text-xs text-slate-300">AI generates realistic responses</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400">
                      3
                    </span>
                    <p className="text-xs text-slate-300">Get instant shareable URLs</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">🎯 Features</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>✓ Production-like mock data</li>
                  <li>✓ Multiple HTTP methods</li>
                  <li>✓ Instant shareable URLs</li>
                  <li>✓ Zero configuration</li>
                  <li>✓ CORS enabled</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // RESULTS SCREEN
          <div className="space-y-8">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-1">✨ Mock API Ready!</h2>
                  <p className="text-sm text-slate-300">
                    Your endpoints are live. Share the URLs and start testing immediately.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResult(null)
                    setMockId(null)
                    setSchema("")
                  }}
                  className="px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-semibold transition-colors flex-shrink-0"
                >
                  New API
                </button>
              </div>
            </div>

            {/* Base URL */}
            {mockId && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-xs text-slate-400 font-semibold mb-3">BASE URL</p>
                <div className="flex gap-3">
                  <code className="flex-1 bg-slate-900/80 text-green-400 px-4 py-3 rounded-xl font-mono text-sm border border-slate-700 break-all">
                    /api/mock/{mockId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/api/mock/${mockId}`)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex-shrink-0 font-semibold text-sm"
                    title="Copy URL"
                  >
                    {copied ? "✓" : "📋"}
                  </button>
                </div>
              </div>
            )}

            {/* Endpoints */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Endpoints ({result?.endpoints?.length || 0})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result?.endpoints && result.endpoints.map((ep: any, i: number) => {
                  const methodStyles = {
                    GET: "bg-green-500/20 text-green-400 border-green-500/30",
                    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
                    PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                  }
                  return (
                    <div
                      key={i}
                      className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all group"
                    >
                      {/* Method & Path */}
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-lg font-bold text-xs border flex-shrink-0 ${methodStyles[ep.method as keyof typeof methodStyles] || methodStyles["GET"]}`}
                        >
                          {ep.method}
                        </span>
                        <div className="flex-1">
                          <p className="font-mono text-sm font-bold text-slate-100">{ep.path}</p>
                          <p className="text-xs text-slate-400 mt-1">{ep.description}</p>
                        </div>
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(`/api/mock/${mockId}${ep.path}`)}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-300 transition-colors"
                      >
                        <span>📋</span>
                        <span className="font-mono truncate">/api/mock/{mockId}{ep.path}</span>
                      </button>

                      {/* Response Preview */}
                      {ep.mockResponse && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <p className="text-xs text-slate-400 font-semibold mb-2">Response Example:</p>
                          <pre className="bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-xs text-green-400 overflow-auto max-h-32 font-mono text-[11px]">
                            {JSON.stringify(ep.mockResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">🧪 Test Your API</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold mb-2">cURL</p>
                  <code className="text-xs text-blue-400 font-mono overflow-auto block">
                    curl /api/mock/{mockId}
                    {result?.endpoints?.[0]?.path}
                  </code>
                </div>
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold mb-2">JavaScript</p>
                  <code className="text-xs text-blue-400 font-mono overflow-auto block">
                    fetch(\"/api/mock/{mockId}\")
                  </code>
                </div>
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold mb-2">Postman</p>
                  <code className="text-xs text-blue-400 font-mono overflow-auto block">
                    Add to Postman
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}