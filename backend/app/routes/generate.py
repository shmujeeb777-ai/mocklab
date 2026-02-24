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

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
        )
        
        # Parse response
        import json
        content = chat_completion.choices[0].message.content
        
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


@router.get("/projects")
async def list_projects(db: Session = Depends(get_db)):
    """List all projects"""
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return {
        "success": True,
        "total": len(projects),
        "projects": [p.to_dict() for p in projects]
    }


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    
    return {
        "success": True,
        "message": f"Project {project_id} deleted successfully"
    }


class UpdateProjectRequest(BaseModel):
    schema: str

@router.patch("/projects/{project_id}")
async def update_project(project_id: str, request: UpdateProjectRequest, db: Session = Depends(get_db)):
    """Update project schema and regenerate endpoints"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not request.schema.strip():
        raise HTTPException(status_code=400, detail="Schema description cannot be empty")
    
    try:
        # Call Groq AI to regenerate endpoints
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

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
        )
        
        # Parse response
        import json
        content = chat_completion.choices[0].message.content
        
        # Handle markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        endpoints = json.loads(content.strip())
        
        # Update project
        project.schema_description = request.schema
        project.endpoints = endpoints
        db.commit()
        db.refresh(project)
        
        return {
            "success": True,
            "message": "Project updated and endpoints regenerated",
            "project": project.to_dict()
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
