import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { schema } = await req.json()

  if (!schema) {
    return NextResponse.json({ error: "Schema is required" }, { status: 400 })
  }

  try {
    // Call backend FastAPI server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schema }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Backend error" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Backend error:", error)
    return NextResponse.json(
      { error: `Failed to connect to backend: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}