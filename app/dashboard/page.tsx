"use client"
import { useState } from "react"

export default function Dashboard() {
  const [schema, setSchema] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [mockId, setMockId] = useState<string | null>(null)

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
    console.log("API Response:", data)  // Debug
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
                {result?.endpoints && result.endpoints.length > 0 ? (
                  result.endpoints.map((ep: any, i: number) => (
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
                  ))
                ) : (
                  <div className="text-red-400 text-sm p-4">
                    ⚠️ Error: No endpoints received. The API response may have failed. Check the browser console for details.
                  </div>
                )}
                <button className="mt-2 w-full border border-gray-700 hover:border-blue-500 text-gray-300 text-sm font-semibold py-2 rounded-lg transition">
                  🔗 Copy Mock Server URL
                </button>
              </div>
            )}
          </div>
            {/* Mock Server URL Bar */}
{mockId && result?.endpoints && (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="md:col-span-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4">
      <p className="text-green-400 text-xs font-semibold mb-2">🟢 Your Mock Server is Live!</p>
      <p className="text-gray-300 text-xs mb-3">Base URL:</p>
      <div className="bg-gray-950 rounded p-3 mb-3 border border-green-500/20">
        <code className="text-green-400 font-mono text-xs break-all">/api/mock/{mockId}</code>
      </div>
      <p className="text-gray-400 text-xs mb-3">Hit these endpoints:</p>
      <div className="space-y-2">
        {result.endpoints.slice(0, 3).map((ep: any, i: number) => (
          <div key={i} className="bg-gray-950 rounded p-2 border border-gray-800 flex items-center justify-between">
            <span className="text-gray-300 text-xs">
              <span className="font-bold text-blue-400">{ep.method}</span> <span className="text-gray-400">/api/mock/{mockId}{ep.path}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </main>
  )
}