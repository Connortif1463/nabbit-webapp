from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    google_client_id: str
    google_client_secret: str
    frontend_url: str = "http://127.0.0.1:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()