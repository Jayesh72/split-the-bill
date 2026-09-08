import os
from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory of the backend package
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application settings loaded securely from environment variables or .env."""

    # Application Metadata
    APP_NAME: str = "Split the Bill API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Allowlist
    FRONTEND_URL: str = "http://localhost:5173"
    ADDITIONAL_ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Google Gemini AI Configuration (Primary)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # OpenAI Configuration (Alternative / Fallback)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Upload Constraints
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/bmp",
        "image/tiff",
        "application/pdf",
    ]

    # Rate Limiting
    RATE_LIMIT_MAX_REQUESTS: int = 20  # requests per minute per IP
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> List[str]:
        """Construct a deduplicated list of allowed CORS origins."""
        origins = set(self.ADDITIONAL_ALLOWED_ORIGINS)
        if self.FRONTEND_URL:
            origins.add(self.FRONTEND_URL.rstrip("/"))
        return list(origins)

    def is_gemini_configured(self) -> bool:
        """Check if a valid Google Gemini API key is present."""
        return bool(self.GEMINI_API_KEY and len(self.GEMINI_API_KEY.strip()) > 5)

    def is_openai_configured(self) -> bool:
        """Check if a valid OpenAI API key is present."""
        return bool(self.OPENAI_API_KEY and len(self.OPENAI_API_KEY.strip()) > 5)

    def is_ai_configured(self) -> bool:
        """Check if at least one AI provider key is configured."""
        return self.is_gemini_configured() or self.is_openai_configured()

    def __repr__(self) -> str:
        gemini_status = "Configured" if self.is_gemini_configured() else "Not Configured"
        openai_status = "Configured" if self.is_openai_configured() else "Not Configured"
        return (
            f"<Settings app='{self.APP_NAME}' version='{self.APP_VERSION}' "
            f"port={self.PORT} gemini='{gemini_status}' openai='{openai_status}'>"
        )


# Global settings singleton
settings = Settings()
