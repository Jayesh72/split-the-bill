import io
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.schemas.ocr import ExtractedReceiptData, ExtractedReceiptItem

client = TestClient(app)


def test_extract_receipt_invalid_file_type():
    """Verify rejection of unsupported file types."""
    file_content = b"fake executable content"
    files = {"file": ("test.exe", io.BytesIO(file_content), "application/x-msdownload")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "Unsupported file format" in data["error"]


def test_extract_receipt_empty_file():
    """Verify rejection of empty file uploads."""
    files = {"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "empty" in data["error"].lower()


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_extract_receipt_gemini_success(mock_gemini):
    """Verify successful OCR extraction flow with mocked Gemini response."""
    # Temporarily set dummy key for test
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

        fake_image = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00"
        files = {"file": ("receipt.jpg", io.BytesIO(fake_image), "image/jpeg")}

        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["restaurantName"] == "The Olive Table"
        assert len(data["data"]["items"]) == 2
        assert data["data"]["grandTotal"] == 768.0
    finally:
        settings.GEMINI_API_KEY = original_key
