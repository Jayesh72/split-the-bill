import io
from PIL import Image
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.schemas.ocr import ExtractedReceiptData, ExtractedReceiptItem

client = TestClient(app)


def create_test_image(format: str = "JPEG", size=(100, 100), color=(255, 0, 0)) -> bytes:
    """Helper to generate valid in-memory image bytes."""
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    return buf.getvalue()


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_valid_jpeg_upload(mock_extract):
    """Verify valid JPEG passes binary image validation."""
    mock_extract.return_value = ExtractedReceiptData(
        restaurantName="Cafe Bistro",
        grandTotal=100.0,
        items=[ExtractedReceiptItem(name="Coffee", qty=1, price=100.0)],
    )
    image_bytes = create_test_image("JPEG")
    files = {"file": ("receipt.jpg", io.BytesIO(image_bytes), "image/jpeg")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 200
    assert response.json()["success"] is True


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_valid_png_upload(mock_extract):
    """Verify valid PNG passes binary image validation."""
    mock_extract.return_value = ExtractedReceiptData(
        restaurantName="Cafe Bistro",
        grandTotal=100.0,
        items=[ExtractedReceiptItem(name="Coffee", qty=1, price=100.0)],
    )
    image_bytes = create_test_image("PNG")
    files = {"file": ("receipt.png", io.BytesIO(image_bytes), "image/png")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 200
    assert response.json()["success"] is True


@patch("app.routes.ocr.gemini_service.extract_receipt")
def test_valid_webp_upload(mock_extract):
    """Verify valid WebP passes binary image validation."""
    mock_extract.return_value = ExtractedReceiptData(
        restaurantName="Cafe Bistro",
        grandTotal=100.0,
        items=[ExtractedReceiptItem(name="Coffee", qty=1, price=100.0)],
    )
    image_bytes = create_test_image("WEBP")
    files = {"file": ("receipt.webp", io.BytesIO(image_bytes), "image/webp")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_unsupported_file_extension():
    """Verify rejection of unsupported file extensions (e.g. .exe, .sh, .py)."""
    fake_exe = b"MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00"
    files = {"file": ("malicious.exe", io.BytesIO(fake_exe), "application/x-msdownload")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    assert response.json()["success"] is False


def test_spoofed_mime_type():
    """Verify rejection of text file renamed with .jpg extension."""
    fake_text = b"Hello, this is just a plain text file pretending to be an image."
    files = {"file": ("fake_receipt.jpg", io.BytesIO(fake_text), "image/jpeg")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "not a valid or supported image" in data["error"].lower()


def test_empty_file_upload():
    """Verify rejection of 0-byte upload."""
    files = {"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["error"].lower()


def test_oversized_file_upload():
    """Verify rejection of oversized file payload (> MAX_UPLOAD_SIZE_BYTES)."""
    original_max = settings.MAX_UPLOAD_SIZE_BYTES
    settings.MAX_UPLOAD_SIZE_BYTES = 1024  # Set low limit for testing
    try:
        big_payload = b"A" * 2048
        files = {"file": ("large.jpg", io.BytesIO(big_payload), "image/jpeg")}
        response = client.post("/api/ocr/extract", files=files)
        assert response.status_code == 413
        assert "exceeds maximum size limit" in response.json()["error"]
    finally:
        settings.MAX_UPLOAD_SIZE_BYTES = original_max


def test_corrupted_image_bytes():
    """Verify rejection of corrupted image headers."""
    corrupted_bytes = b"\xff\xd8\xff\xe0" + b"\x00" * 20  # Incomplete JPEG header
    files = {"file": ("corrupt.jpg", io.BytesIO(corrupted_bytes), "image/jpeg")}
    response = client.post("/api/ocr/extract", files=files)
    assert response.status_code == 400
    assert "not a valid or supported image" in response.json()["error"].lower()


def test_missing_file_parameter():
    """Verify 422 when required file parameter is missing."""
    response = client.post("/api/ocr/extract", data={})
    assert response.status_code == 422
