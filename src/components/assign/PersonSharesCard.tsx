import React from 'react';
import { Users, Crown, CreditCard, Sparkles } from 'lucide-react';
import { useBill } from '@/context/BillContext';
import { getInitials } from '@/lib/utils';

export const PersonSharesCard: React.FC = () => {
  const { bill, personShares, payerId } = useBill();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0D766E]" />
          <h3 className="text-sm font-bold text-charcoal-900">Diners Breakdown</h3>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80">
          {personShares.length} {personShares.length === 1 ? 'diner' : 'diners'}
        </span>
      </div>

      {/* Person Share Rows */}
      <div className="flex flex-col gap-2.5">
        {personShares.map(({ person, itemsCount, subtotal, totalShare }) => {
          const isPayer = person.id === payerId;

          return (
            <div
              key={person.id}
              className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 hover:border-brand-200 transition-all flex items-center justify-between gap-3"
            >
              {/* Left: Avatar & Badges */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: person.avatarColor }}
                >
                  {getInitials(person.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-charcoal-900 truncate">
                      {person.name}
                    </span>

                    {person.isOrganizer && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0D766E]/10 text-[#0D766E]">
                        <Crown className="w-2.5 h-2.5" />
                        Organizer
                      </span>
                    )}

                    {isPayer && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                        <CreditCard className="w-2.5 h-2.5" />
                        Payer
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-charcoal-500 font-medium block">
                    {itemsCount} {itemsCount === 1 ? 'dish' : 'dishes'} claimed
                  </span>
                </div>
              </div>

              {/* Right: Subtotal & Total Share */}
              <div className="text-right flex-shrink-0">
                <span className="text-xs sm:text-sm font-black text-charcoal-900 block">
                  {bill.currency}
                  {totalShare.toFixed(2)}
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">
                  Sub: {bill.currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {personShares.length === 0 && (
          <div className="py-6 text-center text-charcoal-400 text-xs">
            No dining companions added yet.
          </div>
        )}
      </div>

      {/* Tax info hint */}
      <div className="pt-2 border-t border-charcoal-100 flex items-center gap-1.5 text-[11px] text-charcoal-500">
        <Sparkles className="w-3.5 h-3.5 text-[#0D766E] flex-shrink-0" />
        <span>Taxes and service charges are divided proportionally based on item shares.</span>
      </div>
    </div>
  );
};
