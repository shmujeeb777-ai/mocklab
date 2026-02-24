import { NextRequest, NextResponse } from "next/server"

// Helper function to find matching endpoint
function findEndpoint(endpoints: any[], method: string, path: string) {
  return endpoints.find(
    (ep) => ep.method === method && ep.path === path
  )
}

// Helper to fetch project from backend
async function getProjectFromBackend(projectId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  try {
    const response = await fetch(`${backendUrl}/api/projects/${projectId}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch project from backend:", error)
    return null
  }
}

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

    // Fetch project from backend
    const project = await getProjectFromBackend(projectId)
    if (!project) {
      return NextResponse.json(
        { error: `Project ${projectId} not found` },
        { status: 404 }
      )
    }

    const endpoint = findEndpoint(project.endpoints, "GET", path)
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

    const project = await getProjectFromBackend(projectId)
    if (!project) {
      return NextResponse.json(
        { error: `Project ${projectId} not found` },
        { status: 404 }
      )
    }

    const endpoint = findEndpoint(project.endpoints, "POST", path)
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

    const project = await getProjectFromBackend(projectId)
    if (!project) {
      return NextResponse.json(
        { error: `Project ${projectId} not found` },
        { status: 404 }
      )
    }

    const endpoint = findEndpoint(project.endpoints, "PUT", path)
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

    const project = await getProjectFromBackend(projectId)
    if (!project) {
      return NextResponse.json(
        { error: `Project ${projectId} not found` },
        { status: 404 }
      )
    }

    const endpoint = findEndpoint(project.endpoints, "DELETE", path)
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
