import React from 'react';
import { Utensils, MapPin, Calendar, Receipt, CheckCircle2, ArrowLeft, UserCheck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bill, DiningCompanion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SettlementHeaderCardProps {
  bill: Bill;
  payer: DiningCompanion | null;
  organizer: DiningCompanion | null;
  companionCount: number;
}

export const SettlementHeaderCard: React.FC<SettlementHeaderCardProps> = ({
  bill,
  payer,
  organizer,
  companionCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 relative overflow-hidden transition-all duration-300">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-teal-500/5 via-emerald-500/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        {/* Left: Restaurant Info */}
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-teal-50 border border-teal-200/80 text-[#0D766E] flex items-center justify-center shrink-0 shadow-sm">
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
                {bill.restaurantName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Split Ready
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-charcoal-500 font-medium">
              {bill.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                  {bill.address}
                </span>
              )}
              {bill.dateTime && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                  {bill.dateTime}
                </span>
              )}
              {bill.billNumber && (
                <span className="flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-charcoal-400" />
                  {bill.billNumber}
                </span>
              )}
            </div>

            {/* Payer & Organizer pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {payer && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-800">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Bill Paid by: <strong className="font-bold text-amber-900">{payer.name}</strong>
                  </span>
                </div>
              )}

              {organizer && organizer.id !== payer?.id && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Organizer: <strong className="font-bold text-slate-900">{organizer.name}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Totals & Quick Link */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-charcoal-100 pt-4 sm:pt-0 sm:pl-6 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
              Receipt Total
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0D766E] tracking-tight block">
              {formatCurrency(bill.grandTotal)}
            </span>
            <span className="text-xs text-charcoal-500 font-medium">
              {bill.items.length} dishes • {companionCount} diners
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/assign')}
            className="mt-2 text-xs font-bold text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200/80 cursor-pointer hidden sm:inline-flex items-center"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Edit Assignments</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
