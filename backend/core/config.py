import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ArogyaMitra"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "b3cf9bf82649bdae1cdef1b901fc4fcf0f0d3663b652ee9eef6867e1a3d0f0d2")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # DB
    DATABASE_URL: str = "sqlite:///./arogyamitra.db"

    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")
    SPOONACULAR_API_KEY: str = os.getenv("SPOONACULAR_API_KEY", "")

settings = Settings()
