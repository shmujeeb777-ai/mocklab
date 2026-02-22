import Groq from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  const { schema } = await req.json()

  if (!schema) {
    return NextResponse.json({ error: "Schema is required" }, { status: 400 })
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are an API expert. Always respond with valid JSON only. No markdown, no explanation.",
      },
      {
        role: "user",
        content: `Analyze this API schema and return mock endpoints.

Schema:
${schema}

Return ONLY this JSON structure:
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/resource",
      "description": "what this endpoint does",
      "mockResponse": { "example": "response body" }
    }
  ]
}`,
      },
    ],
    temperature: 0.3,
  })

  const text = completion.choices[0]?.message?.content || ""

  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(cleaned)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(
      { error: "Failed to parse response", raw: text },
      { status: 500 }
    )
  }
}