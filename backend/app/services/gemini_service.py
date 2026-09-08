import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from app.config import settings
from app.schemas.ocr import ExtractedReceiptData

logger = logging.getLogger("split_the_bill.gemini_service")

# Candidate models tried in sequence for resilience
CANDIDATE_GEMINI_MODELS: List[str] = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-flash-latest",
]


class GeminiService:
    """Service layer encapsulating Google Gemini multimodal Vision OCR extraction."""

    def __init__(self) -> None:
        self._configured = False

    def _configure_genai(self) -> None:
        """Initialize Google Generative AI SDK with API key."""
        if not settings.is_gemini_configured():
            raise ValueError(
                "GEMINI_API_KEY is not configured on the backend. "
                "Please set GEMINI_API_KEY in backend/.env"
            )
        if not self._configured:
            genai.configure(api_key=settings.GEMINI_API_KEY.strip())
            self._configured = True

    async def extract_receipt(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
    ) -> ExtractedReceiptData:
        """Send receipt image to Google Gemini Vision and parse structured receipt data.

        Args:
            image_bytes: Raw binary bytes of the uploaded receipt image.
            mime_type: Content type of the image.

        Returns:
            ExtractedReceiptData validated Pydantic model.
        """
        if not image_bytes or len(image_bytes) == 0:
            raise ValueError("Empty image payload provided for receipt extraction.")

        self._configure_genai()

        clean_mime = mime_type.lower()
        if clean_mime not in settings.ALLOWED_IMAGE_TYPES:
            clean_mime = "image/jpeg"

        prompt = (
            "You are an expert restaurant bill and receipt parser. Analyze this receipt image "
            "and extract all itemized dishes, drinks, quantities, individual/line prices, "
            "detected currency symbol, subtotal, GST/VAT taxes, service charge or tip, and grand total.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "Respond ONLY with a valid JSON object in this exact format with no backticks, no markdown, and no extra text:\n"
            "{\n"
            '  "restaurantName": "Name of restaurant or \'Restaurant Receipt\'",\n'
            '  "location": "Location / address if available or \'\'",\n'
            '  "billNumber": "Bill or invoice number if found or \'\'",\n'
            '  "currency": "₹ or $ or € or appropriate currency symbol",\n'
            '  "items": [\n'
            "    {\n"
            '      "name": "Exact dish or drink name",\n'
            '      "qty": 1,\n'
            '      "price": 240.00\n'
            "    }\n"
            "  ],\n"
            '  "subtotal": 240.00,\n'
            '  "gst": 43.20,\n'
            '  "gstRate": 18,\n'
            '  "serviceCharge": 24.00,\n'
            '  "serviceChargeRate": 10,\n'
            '  "grandTotal": 307.20\n'
            "}"
        )

        image_part = {
            "mime_type": clean_mime,
            "data": image_bytes,
        }

        # Try candidate models sequentially until one succeeds
        last_error: Exception | None = None
        response_text: str | None = None

        for model_name in CANDIDATE_GEMINI_MODELS:
            try:
                model = genai.GenerativeModel(model_name=model_name)
                response = model.generate_content([prompt, image_part])
                if response and response.text:
                    response_text = response.text
                    break
            except Exception as exc:
                last_error = exc
                logger.warning("Gemini model '%s' failed, trying next candidate...", model_name)
                continue

        if not response_text:
            error_msg = str(last_error) if last_error else "Unable to extract receipt with Gemini."
            logger.error("All Gemini candidate models failed: %s", error_msg)
            raise ValueError(
                f"Gemini OCR extraction failed. Please check your GEMINI_API_KEY in backend/.env. ({error_msg})"
            )

        # Clean JSON markdown if returned
        json_string = response_text.strip()
        if json_string.startswith("```"):
            lines = json_string.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            json_string = "\n".join(lines).strip()

        first_brace = json_string.find("{")
        last_brace = json_string.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            json_string = json_string[first_brace : last_brace + 1]

        try:
            parsed_json: Dict[str, Any] = json.loads(json_string)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse Gemini JSON output: %s", json_string[:200])
            raise ValueError("Gemini returned invalid JSON structure.") from exc

        # Ensure items array exists
        if "items" not in parsed_json or not isinstance(parsed_json["items"], list):
            parsed_json["items"] = []

        # Validate against Pydantic model
        return ExtractedReceiptData.model_validate(parsed_json)


gemini_service = GeminiService()
