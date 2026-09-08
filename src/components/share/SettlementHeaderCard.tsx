import React from 'react';
import {
  Utensils,
  MapPin,
  Calendar,
  Receipt,
  CheckCircle2,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  QrCode,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bill, DiningCompanion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useBill } from '@/context/BillContext';
import { isValidUpiId } from '@/lib/upi';

interface SettlementHeaderCardProps {
  bill: Bill;
  payer: DiningCompanion | null;
  organizer: DiningCompanion | null;
  companionCount: number;
  onOpenUpiModal: () => void;
}

export const SettlementHeaderCard: React.FC<SettlementHeaderCardProps> = ({
  bill,
  payer,
  organizer,
  companionCount,
  onOpenUpiModal,
}) => {
  const navigate = useNavigate();
  const { upiId } = useBill();

  const isUpiConfigured = Boolean(upiId && isValidUpiId(upiId));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 relative overflow-hidden transition-all duration-300">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-teal-500/5 via-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Top Tier: Restaurant Info (Left) and Grand Total (Right) */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* Restaurant Identity */}
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-[#0D766E] flex items-center justify-center shrink-0 shadow-sm">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight truncate">
                  {bill.restaurantName || 'Restaurant Receipt'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0] shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Split Ready
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-[11px] sm:text-xs text-charcoal-500 font-medium">
                {bill.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-charcoal-400 shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{bill.address}</span>
                  </span>
                )}
                {bill.dateTime && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-charcoal-400 shrink-0" />
                    <span>{bill.dateTime}</span>
                  </span>
                )}
                {bill.billNumber && (
                  <span className="flex items-center gap-1">
                    <Receipt className="w-3 h-3 text-charcoal-400 shrink-0" />
                    <span>{bill.billNumber}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grand Total Metric */}
          <div className="text-right shrink-0 pl-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
              Receipt Total
            </span>
            <span className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#0D766E] tracking-tight block whitespace-nowrap">
              {formatCurrency(bill.grandTotal)}
            </span>
            <span className="text-[11px] text-charcoal-500 font-medium block whitespace-nowrap">
              {bill.items.length} dishes • {companionCount} diners
            </span>
          </div>
        </div>

        {/* Bottom Tier: Payer & Dedicated UPI QR Section + Edit Button */}
        <div className="pt-3 border-t border-charcoal-100/90 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {payer && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/90 text-xs font-semibold text-amber-900 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Bill Paid by: <strong className="font-extrabold text-amber-950">{payer.name}</strong>
                </span>
              </div>
            )}

            {/* Interactive UPI Pill & QR Generator */}
            <button
              type="button"
              onClick={onOpenUpiModal}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
                isUpiConfigured
                  ? 'bg-teal-50 hover:bg-teal-100/80 border-teal-200 text-[#0D766E]'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
              }`}
              title={isUpiConfigured ? 'Click to view / share UPI QR code' : 'Click to add UPI ID'}
            >
              <QrCode className="w-3.5 h-3.5 text-[#0D766E] shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs">
                {isUpiConfigured ? `UPI: ${upiId}` : '+ Add UPI ID'}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/80 border border-current text-[9px] sm:text-[10px] uppercase tracking-wide font-extrabold flex items-center gap-1 shrink-0">
                {isUpiConfigured ? (
                  <>
                    <QrCode className="w-2.5 h-2.5" /> Show QR
                  </>
                ) : (
                  <>
                    <Plus className="w-2.5 h-2.5" /> Generate QR
                  </>
                )}
              </span>
            </button>

            {organizer && organizer.id !== payer?.id && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  Organizer: <strong className="font-bold text-slate-900">{organizer.name}</strong>
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/assign')}
            className="text-xs font-bold text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200/80 cursor-pointer inline-flex items-center py-1.5 px-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>Edit Assignments</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
