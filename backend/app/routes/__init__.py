"""API Routes package."""

from app.routes.health import router as health_router
from app.routes.ocr import router as ocr_router

__all__ = ["health_router", "ocr_router"]
