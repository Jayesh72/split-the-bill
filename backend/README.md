# Split the Bill — Python FastAPI Backend

This directory contains the production-ready Python backend for **Split the Bill**. It provides secure multimodal receipt OCR processing powered by the **Google Gemini API** (and optional OpenAI Vision), Pydantic data contract validation, rate limiting, and health monitoring.

---

## Architecture Overview

```text
React Frontend (Vite)
      ↓ (Multipart POST /api/ocr/extract)
FastAPI Backend (Uvicorn)
      ↓ (CORS & Rate Limiter Middleware)
Google Gemini Vision API (gemini-2.5-flash)
      ↓ (Structured JSON Parsing)
Pydantic Data Validation
      ↓ (ExtractedReceiptData Envelope)
React Frontend State (BillContext)
```

---

## Tech Stack

* **Runtime**: Python 3.11+
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
* **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
* **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/) & Pydantic Settings
* **AI Engine**: [Google Generative AI SDK](https://github.com/google/generative-ai-python) (Google Gemini 2.5 Flash / 1.5 Flash Vision) & OpenAI Python SDK
* **File Processing**: Python Multipart (`python-multipart`)
* **Testing**: Pytest & HTTPX

---

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py            # Application package metadata
│   ├── main.py                # FastAPI app initialization, CORS, exception handlers
│   ├── config.py              # Centralized Pydantic settings & env management
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── ocr.py             # Pydantic models (ExtractedReceiptData, OCRResponse)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py  # Google Gemini Vision OCR extraction service (Primary)
│   │   └── openai_service.py  # Async OpenAI Vision OCR service (Alternative)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py          # GET /api/health
│   │   └── ocr.py             # POST /api/ocr/extract
│   └── middleware/
│       ├── __init__.py
│       └── rate_limiter.py    # Sliding-window IP rate limiter
├── tests/
│   ├── __init__.py
│   ├── test_health.py         # Health check tests
│   ├── test_schemas.py        # Pydantic schema validation tests
│   └── test_ocr_route.py      # OCR extraction route tests
├── requirements.txt           # Python package dependencies
├── .env.example               # Environment variables template
├── .gitignore                 # Python and environment ignore rules
└── README.md                  # This documentation file
```

---

## Setup & Local Development

### 1. Create and Activate a Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and provide your Google Gemini API Key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
HOST=0.0.0.0
PORT=8000
GEMINI_MODEL=gemini-2.5-flash
```

> **Security Guarantee**: The `GEMINI_API_KEY` is stored **exclusively** on the Python backend and is never exposed to the frontend, browser, or Git repository.

### 4. Start the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at:
* API Root: [http://localhost:8000/](http://localhost:8000/)
* Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* Alternative ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Description**: Returns operational status of the backend without exposing secrets.
* **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Backend is running",
    "version": "0.1.0"
  }
  ```

### 2. Extract Receipt OCR
* **Endpoint**: `POST /api/ocr/extract`
* **Content-Type**: `multipart/form-data`
* **Parameters**: `file` (Binary image file: PNG, JPEG, WebP, HEIC, PDF $\le$ 10MB)
* **Sample Response**:
  ```json
  {
    "success": true,
    "data": {
      "restaurantName": "The Olive Table",
      "location": "100ft Road, Indiranagar, Bengaluru",
      "billNumber": "#IND-89241",
      "currency": "₹",
      "items": [
        {
          "name": "Butter Chicken",
          "qty": 1,
          "price": 420.0,
          "isShared": false
        },
        {
          "name": "Garlic Naan",
          "qty": 2,
          "price": 180.0,
          "isShared": false
        }
      ],
      "subtotal": 600.0,
      "gst": 108.0,
      "gstRate": 18.0,
      "serviceCharge": 60.0,
      "serviceChargeRate": 10.0,
      "grandTotal": 768.0
    },
    "message": "Receipt items extracted and validated successfully."
  }
  ```

---

## Running Tests

```bash
pytest
```
