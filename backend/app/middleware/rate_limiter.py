import time
from collections import defaultdict
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from app.config import settings


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """In-memory sliding window rate limiter for expensive AI endpoints."""

    def __init__(self, app, max_requests: int = 20, window_seconds: int = 60) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests_log: Dict[str, List[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Only rate-limit POST requests to OCR endpoint
        if request.method == "POST" and request.url.path.startswith("/api/ocr"):
            client_ip = request.client.host if request.client else "unknown"
            current_time = time.time()
            cutoff_time = current_time - self.window_seconds

            # Filter out timestamps older than the window
            timestamps = [t for t in self.requests_log[client_ip] if t > cutoff_time]
            self.requests_log[client_ip] = timestamps

            if len(timestamps) >= self.max_requests:
                return JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "error": "Rate limit exceeded. Please wait a moment before processing another receipt.",
                    },
                )

            # Record current request timestamp
            self.requests_log[client_ip].append(current_time)

        return await call_next(request)
