from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from groq import Groq
from app.config import settings
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["generate"])

class GenerateRequest(BaseModel):
    schema: str

@router.post("/generate")
async def generate_endpoints(request: GenerateRequest, db: Session = Depends(get_db)):
    """Generate mock endpoints from schema description"""
    
    if not request.schema.strip():
        raise HTTPException(status_code=400, detail="Schema description cannot be empty")
    
    try:
        # Call Groq AI
        client = Groq(api_key=settings.groq_api_key)
        
        prompt = f"""Generate realistic mock API endpoints based on this schema:

{request.schema}

Return a JSON array with these fields for each endpoint:
- method: HTTP method (GET, POST, PUT, DELETE)
- path: endpoint path (e.g., /users, /users/:id)
- description: what this endpoint does
- mockResponse: realistic JSON response data
- statusCode: HTTP status code

Return ONLY valid JSON array, no markdown blocks, no extra text."""

        response = client.messages.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
        )
        
        # Parse response
        import json
        content = response.content[0].text
        
        # Handle markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        endpoints = json.loads(content.strip())
        
        # Save to database
        project = Project(
            schema_description=request.schema,
            endpoints=endpoints
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        
        return {
            "success": True,
            "mockId": project.id,
            "endpoints": endpoints
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/projects/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """Retrieve a project and its endpoints"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project.to_dict()
