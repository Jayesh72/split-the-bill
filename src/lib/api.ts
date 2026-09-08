import { ExtractedReceiptData } from '@/types';

/**
 * Backend API Client for Split the Bill FastAPI service.
 * Base URL can be configured via VITE_API_BASE_URL (defaults to http://localhost:8000).
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

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
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return false;
    const json = (await res.json()) as ApiResponse<unknown>;
    return json.success === true;
  } catch {
    return false;
  }
}

/**
 * Uploads a receipt image to the FastAPI backend OCR extraction endpoint.
 *
 * Architecture:
 * React Frontend -> FastAPI Backend (/api/ocr/extract) -> OpenAI Vision API -> Validated Pydantic Schema -> Frontend
 *
 * @param file The image or PDF receipt file to extract.
 * @returns Validated ExtractedReceiptData object.
 */
export async function extractReceiptFromBackend(file: File): Promise<ExtractedReceiptData> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/ocr/extract`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(
      `Unable to connect to backend at ${API_BASE_URL}. ` +
        'Please ensure the FastAPI backend is running (cd backend && uvicorn app.main:app --reload).'
    );
  }

  let jsonResult: ApiResponse<ExtractedReceiptData>;
  try {
    jsonResult = (await response.json()) as ApiResponse<ExtractedReceiptData>;
  } catch {
    throw new Error(`Invalid server response from ${API_BASE_URL}/api/ocr/extract.`);
  }

  if (!response.ok || !jsonResult.success || !jsonResult.data) {
    const errorMsg = jsonResult.error || jsonResult.message || `Server error (${response.status})`;
    throw new Error(errorMsg);
  }

  return jsonResult.data;
}
