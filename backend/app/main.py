import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.routes.health import router as health_router
from app.routes.ocr import router as ocr_router
from app.middleware.rate_limiter import RateLimiterMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("split_the_bill.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    logger.info("Starting %s v%s...", settings.APP_NAME, settings.APP_VERSION)
    if settings.is_gemini_configured():
        logger.info("✓ Google Gemini API key verified (Primary OCR provider).")
    elif settings.is_openai_configured():
        logger.info("✓ OpenAI API key verified.")
    else:
        logger.warning(
            "⚠️ Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured in backend/.env. "
            "Please configure GEMINI_API_KEY in backend/.env for AI receipt OCR extraction."
        )
    logger.info("Allowed CORS Origins: %s", settings.cors_origins)
    yield
    logger.info("Shutting down %s...", settings.APP_NAME)


# FastAPI Application Instance
app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Production-grade Python FastAPI backend for Split the Bill. "
        "Provides secure receipt OCR extraction powered by Google Gemini and OpenAI Vision API, "
        "Pydantic data contract validation, and settlement calculations."
    ),
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# 1. CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Rate Limiter Middleware
app.add_middleware(
    RateLimiterMiddleware,
    max_requests=settings.RATE_LIMIT_MAX_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)

# 3. Mount Routers with /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(ocr_router, prefix="/api")


# 4. Root Welcome Route
@app.get("/", tags=["Root"], summary="API Root Overview")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health",
        "ocr_endpoint": "/api/ocr/extract",
    }


# 5. Global Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [f"{e['loc'][-1]}: {e['msg']}" for e in exc.errors()]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Request validation failed.",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception: %s", str(exc), exc_info=settings.DEBUG)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An unexpected internal server error occurred.",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
