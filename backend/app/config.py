import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    """Application settings from environment variables"""
    database_url: str = os.getenv("DATABASE_URL", "postgresql://mocklab:mocklab_pass@localhost:5432/mocklab_db")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    debug: bool = os.getenv("DEBUG", "True") == "True"
    google_client_id: str
    google_client_secret: str
    jwt_secret: str

    class Config:
        env_file = ".env"

settings = Settings()
