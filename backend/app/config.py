from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SMS_API_KEY: str
    CALENDAR_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()