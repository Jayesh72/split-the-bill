import io
from PIL import Image
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.schemas.ocr import ExtractedReceiptData, ExtractedReceiptItem

client = TestClient(app)


def create_test_jpeg() -> bytes:
    buf = io.BytesIO()
    img = Image.new("RGB", (50, 50), color=(200, 200, 200))
    img.save(buf, format="JPEG")
    return buf.getvalue()


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_extract_receipt_gemini_success(mock_gemini):
    """Verify successful OCR extraction flow with Gemini."""
    original_key = settings.GEMINI_API_KEY
    settings.GEMINI_API_KEY = "dummy_test_gemini_key_123456"

    try:
        mock_data = ExtractedReceiptData(
            restaurantName="The Olive Table",
            location="Indiranagar, Bengaluru",
            billNumber="REC-1002",
            currency="₹",
            items=[
                ExtractedReceiptItem(name="Butter Chicken", qty=1, price=420.0),
                ExtractedReceiptItem(name="Garlic Naan", qty=2, price=180.0),
            ],
            subtotal=600.0,
            gst=108.0,
            gstRate=18.0,
            serviceCharge=60.0,
            serviceChargeRate=10.0,
            grandTotal=768.0,
        )
        mock_gemini.return_value = mock_data

        image_bytes = create_test_jpeg()
        files = {"file": ("receipt.jpg", io.BytesIO(image_bytes), "image/jpeg")}

        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["restaurantName"] == "The Olive Table"
        assert len(data["data"]["items"]) == 2
        assert data["data"]["grandTotal"] == 768.0
    finally:
        settings.GEMINI_API_KEY = original_key


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_extract_receipt_gemini_value_error(mock_gemini):
    """Verify handling when Gemini raises a validation/parsing error."""
    original_key = settings.GEMINI_API_KEY
    settings.GEMINI_API_KEY = "dummy_test_gemini_key_123456"

    try:
        mock_gemini.side_effect = ValueError("Gemini returned invalid JSON structure.")
        image_bytes = create_test_jpeg()
        files = {"file": ("receipt.jpg", io.BytesIO(image_bytes), "image/jpeg")}

        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
        assert "invalid json" in data["error"].lower()
    finally:
        settings.GEMINI_API_KEY = original_key


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_extract_receipt_unexpected_exception(mock_gemini):
    """Verify safe 500 error response without exposing internal secrets."""
    original_key = settings.GEMINI_API_KEY
    settings.GEMINI_API_KEY = "dummy_test_gemini_key_123456"

    try:
        mock_gemini.side_effect = RuntimeError("Internal connection timeout")
        image_bytes = create_test_jpeg()
        files = {"file": ("receipt.jpg", io.BytesIO(image_bytes), "image/jpeg")}

        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 500
        data = response.json()
        assert data["success"] is False
        assert "error occurred while processing the receipt" in data["error"].lower()
    finally:
        settings.GEMINI_API_KEY = original_key


def test_extract_receipt_no_ai_key_configured():
    """Verify 503 error when neither Gemini nor OpenAI API key is configured."""
    orig_gemini = settings.GEMINI_API_KEY
    orig_openai = settings.OPENAI_API_KEY
    settings.GEMINI_API_KEY = ""
    settings.OPENAI_API_KEY = ""

    try:
        image_bytes = create_test_jpeg()
        files = {"file": ("receipt.jpg", io.BytesIO(image_bytes), "image/jpeg")}
        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 503
        data = response.json()
        assert data["success"] is False
        assert "No AI API key is configured" in data["error"]
    finally:
        settings.GEMINI_API_KEY = orig_gemini
        settings.OPENAI_API_KEY = orig_openai
