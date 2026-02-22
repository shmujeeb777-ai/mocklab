"use client"
import { useState } from "react"

export default function Dashboard() {
  const [schema, setSchema] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

const handleGenerate = async () => {
  if (!schema.trim()) return
  setLoading(true)
  setResult(null)

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema }),
    })
    const data = await res.json()
    setResult(data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Mock<span className="text-blue-500">Lab</span>
          </h1>
          <p className="text-gray-400 mt-1">Paste your API schema and generate mock endpoints instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">📋 Your API Schema</h2>
            <textarea
              className="w-full h-72 bg-gray-950 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono focus:outline-none focus:border-blue-500 resize-none"
              placeholder={`Paste your schema here. Example:\n\nPOST /users\n{\n  "name": "string",\n  "email": "string",\n  "age": "number"\n}`}
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Generating..." : "⚡ Generate Mock Endpoints"}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">🚀 Mock Endpoints</h2>
            {!result ? (
              <div className="h-72 flex items-center justify-center text-gray-600 text-sm">
                Your generated endpoints will appear here
              </div>
            ) : (
              <div className="space-y-3">
                {result.endpoints.map((ep: any, i: number) => (
                  <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
  <div className="flex items-center gap-3 mb-2">
    <span className={`text-xs font-bold px-2 py-1 rounded ${
      ep.method === "GET" ? "bg-green-500/20 text-green-400" :
      ep.method === "POST" ? "bg-blue-500/20 text-blue-400" :
      ep.method === "DELETE" ? "bg-red-500/20 text-red-400" :
      "bg-yellow-500/20 text-yellow-400"
    }`}>
      {ep.method}
    </span>
    <p className="font-mono text-sm text-white">{ep.path}</p>
  </div>
  <p className="text-gray-500 text-xs mb-2">{ep.description}</p>
  {ep.mockResponse && (
    <pre className="bg-gray-900 rounded p-2 text-xs text-green-400 overflow-auto">
      {JSON.stringify(ep.mockResponse, null, 2)}
    </pre>
  )}
</div>
                ))}
                <button className="mt-2 w-full border border-gray-700 hover:border-blue-500 text-gray-300 text-sm font-semibold py-2 rounded-lg transition">
                  🔗 Copy Mock Server URL
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}