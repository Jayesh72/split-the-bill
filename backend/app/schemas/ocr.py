from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class ExtractedReceiptItem(BaseModel):
    """Represents an individual itemized dish or beverage on a receipt."""

    name: str = Field(..., description="Exact dish, beverage, or item name", min_length=1)
    qty: int = Field(default=1, ge=1, description="Quantity of the item ordered")
    price: float = Field(..., ge=0.0, description="Total line price for this item")
    isShared: Optional[bool] = Field(default=False, description="Whether this item is shared across multiple diners")

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return v.strip() or "Item"

    @field_validator("price")
    @classmethod
    def round_price(cls, v: float) -> float:
        return round(float(v), 2)


class ExtractedReceiptData(BaseModel):
    """Complete structured bill data extracted from a receipt image."""

    restaurantName: str = Field(
        default="Restaurant Receipt",
        description="Detected restaurant or merchant name",
    )
    location: Optional[str] = Field(
        default="",
        description="Restaurant address, branch, or location string",
    )
    billNumber: Optional[str] = Field(
        default="",
        description="Bill, invoice, or receipt reference number",
    )
    currency: Optional[str] = Field(
        default="₹",
        description="Detected currency symbol (e.g. ₹, $, €, £)",
    )
    items: List[ExtractedReceiptItem] = Field(
        default_factory=list,
        description="List of detected itemized line items",
    )
    subtotal: float = Field(
        default=0.0,
        ge=0.0,
        description="Calculated subtotal before taxes and fees",
    )
    gst: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        description="Total GST / VAT / sales tax amount",
    )
    gstRate: Optional[float] = Field(
        default=5.0,
        ge=0.0,
        description="Estimated or detected tax rate percentage",
    )
    serviceCharge: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        description="Service charge, tip, or fee amount",
    )
    serviceChargeRate: Optional[float] = Field(
        default=10.0,
        ge=0.0,
        description="Estimated or detected service charge rate percentage",
    )
    grandTotal: float = Field(
        default=0.0,
        ge=0.0,
        description="Final receipt grand total including taxes and service charges",
    )

    @field_validator("subtotal", "gst", "serviceCharge", "grandTotal", mode="before")
    @classmethod
    def clean_floats(cls, v: Optional[float]) -> float:
        if v is None:
            return 0.0
        return round(float(v), 2)


class OCRResponse(BaseModel):
    """Standardized API response envelope for receipt OCR extraction."""

    success: bool = Field(default=True, description="Whether the extraction succeeded")
    data: Optional[ExtractedReceiptData] = Field(
        default=None,
        description="Extracted structured receipt data on success",
    )
    error: Optional[str] = Field(
        default=None,
        description="Error description if extraction failed",
    )
    message: Optional[str] = Field(
        default=None,
        description="Optional status message or hint",
    )


class HealthResponse(BaseModel):
    """Health check endpoint response envelope."""

    success: bool = Field(default=True, description="Service operational status")
    message: str = Field(default="Backend is running", description="Health status message")
    version: str = Field(default="0.1.0", description="API version")
