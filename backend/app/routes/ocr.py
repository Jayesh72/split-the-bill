import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.ocr import OCRResponse, ExtractedReceiptData
from app.services.gemini_service import gemini_service
from app.services.openai_service import openai_service
from app.config import settings

logger = logging.getLogger("split_the_bill.ocr_route")

router = APIRouter(prefix="/ocr", tags=["OCR Extraction"])


@router.post(
    "/extract",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract structured receipt items from an image",
    description=(
        "Receives an uploaded receipt image, validates size and format, "
        "sends to Google Gemini or OpenAI Vision API, and returns validated structured receipt data."
    ),
)
async def extract_receipt(
    file: UploadFile = File(..., description="Uploaded receipt image (PNG, JPEG, WebP, HEIC, PDF)"),
) -> OCRResponse:
    """Extract itemized dishes, prices, and taxes from a restaurant receipt image."""

    # 1. Validate content type
    content_type = file.content_type or ""
    # Fallback to image/jpeg if missing or generic octet-stream
    if not content_type or content_type == "application/octet-stream":
        filename_lower = (file.filename or "").lower()
        if filename_lower.endswith((".jpg", ".jpeg")):
            content_type = "image/jpeg"
        elif filename_lower.endswith(".png"):
            content_type = "image/png"
        elif filename_lower.endswith(".webp"):
            content_type = "image/webp"
        elif filename_lower.endswith(".heic"):
            content_type = "image/heic"
        elif filename_lower.endswith(".pdf"):
            content_type = "application/pdf"
        else:
            content_type = "image/jpeg"

    if content_type.lower() not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file format: {content_type}. "
                "Allowed formats: PNG, JPEG, JPG, WebP, HEIC, PDF."
            ),
        )

    # 2. Read file safely in-memory
    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file buffer: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to read the uploaded receipt image file.",
        ) from exc

    # 3. Validate file size
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty.",
        )

    if len(image_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        max_mb = settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Uploaded image exceeds maximum size limit of {max_mb}MB.",
        )

    # 4. Check AI service configuration
    if not settings.is_ai_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "No AI API key is configured on the backend. "
                "Please set GEMINI_API_KEY (or OPENAI_API_KEY) in backend/.env"
            ),
        )

    # 5. Process with Gemini (Primary) or OpenAI (Secondary)
    try:
        if settings.is_gemini_configured():
            logger.info("Extracting receipt with Google Gemini Vision...")
            extracted: ExtractedReceiptData = await gemini_service.extract_receipt(
                image_bytes=image_bytes,
                mime_type=content_type,
            )
        else:
            logger.info("Extracting receipt with OpenAI Vision...")
            extracted: ExtractedReceiptData = await openai_service.extract_receipt(
                image_bytes=image_bytes,
                mime_type=content_type,
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
