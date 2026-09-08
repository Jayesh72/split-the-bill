import { ExtractedReceiptData } from '@/types';

/**
 * Backend API Client for Split the Bill FastAPI service.
 * Base URL can be configured via VITE_API_BASE_URL (defaults to http://localhost:8000).
 */
const CONFIGURED_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Health check verification for the FastAPI backend.
 */
export async function checkBackendHealth(): Promise<boolean> {
  const urls = [
    `${CONFIGURED_BASE_URL}/api/health`,
    '/api/health',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = (await res.json()) as ApiResponse<unknown>;
        if (json.success === true) return true;
      }
    } catch {
      // Try next endpoint fallback
    }
  }
  return false;
}

/**
 * Uploads a receipt image to the FastAPI backend OCR extraction endpoint.
 *
 * Architecture:
 * React Frontend -> FastAPI Backend (/api/ocr/extract) -> Google Gemini Vision -> Validated Pydantic Schema -> Frontend
 *
 * @param file The image or PDF receipt file to extract.
 * @returns Validated ExtractedReceiptData object.
 */
export async function extractReceiptFromBackend(file: File): Promise<ExtractedReceiptData> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const endpoints = [
    `${CONFIGURED_BASE_URL}/api/ocr/extract`,
    '/api/ocr/extract',
  ];

  let response: Response | null = null;

  for (const endpoint of endpoints) {
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (response) {
        break;
      }
    } catch {
      // Endpoint unreachable, continue to fallback
    }
  }

  if (!response) {
    throw new Error(
      `Unable to connect to backend at ${CONFIGURED_BASE_URL}. ` +
        'Please ensure the FastAPI backend is running (cd backend && uvicorn app.main:app --reload).'
    );
  }

  let jsonResult: ApiResponse<ExtractedReceiptData> | null = null;
  try {
    jsonResult = (await response.json()) as ApiResponse<ExtractedReceiptData>;
  } catch {
    throw new Error(`Invalid server response from backend OCR endpoint (${response.status}).`);
  }

  if (!response.ok || !jsonResult.success || !jsonResult.data) {
    const errorMsg = jsonResult?.error || jsonResult?.message || `Server error (${response.status})`;
    throw new Error(errorMsg);
  }

  return jsonResult.data;
}

