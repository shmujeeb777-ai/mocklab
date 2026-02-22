import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings from environment variables"""
    database_url: str = os.getenv("DATABASE_URL", "postgresql://mocklab:mocklab_pass@localhost:5432/mocklab_db")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    debug: bool = os.getenv("DEBUG", "True") == "True"
    
    class Config:
        env_file = ".env"

settings = Settings()
