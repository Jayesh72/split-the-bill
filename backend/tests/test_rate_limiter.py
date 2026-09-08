import io
from PIL import Image
import pytest
from unittest.mock import AsyncMock
from starlette.requests import Request
from app.middleware.rate_limiter import RateLimiterMiddleware
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_rate_limiter_allows_health():
    """Verify health endpoint is unaffected by rate limiter."""
    for _ in range(5):
        resp = client.get("/api/health")
        assert resp.status_code == 200


@pytest.mark.anyio
async def test_rate_limiter_dispatch_logic():
    """Verify rate limit middleware blocks when threshold is exceeded."""
    rate_middleware = RateLimiterMiddleware(app=AsyncMock(), max_requests=3, window_seconds=60)
    
    mock_request = AsyncMock(spec=Request)
    mock_request.method = "POST"
    mock_request.url.path = "/api/ocr/extract"
    mock_request.client.host = "192.168.1.50"
    
    call_next = AsyncMock(return_value="OK")
    
    # 1st request -> ok
    res1 = await rate_middleware.dispatch(mock_request, call_next)
    assert res1 == "OK"
    
    # 2nd request -> ok
    res2 = await rate_middleware.dispatch(mock_request, call_next)
    assert res2 == "OK"
    
    # 3rd request -> ok
    res3 = await rate_middleware.dispatch(mock_request, call_next)
    assert res3 == "OK"
    
    # 4th request -> 429 Rate limit exceeded
    res4 = await rate_middleware.dispatch(mock_request, call_next)
    assert res4.status_code == 429
    assert res4.body is not None
