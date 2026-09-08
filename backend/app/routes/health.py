from fastapi import APIRouter
from app.schemas.ocr import HealthResponse
from app.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health check endpoint",
    description="Returns backend service operational status without exposing sensitive credentials.",
)
async def health_check() -> HealthResponse:
    """Service health verification endpoint."""
    return HealthResponse(
        success=True,
        message="Backend is running",
        version=settings.APP_VERSION,
    )
