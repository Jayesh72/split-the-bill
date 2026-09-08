import io
import logging
from PIL import Image, UnidentifiedImageError
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.ocr import OCRResponse, ExtractedReceiptData
from app.services.gemini_service import gemini_service
from app.services.openai_service import openai_service
from app.config import settings

logger = logging.getLogger("split_the_bill.ocr_route")

router = APIRouter(prefix="/ocr", tags=["OCR Extraction"])

# Supported Pillow format names mapped to MIME types
ALLOWED_PIL_FORMATS = {"JPEG", "PNG", "WEBP", "MPO", "HEIC", "BMP", "TIFF"}


def validate_image_payload(image_bytes: bytes, reported_content_type: str) -> str:
    """Inspect and validate binary payload to prevent spoofed/malicious/corrupted file uploads.

    Args:
        image_bytes: Raw binary bytes of the file.
        reported_content_type: MIME type reported by the client.

    Returns:
        Verified canonical MIME type string.
    """
    # 1. Non-empty check
    if not image_bytes or len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes).",
        )

    # 2. Maximum size check
    if len(image_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        max_mb = settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Uploaded image exceeds maximum size limit of {max_mb}MB.",
        )

    # 3. PDF verification
    if reported_content_type == "application/pdf" or image_bytes.startswith(b"%PDF"):
        if not image_bytes.startswith(b"%PDF"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PDF file. The file lacks a valid PDF header.",
            )
        return "application/pdf"

    # 4. Pillow Image Integrity & Header Verification
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img.verify()
            fmt = (img.format or "").upper()
            if fmt not in ALLOWED_PIL_FORMATS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported image format: {fmt}. Allowed formats: JPEG, PNG, WebP, HEIC.",
                )
            
            # Map canonical MIME types
            if fmt == "PNG":
                return "image/png"
            elif fmt == "WEBP":
                return "image/webp"
            elif fmt == "HEIC":
                return "image/heic"
            else:
                return "image/jpeg"

    except (UnidentifiedImageError, OSError, SyntaxError) as exc:
        logger.warning("Uploaded file failed binary image inspection: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is not a valid or supported image (corrupted or invalid header).",
        ) from exc


@router.post(
    "/extract",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract structured receipt items from an image",
    description=(
        "Receives an uploaded receipt image, performs binary image verification, "
        "sends to Google Gemini or OpenAI Vision API, and returns validated structured receipt data."
    ),
)
async def extract_receipt(
    file: UploadFile = File(..., description="Uploaded receipt image (PNG, JPEG, WebP, HEIC, PDF)"),
) -> OCRResponse:
    """Extract itemized dishes, prices, and taxes from a restaurant receipt image."""

    # 1. Read file safely in-memory
    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file buffer: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to read the uploaded receipt image file.",
        ) from exc

    # 2. Binary Image Inspection & Content Validation (defense against spoofed MIME/renamed files)
    reported_type = (file.content_type or "").lower()
    verified_mime = validate_image_payload(image_bytes, reported_type)

    # 3. Check AI service configuration
    if not settings.is_ai_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "No AI API key is configured on the backend. "
                "Please set GEMINI_API_KEY (or OPENAI_API_KEY) in backend/.env"
            ),
        )

    # 4. Process with Gemini (Primary) or OpenAI (Secondary)
    try:
        if settings.is_gemini_configured():
            logger.info("Extracting receipt with Google Gemini Vision (%s)...", verified_mime)
            extracted: ExtractedReceiptData = await gemini_service.extract_receipt(
                image_bytes=image_bytes,
                mime_type=verified_mime,
            )
        else:
            logger.info("Extracting receipt with OpenAI Vision (%s)...", verified_mime)
            extracted: ExtractedReceiptData = await openai_service.extract_receipt(
                image_bytes=image_bytes,
                mime_type=verified_mime,
            )

        return OCRResponse(
            success=True,
            data=extracted,
            message="Receipt items extracted and validated successfully.",
        )

    except ValueError as exc:
        logger.warning("Receipt processing validation failure: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        logger.error("Unexpected error during receipt extraction: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the receipt. Please try again.",
        ) from exc
