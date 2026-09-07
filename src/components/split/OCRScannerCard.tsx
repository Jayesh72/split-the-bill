import React from 'react';
import { Check, Loader2, Circle, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OCRScannerCardProps {
  onReplacePhoto: () => void;
  onContinue: () => void;
}

export const OCRScannerCard: React.FC<OCRScannerCardProps> = ({
  onReplacePhoto,
  onContinue,
}) => {
  const ocrStatuses = [
    {
      id: 1,
      label: 'Image uploaded & auto-enhanced',
      timing: '0.4s',
      status: 'done',
    },
    {
      id: 2,
      label: 'Receipt boundary detected',
      timing: '0.8s',
      status: 'done',
    },
    {
      id: 3,
      label: 'Restaurant: "The Olive Table"',
      timing: 'Matched',
      status: 'done',
    },
    {
      id: 4,
      label: 'Extracting dishes & prices (6 items)...',
      timing: 'Running',
      status: 'running',
    },
    {
      id: 5,
      label: 'Proportional tax & service calculation...',
      timing: 'Pending',
      status: 'pending',
    },
  ];

  const detectedItems = [
    { name: '1x Burrata & Heirloom Peaches', amount: '$19.50' },
    { name: '2x Pan Seared Salmon', amount: '$68.00' },
    { name: '2x Rosemary Focaccia', amount: '$14.00' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-charcoal-900">Live OCR Scanner</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
            99.4% Accuracy
          </span>
        </div>

        {/* Scanner Image Preview Area */}
        <div className="relative mt-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-charcoal-200 aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center group">
          {/* Background Mock Receipt Graphic */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 opacity-95"></div>

          {/* Receipt Canvas Simulation */}
          <div className="relative z-10 w-[78%] h-[85%] bg-[#FAF8F5] rounded-lg shadow-2xl p-3 sm:p-4 text-[9px] sm:text-[10px] text-charcoal-800 font-mono flex flex-col justify-between transform -rotate-1 border border-charcoal-300/60">
            {/* Receipt Header */}
            <div className="text-center border-b border-dashed border-charcoal-300 pb-1.5">
              <div className="font-bold text-xs uppercase tracking-wider text-charcoal-900">
                THE OLIVE TABLE
              </div>
              <div className="text-[8px] text-charcoal-500">100ft Rd, Indiranagar • Bill #89241</div>
            </div>

            {/* Receipt Line Items Mock */}
            <div className="flex flex-col gap-1 py-1 text-charcoal-700">
              <div className="flex justify-between">
                <span>1 Butter Chicken</span>
                <span>$24.50</span>
              </div>
              <div className="flex justify-between">
                <span>1 Paneer Tikka</span>
                <span>$18.00</span>
              </div>
              <div className="flex justify-between">
                <span>2 Garlic Naan</span>
                <span>$9.00</span>
              </div>
              <div className="flex justify-between font-semibold text-charcoal-900 pt-0.5 border-t border-dashed border-charcoal-200">
                <span>Subtotal</span>
                <span>$148.50</span>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="text-center text-[7px] text-charcoal-400">
              *** THANK YOU FOR DINING WITH US ***
            </div>
          </div>

          {/* OCR Cyan Overlays */}
          {/* Top Bounding Box */}
          <div className="absolute top-4 left-6 right-6 z-20 px-2.5 py-1 rounded bg-[#0D766E]/20 border border-[#2DD4BF] text-[10px] font-bold text-[#2DD4BF] backdrop-blur-[2px] flex items-center justify-between">
            <span>Restaurant: The Olive Table</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping"></span>
          </div>

          {/* Glowing Laser Scan Bar */}
          <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_12px_#2DD4BF] z-30 animate-pulse"></div>

          {/* Bottom Bounding Box */}
          <div className="absolute bottom-4 left-6 right-6 z-20 px-2.5 py-1 rounded bg-[#0D766E]/20 border border-[#2DD4BF] text-[10px] font-bold text-[#2DD4BF] backdrop-blur-[2px] flex items-center justify-between">
            <span>Subtotal: $148.50 + Tax</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[9px]">
              <Check className="w-2.5 h-2.5" /> Bounded
            </span>
          </div>
        </div>

        {/* OCR Status List */}
        <div className="flex flex-col gap-2 py-3 border-y border-charcoal-100">
          {ocrStatuses.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {item.status === 'done' && (
                  <div className="w-4 h-4 rounded-full bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                {item.status === 'running' && (
                  <Loader2 className="w-4 h-4 text-[#0D766E] animate-spin flex-shrink-0" />
                )}
                {item.status === 'pending' && (
                  <Circle className="w-4 h-4 text-charcoal-300 flex-shrink-0" />
                )}
                <span
                  className={
                    item.status === 'pending'
                      ? 'text-charcoal-400 font-medium'
                      : 'text-charcoal-700 font-medium'
                  }
                >
                  {item.label}
                </span>
              </div>

              <span
                className={
                  item.status === 'done'
                    ? item.timing === 'Matched'
                      ? 'text-[#0D766E] font-bold text-[11px]'
                      : 'text-charcoal-500 font-medium text-[11px]'
                    : item.status === 'running'
                    ? 'text-[#0D766E] font-bold text-[11px]'
                    : 'text-charcoal-400 font-medium text-[11px]'
                }
              >
                {item.timing}
              </span>
            </div>
          ))}
        </div>

        {/* Detected Items Section */}
        <div className="pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">
            <span>Item Detected</span>
            <span>Amount</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {detectedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 border-b border-charcoal-50 last:border-none"
              >
                <span className="font-semibold text-charcoal-800">{item.name}</span>
                <span className="font-bold text-charcoal-900">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OCR Card Bottom Actions */}
      <div className="flex items-center gap-3 pt-5 mt-4 border-t border-charcoal-100">
        <button
          type="button"
          onClick={onReplacePhoto}
          className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-bold text-charcoal-700 shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Replace Photo</span>
        </button>

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          className="flex-1 py-3 bg-[#0D766E] hover:bg-[#0B615A] text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(13,118,110,0.35)] justify-center"
        >
          <span>Continue to Review Bill</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
