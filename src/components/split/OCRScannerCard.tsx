import React, { useState, useEffect } from 'react';
import { Check, Loader2, RotateCcw, ArrowRight, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { extractReceiptFromBackend } from '@/lib/api';
import { ExtractedReceiptData } from '@/types';
import { useBill } from '@/context/BillContext';

interface OCRScannerCardProps {
  files: File[];
  onReplacePhoto: () => void;
  onContinue: () => void;
}

export const OCRScannerCard: React.FC<OCRScannerCardProps> = ({
  files,
  onReplacePhoto,
  onContinue,
}) => {
  const { setBillFromOCR } = useBill();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When files change, process the primary uploaded receipt image
  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrl(null);
      setExtractedData(null);
      setIsScanning(false);
      setScanStep(0);
      setErrorMessage(null);
      return;
    }

    const primaryFile = files[0];
    const objectUrl = URL.createObjectURL(primaryFile);
    setPreviewUrl(objectUrl);
    setErrorMessage(null);
    setIsScanning(true);
    setScanStep(1);

    const runExtraction = async () => {
      try {
        // Step progression simulation while backend processes
        const t1 = setTimeout(() => setScanStep(2), 500);
        const t2 = setTimeout(() => setScanStep(3), 1200);

        const result = await extractReceiptFromBackend(primaryFile);

        clearTimeout(t1);
        clearTimeout(t2);

        setExtractedData(result);
        setBillFromOCR(result, objectUrl);
        setScanStep(4);
        setIsScanning(false);
      } catch (err: unknown) {
        setIsScanning(false);
        setScanStep(0);
        const errObj = err as { message?: string };
        setErrorMessage(
          errObj.message || 'Failed to extract receipt data from backend. Please verify FastAPI backend is running.'
        );
      }
    };

    runExtraction();

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [files, setBillFromOCR]);

  const currencySymbol = extractedData?.currency || '₹';

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col justify-between min-h-[460px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isScanning ? 'bg-amber-500 animate-ping' : files.length > 0 ? 'bg-emerald-500' : 'bg-charcoal-300'
              }`}
            ></span>
            <span className="text-sm font-bold text-charcoal-900">Live OCR Scanner</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
            {isScanning ? 'Processing...' : extractedData ? '100% Extracted' : 'Ready'}
          </span>
        </div>

        {/* Scanner Image Preview Area */}
        <div className="relative mt-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-charcoal-200 aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
          {previewUrl ? (
            <>
              {/* Actual Uploaded Image */}
              <img
                src={previewUrl}
                alt="Uploaded Receipt"
                className="w-full h-full object-contain p-2"
              />

              {/* Laser Scan Animation Overlay */}
              {isScanning && (
                <>
                  <div className="absolute inset-0 bg-[#0D766E]/10 backdrop-blur-[1px]"></div>
                  <div className="absolute inset-x-0 top-1/2 h-[3px] bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_15px_#2DD4BF] z-30 animate-pulse"></div>
                  <div className="absolute top-3 left-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-[#2DD4BF] text-[11px] font-bold text-[#2DD4BF] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2DD4BF]" />
                      Extracting dishes & prices with FastAPI & Gemini Vision...
                    </span>
                  </div>
                </>
              )}

              {/* Extracted Bounding Box Tag */}
              {extractedData && !isScanning && (
                <div className="absolute top-3 left-4 right-4 z-20 px-3 py-1 rounded-xl bg-slate-900/80 border border-emerald-400 text-[11px] font-bold text-emerald-400 backdrop-blur-[2px] flex items-center justify-between">
                  <span>{extractedData.restaurantName || 'Receipt Extracted'}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" /> Verified
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Empty State Placeholder */
            <div className="flex flex-col items-center justify-center text-center p-6 text-charcoal-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-300 mb-1">
                No receipt uploaded yet
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Upload or drop a receipt on the left to start live FastAPI OCR extraction.
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium my-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">OCR Extraction Error</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* OCR Status List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 py-3 border-y border-charcoal-100">
            {/* Step 1: Upload */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-charcoal-700 font-medium">Image uploaded & enhanced</span>
              </div>
              <span className="text-charcoal-500 font-medium text-[11px]">Ready</span>
            </div>

            {/* Step 2: Extraction */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {scanStep >= 3 ? (
                  <div className="w-4 h-4 rounded-full bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isScanning ? (
                  <Loader2 className="w-4 h-4 text-[#0D766E] animate-spin flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-charcoal-300 flex-shrink-0" />
                )}
                <span className="text-charcoal-700 font-medium">
                  {extractedData?.restaurantName
                    ? `Restaurant: "${extractedData.restaurantName}"`
                    : 'Extracting dishes & prices...'}
                </span>
              </div>
              <span className="text-[#0D766E] font-bold text-[11px]">
                {scanStep >= 3 ? 'Matched' : isScanning ? 'Running' : 'Pending'}
              </span>
            </div>

            {/* Step 3: Tax Calculation */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {extractedData ? (
                  <div className="w-4 h-4 rounded-full bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-charcoal-300 flex-shrink-0" />
                )}
                <span className="text-charcoal-700 font-medium">
                  Taxes & calculations ({currencySymbol}{extractedData?.grandTotal?.toFixed(2) || '0.00'})
                </span>
              </div>
              <span className="text-[#0D766E] font-bold text-[11px]">
                {extractedData ? 'Done' : 'Pending'}
              </span>
            </div>
          </div>
        )}

        {/* Real Extracted Items Section */}
        {extractedData && extractedData.items.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">
              <span>Item Detected ({extractedData.items.length})</span>
              <span>Amount</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {extractedData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-charcoal-50 last:border-none"
                >
                  <span className="font-semibold text-charcoal-800">
                    {item.qty > 1 ? `${item.qty}x ` : ''}
                    {item.name}
                  </span>
                  <span className="font-bold text-charcoal-900">
                    {currencySymbol}{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal & Grand Total Summary */}
            <div className="mt-3 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-700">Grand Total</span>
              <span className="font-extrabold text-sm text-[#0D766E]">
                {currencySymbol}{extractedData.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Fallback when no files are uploaded */}
        {files.length === 0 && (
          <div className="py-6 text-center text-charcoal-400 text-xs">
            <Sparkles className="w-5 h-5 text-brand mx-auto mb-2 opacity-60" />
            <span>Upload an image to see real-time AI dish & price extraction</span>
          </div>
        )}
      </div>

      {/* OCR Card Bottom Actions */}
      {files.length > 0 && (
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-charcoal-100">
          <button
            type="button"
            onClick={onReplacePhoto}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-bold text-charcoal-700 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Replace Photo</span>
          </button>

          <Button
            variant="primary"
            size="md"
            onClick={onContinue}
            disabled={isScanning || !extractedData}
            className="flex-1 py-3 bg-[#0D766E] hover:bg-[#0B615A] text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(13,118,110,0.35)] justify-center"
          >
            <span>Continue to Review Bill</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
