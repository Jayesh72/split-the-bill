import pytest
from pydantic import ValidationError
from app.schemas.ocr import ExtractedReceiptItem, ExtractedReceiptData, OCRResponse


def test_extracted_receipt_item_valid():
    """Test valid item schema parsing."""
    item = ExtractedReceiptItem(name="Butter Chicken", qty=2, price=840.0, isShared=True)
    assert item.name == "Butter Chicken"
    assert item.qty == 2
    assert item.price == 840.0
    assert item.isShared is True


def test_extracted_receipt_item_defaults():
    """Test default values and price rounding."""
    item = ExtractedReceiptItem(name=" Garlic Naan ", price=90.004)
    assert item.name == "Garlic Naan"
    assert item.qty == 1
    assert item.price == 90.0
    assert item.isShared is False


def test_extracted_receipt_data_computation():
    """Test ExtractedReceiptData structure."""
    data = ExtractedReceiptData(
        restaurantName="The Olive Table",
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
    assert data.restaurantName == "The Olive Table"
    assert len(data.items) == 2
    assert data.subtotal == 600.0
    assert data.grandTotal == 768.0


def test_ocr_response_envelope():
    """Test OCR response envelope with data."""
    data = ExtractedReceiptData(restaurantName="Cafe Bistro", grandTotal=150.0)
    response = OCRResponse(success=True, data=data)
    assert response.success is True
    assert response.data is not None
    assert response.data.restaurantName == "Cafe Bistro"
