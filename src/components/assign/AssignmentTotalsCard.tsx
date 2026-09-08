import React from 'react';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const AssignmentTotalsCard: React.FC = () => {
  const { bill, assignedAmount, unassignedAmount, isAllItemsAssigned, unassignedItemsCount } = useBill();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
        <Calculator className="w-4 h-4 text-[#0D766E]" />
        <h3 className="text-sm font-bold text-charcoal-900">Assignment Balance</h3>
      </div>

      {/* Metric Breakdown Rows */}
      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between text-charcoal-600">
          <span className="font-medium">Bill Total</span>
          <span className="font-extrabold text-charcoal-900">
            {bill.currency}
            {bill.grandTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-charcoal-600">
          <span className="font-medium">Assigned Items Value</span>
          <span className="font-bold text-emerald-700">
            {bill.currency}
            {assignedAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-charcoal-600">
          <span className="font-medium">Unassigned Items Value</span>
          <span className={`font-bold ${unassignedAmount > 0 ? 'text-amber-700' : 'text-charcoal-400'}`}>
            {bill.currency}
            {unassignedAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {isAllItemsAssigned ? (
        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-emerald-950 block">
              All items assigned!
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              Every dish has been claimed. You can now proceed to review and share the final split.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-950 block">
              {unassignedItemsCount} {unassignedItemsCount === 1 ? 'dish needs' : 'dishes need'} an owner
            </span>
            <span className="text-[11px] text-amber-800 font-medium">
              Assign all dishes to enable continuing to the final share step.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
