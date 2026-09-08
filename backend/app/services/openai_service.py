import json
import base64
import logging
from typing import Dict, Any
from openai import AsyncOpenAI, APIError, AuthenticationError, RateLimitError
from app.config import settings
from app.schemas.ocr import ExtractedReceiptData

logger = logging.getLogger("split_the_bill.openai_service")


class OpenAIService:
    """Service layer encapsulating OpenAI Vision OCR extraction for restaurant receipts."""

    def __init__(self) -> None:
        self._client: AsyncOpenAI | None = None

    @property
    def client(self) -> AsyncOpenAI:
        """Lazy initialization of AsyncOpenAI client."""
        if self._client is None:
            if not settings.is_openai_configured():
                raise ValueError(
                    "OPENAI_API_KEY is not configured on the backend. "
                    "Please set OPENAI_API_KEY in backend/.env"
                )
            self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY.strip())
        return self._client

    async def extract_receipt(
        self,
        image_bytes: bytes,
        mime_type: str = "image/jpeg",
    ) -> ExtractedReceiptData:
        """Send receipt image to OpenAI Vision and parse structured receipt data.

        Args:
            image_bytes: Raw binary bytes of the uploaded receipt image.
            mime_type: Content type of the image (e.g. image/jpeg, image/png).

        Returns:
            ExtractedReceiptData validated Pydantic model.

        Raises:
            ValueError: If image is invalid or OpenAI returns unparsable JSON.
            AuthenticationError: If the backend API key is invalid.
            RateLimitError: If OpenAI rate limits are exceeded.
            APIError: If OpenAI service fails.
        """
        if not image_bytes or len(image_bytes) == 0:
            raise ValueError("Empty image payload provided for receipt extraction.")

        # Normalize mime type for data URI
        clean_mime = mime_type.lower()
        if clean_mime not in settings.ALLOWED_IMAGE_TYPES:
            clean_mime = "image/jpeg"

        # Encode image to base64
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        data_uri = f"data:{clean_mime};base64,{base64_image}"

        system_prompt = (
            "You are an expert restaurant bill and receipt parser. Analyze the receipt image "
            "and extract all itemized dishes, drinks, quantities, individual/line prices, "
            "detected currency symbol, subtotal, GST/VAT taxes, service charge or tip, and grand total.\n\n"
            "CRITICAL INSTRUCTIONS:\n"
            "1. Output ONLY a valid JSON object matching the requested schema.\n"
            "2. Do NOT wrap output in markdown codeblocks (no ```json or ```).\n"
            "3. Ensure all prices and quantities are positive numbers.\n"
            "4. For dishes ordered multiple times, record the exact quantity and total line price.\n"
            "5. If tax or service charge is listed, extract both the amount and percentage rate."
        )

        user_content = [
            {
                "type": "text",
                "text": (
                    "Extract all structured receipt items from this image and return a JSON object with keys: "
                    "restaurantName, location, billNumber, currency, items (array of {name, qty, price}), "
                    "subtotal, gst, gstRate, serviceCharge, serviceChargeRate, grandTotal."
                ),
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": data_uri,
                    "detail": "high",
                },
            },
        ]

        try:
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=2048,
            )

            raw_text = response.choices[0].message.content or "{}"
            raw_text = raw_text.strip()

            # Clean any stray markdown tags if returned
            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()

            parsed_json: Dict[str, Any] = json.loads(raw_text)

            # Ensure subtotal & grandTotal consistency if omitted
            if "items" in parsed_json and isinstance(parsed_json["items"], list):
                computed_subtotal = sum(
                    float(item.get("price", 0)) for item in parsed_json["items"]
                )
                if not parsed_json.get("subtotal") or parsed_json.get("subtotal") == 0:
                    parsed_json["subtotal"] = round(computed_subtotal, 2)
                if not parsed_json.get("grandTotal") or parsed_json.get("grandTotal") == 0:
                    tax = float(parsed_json.get("gst", 0.0) or 0.0)
                    service = float(parsed_json.get("serviceCharge", 0.0) or 0.0)
                    parsed_json["grandTotal"] = round(
                        parsed_json["subtotal"] + tax + service, 2
                    )

            # Validate against Pydantic model
            return ExtractedReceiptData.model_validate(parsed_json)

        except json.JSONDecodeError as exc:
            logger.error("Failed to decode OpenAI JSON response: %s", str(exc))
            raise ValueError("OpenAI returned an unreadable response format.") from exc

        except AuthenticationError as exc:
            logger.error("OpenAI authentication error: API key invalid or unauthorized.")
            raise ValueError(
                "Invalid OpenAI API Key. Please verify OPENAI_API_KEY in backend/.env."
            ) from exc

        except RateLimitError as exc:
            logger.error("OpenAI quota or rate limit exceeded.")
            raise ValueError(
                "OpenAI rate limit or quota exceeded. Please check your OpenAI account billing."
            ) from exc

        except APIError as exc:
            logger.error("OpenAI API service error: %s", str(exc))
            raise ValueError(
                "OpenAI Vision service temporarily unavailable. Please try again."
            ) from exc


# Service singleton instance
openai_service = OpenAIService()
