// In-memory storage for generated mock endpoints

interface MockEndpoint {
  method: string
  path: string
  description: string
  mockResponse: any
  statusCode?: number
  delay?: number
}

interface MockProject {
  id: string
  endpoints: MockEndpoint[]
  createdAt: Date
}

// Simple in-memory store
const mockProjects = new Map<string, MockProject>()

export function generateProjectId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function saveMockProject(endpoints: MockEndpoint[]): string {
  const projectId = generateProjectId()
  mockProjects.set(projectId, {
    id: projectId,
    endpoints,
    createdAt: new Date(),
  })
  console.log(`Saved project ${projectId} with endpoints:`, endpoints.map(ep => `${ep.method} ${ep.path}`))
  return projectId
}

export function getMockProject(projectId: string): MockProject | undefined {
  return mockProjects.get(projectId)
}

export function getMockEndpoint(projectId: string, method: string, path: string): MockEndpoint | undefined {
  const project = mockProjects.get(projectId)
  if (!project) {
    console.log(`Project ${projectId} not found. Available projects:`, Array.from(mockProjects.keys()))
    return undefined
  }
  
  // Normalize method to uppercase
  const normalizedMethod = method.toUpperCase()
  
  // Normalize path
  let normalizedPath = path.startsWith('/') ? path : '/' + path
  normalizedPath = normalizedPath.replace(/\/$/, '') || '/'
  
  console.log(`Looking for ${normalizedMethod} ${normalizedPath} in project ${projectId}`)
  console.log(`Available endpoints:`, project.endpoints.map(ep => `${ep.method} ${ep.path}`))
  
  const endpoint = project.endpoints.find(
    (ep) => ep.method.toUpperCase() === normalizedMethod && 
            (ep.path === normalizedPath || ep.path === path)
  )
  
  if (!endpoint) {
    console.log(`Endpoint not found. Requested: ${normalizedMethod} ${normalizedPath}`)
  }
  
  return endpoint
}
