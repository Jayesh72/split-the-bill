/**
 * Frontend OCR Bridge
 * All AI receipt OCR operations are routed through the secure Python FastAPI backend.
 * Direct browser AI SDK calls are disabled for security (API keys remain strictly server-side).
 */

export { extractReceiptFromBackend, checkBackendHealth } from './api';
export type { ExtractedReceiptData, ExtractedReceiptItem } from '@/types';
