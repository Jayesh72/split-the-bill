import React from 'react';
import { Calculator, Info } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const BillSummary: React.FC = () => {
  const { bill } = useBill();

  const formatCurrency = (val: number) => {
    return `${bill.currency}${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
        <Calculator className="w-4 h-4 text-[#0D766E]" />
        <h3 className="text-sm font-bold text-charcoal-900">Bill Summary</h3>
      </div>

      {/* Summary Rows */}
      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between text-charcoal-600">
          <span className="font-medium">Items Subtotal</span>
          <span className="font-bold text-charcoal-900">{formatCurrency(bill.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-charcoal-600">
          <span className="inline-flex items-center gap-1 font-medium">
            Tax ({bill.taxRate}%)
            <Info className="w-3 h-3 text-charcoal-400" />
          </span>
          <span className="font-bold text-charcoal-900">{formatCurrency(bill.tax)}</span>
        </div>

        <div className="flex items-center justify-between text-charcoal-600">
          <span className="inline-flex items-center gap-1 font-medium">
            Service Charge ({bill.serviceChargeRate}%)
            <Info className="w-3 h-3 text-charcoal-400" />
          </span>
          <span className="font-bold text-charcoal-900">{formatCurrency(bill.serviceCharge)}</span>
        </div>

        <div className="flex items-center justify-between text-charcoal-600 pt-2 border-t border-charcoal-100">
          <span className="font-medium text-charcoal-500">Total (from receipt)</span>
          <span className="font-semibold text-charcoal-700">{formatCurrency(bill.receiptTotal)}</span>
        </div>
      </div>

      {/* Calculated Grand Total Highlight Box */}
      <div className="mt-2 p-4 rounded-2xl bg-[#E6F4EA]/60 border border-[#A7F3D0] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#0D766E] block">
            Calculated Grand Total
          </span>
          <span className="text-xs text-charcoal-600 font-medium">
            Subtotal + Tax + Service
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-black text-[#0D766E] tracking-tight">
          {formatCurrency(bill.grandTotal)}
        </span>
      </div>
    </div>
  );
};
