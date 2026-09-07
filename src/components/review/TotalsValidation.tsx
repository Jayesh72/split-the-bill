import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const TotalsValidation: React.FC = () => {
  const { bill, isTotalsMatching, totalsDiff, setBill } = useBill();

  const formatCurrency = (val: number) => {
    return `${bill.currency}${Math.abs(val).toFixed(2)}`;
  };

  const handleSyncReceiptTotal = () => {
    setBill((prev) => ({
      ...prev,
      receiptTotal: prev.grandTotal,
    }));
  };

  if (isTotalsMatching) {
    return (
      <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-3xl p-4 sm:p-5 shadow-sm flex items-start gap-3.5 transition-all">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-sm sm:text-base font-bold text-emerald-950">
              Totals match!
            </h4>
            <span className="text-xs font-bold text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {formatCurrency(bill.grandTotal)}
            </span>
          </div>
          <p className="text-xs text-emerald-800 font-medium mt-0.5">
            The extracted items match the receipt total. You're ready to add dining companions and split.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-3xl p-4 sm:p-5 shadow-sm flex items-start gap-3.5 transition-all">
      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm sm:text-base font-bold text-amber-950">
            Totals don't match
          </h4>
          <span className="text-xs font-bold text-amber-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            Diff: {totalsDiff > 0 ? '+' : '-'}{formatCurrency(totalsDiff)}
          </span>
        </div>
        <p className="text-xs text-amber-900 font-medium mt-1">
          Calculated total ({formatCurrency(bill.grandTotal)}) differs from original receipt total ({formatCurrency(bill.receiptTotal)}). Please verify items, quantities, or taxes.
        </p>
        <div className="mt-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSyncReceiptTotal}
            className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline cursor-pointer"
          >
            Update receipt target to {formatCurrency(bill.grandTotal)}
          </button>
        </div>
      </div>
    </div>
  );
};
