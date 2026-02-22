import { NextRequest, NextResponse } from "next/server"
import { getMockEndpoint } from "@/lib/mock-storage"

// Dynamic route handler for mock endpoints
// URL format: /api/mock/[projectId]/[...path]
// Examples:
// - /api/mock/mock_123456/users
// - /api/mock/mock_123456/users/123

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    console.log("🔍 Mock GET request - slug:", JSON.stringify(slug))
    
    if (!slug || slug.length < 2) {
      return NextResponse.json(
        { error: "Invalid URL. Use format: /api/mock/[projectId]/[path]" },
        { status: 400 }
      )
    }

    const projectId = slug[0]
    const path = "/" + slug.slice(1).join("/")

    console.log(`📍 Looking for: ${projectId} -> GET ${path}`)

    const endpoint = getMockEndpoint(projectId, "GET", path)

    if (!endpoint) {
      return NextResponse.json(
        { error: `Endpoint ${path} not found in project ${projectId}` },
        { status: 404 }
      )
    }

    return NextResponse.json(endpoint.mockResponse, {
      status: endpoint.statusCode || 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("❌ Mock GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    if (!slug || slug.length < 2) {
      return NextResponse.json(
        { error: "Invalid URL. Use format: /api/mock/[projectId]/[path]" },
        { status: 400 }
      )
    }

    const projectId = slug[0]
    const path = "/" + slug.slice(1).join("/")

    const endpoint = getMockEndpoint(projectId, "POST", path)

    if (!endpoint) {
      return NextResponse.json(
        { error: `Endpoint ${path} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(endpoint.mockResponse, {
      status: endpoint.statusCode || 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("❌ Mock POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    if (!slug || slug.length < 2) {
      return NextResponse.json(
        { error: "Invalid URL. Use format: /api/mock/[projectId]/[path]" },
        { status: 400 }
      )
    }

    const projectId = slug[0]
    const path = "/" + slug.slice(1).join("/")

    const endpoint = getMockEndpoint(projectId, "PUT", path)

    if (!endpoint) {
      return NextResponse.json(
        { error: `Endpoint ${path} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(endpoint.mockResponse, {
      status: endpoint.statusCode || 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("❌ Mock PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    if (!slug || slug.length < 2) {
      return NextResponse.json(
        { error: "Invalid URL. Use format: /api/mock/[projectId]/[path]" },
        { status: 400 }
      )
    }

    const projectId = slug[0]
    const path = "/" + slug.slice(1).join("/")

    const endpoint = getMockEndpoint(projectId, "DELETE", path)

    if (!endpoint) {
      return NextResponse.json(
        { error: `Endpoint ${path} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(endpoint.mockResponse, {
      status: endpoint.statusCode || 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("❌ Mock DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
