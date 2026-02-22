from sqlalchemy import Column, String, DateTime, JSON, Integer
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Project(Base):
    """MockLab Project model"""
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: f"mock_{uuid.uuid4().hex[:12]}")
    schema_description = Column(String, nullable=False)
    endpoints = Column(JSON, nullable=True)  # Array of endpoint objects
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "schema_description": self.schema_description,
            "endpoints": self.endpoints,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
