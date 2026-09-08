import React from 'react';
import { CreditCard, Check, Crown, AlertCircle } from 'lucide-react';
import { useBill } from '@/context/BillContext';
import { getInitials } from '@/lib/utils';

export const PayerSelectorCard: React.FC = () => {
  const { people, payerId, setPayerId } = useBill();

  const selectedPayer = people.find((p) => p.id === payerId);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#0D766E]" />
          <h3 className="text-sm font-bold text-charcoal-900">Who paid the bill?</h3>
        </div>

        {selectedPayer && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80">
            <Check className="w-3 h-3 stroke-[3]" />
            Payer Selected
          </span>
        )}
      </div>

      <p className="text-xs text-charcoal-500 font-medium">
        Select who settled the receipt with the restaurant so settlement shares and repayments are calculated accurately.
      </p>

      {/* People Selector Dropdown / Selection */}
      {people.length === 0 ? (
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 text-xs text-charcoal-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
          <span>Add at least one dining companion first to designate the payer.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <label htmlFor="payer-select" className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Select Bill Payer
          </label>

          <div className="relative">
            <select
              id="payer-select"
              value={payerId || ''}
              onChange={(e) => setPayerId(e.target.value || null)}
              className="w-full appearance-none px-4 py-3 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-charcoal-200 hover:border-charcoal-300 focus:border-[#0D766E] rounded-2xl text-xs sm:text-sm font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 transition-all cursor-pointer pr-10 shadow-sm"
            >
              <option value="" disabled className="text-charcoal-400">
                -- Choose who paid the bill --
              </option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} {person.isOrganizer ? '(Organizer)' : ''}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-charcoal-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Highlight Selected Payer Card */}
          {selectedPayer ? (
            <div className="p-3 rounded-2xl bg-[#E6F4EA]/60 border border-[#A7F3D0] flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: selectedPayer.avatarColor }}
                >
                  {getInitials(selectedPayer.name)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-charcoal-900">
                      {selectedPayer.name}
                    </span>
                    {selectedPayer.isOrganizer && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0D766E]/10 text-[#0D766E]">
                        <Crown className="w-2.5 h-2.5" />
                        Organizer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    Paid restaurant receipt • Will receive reimbursements
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPayerId(null)}
                className="text-[11px] font-semibold text-charcoal-500 hover:text-charcoal-800 underline cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-amber-700 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Please select who paid the restaurant bill before continuing.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
