'use client'
import { useEffect } from "react"

// Add TypeScript declaration for window.google
declare global {
  interface Window {
    google?: any
  }
}
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { user, login, isLoading } = useAuth()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    // Cleanup
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Callback for Google One Tap
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (
      typeof window !== "undefined" &&
      window.google &&
      window.google.accounts &&
      clientId
    ) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            await login(response.credential)
            router.push("/dashboard")
          } catch (error) {
            console.error("Login failed:", error)
          }
        },
      })
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: 320 }
      )
    }
  }, [login, router])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-2xl text-white mb-4">
              M
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">MockLab</h1>
            <p className="text-slate-400">AI-Powered Mock API Generator</p>
          </div>

          {/* Description */}
          <div className="mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-3">Welcome!</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sign in with your Google account to start generating production-ready mock APIs instantly.
            </p>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center mb-6">
            <div id="google-signin-btn"></div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-xs text-slate-400 font-semibold mb-4">FEATURES</p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>AI-generated endpoints</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>Instant shareable URLs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>PostgreSQL persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                <span>All HTTP methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
