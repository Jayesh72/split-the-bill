import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Check, ArrowRight, Users } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const AssignHeaderCard: React.FC = () => {
  const navigate = useNavigate();
  const { bill, people } = useBill();

  const personCountText =
    people.length === 1 ? '1 companion' : `${people.length} companions`;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Restaurant & Context */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] shadow-sm flex-shrink-0">
          <Store className="w-6 h-6 text-[#0D766E]" />
        </div>

        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight">
              {bill.restaurantName}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
              <Check className="w-3 h-3 text-[#0D766E]" strokeWidth={2.5} />
              {bill.items.length} dishes ready
            </span>
          </div>

          <p className="text-xs text-charcoal-500 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
            <span>{personCountText} joined</span>
            {bill.billNumber && <span>• {bill.billNumber}</span>}
          </p>
        </div>
      </div>

      {/* Right: Bill Total & Edit Group Action */}
      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-charcoal-100">
        <div className="text-left md:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">
            Bill Total
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-[#0D766E] tracking-tight">
            {bill.currency}{bill.grandTotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/add-people')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-bold text-charcoal-700 shadow-sm transition-all cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Edit Group</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-charcoal-400" />
        </button>
      </div>
    </div>
  );
};
