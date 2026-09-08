import React from 'react';
import { Users, Utensils, Receipt, Sparkles, CheckCircle2 } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const GroupSummaryCard: React.FC = () => {
  const { bill, people } = useBill();

  const personText = people.length === 1 ? '1 Person' : `${people.length} People`;
  const dishText = bill.items.length === 1 ? '1 Dish' : `${bill.items.length} Dishes`;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
        <Sparkles className="w-4 h-4 text-[#0D766E]" />
        <h3 className="text-sm font-bold text-charcoal-900">Group Split Overview</h3>
      </div>

      {/* 3 Metric Pills Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Bill Total Metric */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-charcoal-500 mb-1">
            <Receipt className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total</span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-[#0D766E] truncate">
            {bill.currency}{bill.grandTotal.toFixed(2)}
          </span>
        </div>

        {/* Diners Count Metric */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-charcoal-500 mb-1">
            <Users className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Diners</span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-charcoal-900 truncate">
            {personText}
          </span>
        </div>

        {/* Dishes Ready Metric */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-charcoal-500 mb-1">
            <Utensils className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Dishes</span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-charcoal-900 truncate">
            {dishText}
          </span>
        </div>
      </div>

      {/* Context info banner */}
      <div className="p-3.5 rounded-2xl bg-[#E6F4EA]/60 border border-[#A7F3D0] flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#0D766E] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
          In the next step, you can tap on these {people.length} companions to claim individual or shared dishes.
        </p>
      </div>
    </div>
  );
};
