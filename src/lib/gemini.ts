import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExtractedReceiptItem {
  name: string;
  qty: number;
  price: number;
  isShared?: boolean;
}

export interface ExtractedReceiptData {
  restaurantName: string;
  location?: string;
  billNumber?: string;
  currency?: string;
  items: ExtractedReceiptItem[];
  subtotal: number;
  gst?: number;
  gstRate?: number;
  serviceCharge?: number;
  serviceChargeRate?: number;
  grandTotal: number;
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function parseReceiptWithGemini(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ExtractedReceiptData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Please provide your VITE_GEMINI_API_KEY in the .env file to extract receipt items.');
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());

  const prompt = `You are an expert receipt and restaurant bill parser. Analyze this receipt image and extract all itemized dishes/drinks, quantities, individual/line prices, currency symbol, subtotal, taxes (such as GST, VAT, sales tax), service charge or tip, and grand total.

Respond ONLY with a valid JSON object in this exact format with no backticks, no markdown, and no extra text:
{
  "restaurantName": "Name of restaurant or 'Restaurant'",
  "location": "Location / address if available or ''",
  "billNumber": "Bill or invoice number if found or ''",
  "currency": "₹ or $ or € or appropriate currency symbol",
  "items": [
    {
      "name": "Exact dish or drink name",
      "qty": 1,
      "price": 240.00
    }
  ],
  "subtotal": 240.00,
  "gst": 43.20,
  "gstRate": 18,
  "serviceCharge": 24.00,
  "serviceChargeRate": 10,
  "grandTotal": 307.20
}`;

  const cleanBase64 = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  const imagePart = {
    inlineData: {
      data: cleanBase64,
      mimeType: mimeType || 'image/jpeg',
    },
  };

  // Try candidate models sequentially until one succeeds
  let lastError: unknown = null;
  let responseText: string | null = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([prompt, imagePart]);
      responseText = result.response.text();
      if (responseText) {
        break; // Success!
      }
    } catch (err: unknown) {
      lastError = err;
      // Continue to next candidate model
      continue;
    }
  }

  if (!responseText) {
    const errObj = lastError as { message?: string };
    throw new Error(
      errObj?.message || 'Unable to process receipt with available Gemini models. Please check your API key.'
    );
  }

  // Extract JSON object safely
  let jsonString = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(jsonString) as ExtractedReceiptData;

  // Sanitize numbers
  if (!parsed.items || !Array.isArray(parsed.items)) {
    parsed.items = [];
  }

  parsed.items = parsed.items.map((item) => ({
    name: String(item.name || 'Item'),
    qty: Number(item.qty) || 1,
    price: Number(item.price) || 0,
  }));

  parsed.subtotal = Number(parsed.subtotal) || parsed.items.reduce((acc, it) => acc + it.price, 0);
  parsed.grandTotal = Number(parsed.grandTotal) || parsed.subtotal;

  return parsed;
}
