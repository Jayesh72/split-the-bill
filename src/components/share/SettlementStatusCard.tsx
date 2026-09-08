import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, CheckCheck, RefreshCw, Wallet, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SettlementStatusCardProps {
  grandTotal: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  paidMembersCount: number;
  totalMembersCount: number;
  isAllMembersPaid: boolean;
  onToggleAllPaid: () => void;
}

export const SettlementStatusCard: React.FC<SettlementStatusCardProps> = ({
  grandTotal,
  totalPaidAmount,
  totalPendingAmount,
  paidMembersCount,
  totalMembersCount,
  isAllMembersPaid,
  onToggleAllPaid,
}) => {
  const percentage = totalMembersCount > 0
    ? Math.round((paidMembersCount / totalMembersCount) * 100)
    : 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 transition-all duration-300">
      {/* Header & Verification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-charcoal-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-900">
              Settlement Status
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5 font-medium">
            Sum of all individual shares matches bill total ({formatCurrency(grandTotal)})
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAllPaid}
          className="text-xs font-bold text-charcoal-700 hover:text-charcoal-900 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200/90 cursor-pointer self-start sm:self-auto"
        >
          {isAllMembersPaid ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-charcoal-500" />
              <span>Reset to Pending</span>
            </>
          ) : (
            <>
              <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              <span>Mark All as Paid</span>
            </>
          )}
        </Button>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        {/* Total Bill */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/70">
          <div className="flex items-center justify-between text-charcoal-500 text-xs font-semibold mb-1">
            <span>Bill Total</span>
            <Wallet className="w-3.5 h-3.5 text-charcoal-400" />
          </div>
          <span className="text-xl font-extrabold text-charcoal-900 tracking-tight block">
            {formatCurrency(grandTotal)}
          </span>
          <span className="text-[11px] text-charcoal-400 font-medium mt-0.5 block">
            100% accounted for
          </span>
        </div>

        {/* Paid / Collected */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1">
            <span>Marked Paid</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold text-emerald-700 tracking-tight block">
            {formatCurrency(totalPaidAmount)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {paidMembersCount} of {totalMembersCount} diners settled
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1">
            <span>Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-xl font-extrabold text-amber-700 tracking-tight block">
            {formatCurrency(totalPendingAmount)}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            {totalMembersCount - paidMembersCount} remaining to pay
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-charcoal-700">Settlement Progress</span>
          <span className="text-charcoal-900 font-bold">{percentage}% Complete</span>
        </div>
        <div className="w-full h-3 rounded-full bg-charcoal-100 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Completion Banner */}
      {isAllMembersPaid && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 animate-fadeIn">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold block">
              All settled! Every dining companion is marked as paid.
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Total of {formatCurrency(totalPaidAmount)} fully accounted for.
            </span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-charcoal-100/80 flex items-center gap-1.5 text-[11px] text-charcoal-400 font-medium">
        <AlertCircle className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span>
          Non-custodial split. Payment tracking is managed locally by the organizer.
        </span>
      </div>
    </div>
  );
};
