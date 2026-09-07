import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExtractedReceiptData {
  restaurantName: string;
  location?: string;
  billNumber?: string;
  items: {
    name: string;
    qty: number;
    price: number;
    isShared?: boolean;
  }[];
  subtotal: number;
  gst?: number;
  gstRate?: number;
  serviceCharge?: number;
  serviceChargeRate?: number;
  grandTotal: number;
}

export async function parseReceiptWithGemini(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ExtractedReceiptData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env file');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert receipt and restaurant bill parser. Analyze this receipt image and extract all itemized dishes/drinks, prices, subtotal, taxes (GST/VAT), service charge, and grand total.

Respond ONLY with valid JSON in this exact structure without markdown or backticks:
{
  "restaurantName": "Name of restaurant or 'Restaurant'",
  "location": "Location if found or 'Bengaluru'",
  "billNumber": "Bill / invoice # or '1'",
  "items": [
    {
      "name": "Dish Name",
      "qty": 1,
      "price": 100.00
    }
  ],
  "subtotal": 100.00,
  "gst": 18.00,
  "gstRate": 18,
  "serviceCharge": 10.00,
  "serviceChargeRate": 10,
  "grandTotal": 128.00
}`;

  const imagePart = {
    inlineData: {
      data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const responseText = result.response.text();
  const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

  return JSON.parse(cleanedText) as ExtractedReceiptData;
}
