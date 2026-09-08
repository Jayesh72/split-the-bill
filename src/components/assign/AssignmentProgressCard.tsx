import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useBill } from '@/context/BillContext';

interface AssignmentProgressCardProps {
  filter: 'all' | 'unassigned' | 'assigned';
  onFilterChange: (filter: 'all' | 'unassigned' | 'assigned') => void;
}

export const AssignmentProgressCard: React.FC<AssignmentProgressCardProps> = ({
  filter,
  onFilterChange,
}) => {
  const { bill, assignedItemsCount, unassignedItemsCount, isAllItemsAssigned } = useBill();

  const totalItems = bill.items.length;
  const percentage = totalItems > 0 ? Math.round((assignedItemsCount / totalItems) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Header & Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAllItemsAssigned ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#0D766E]" />
          )}
          <h3 className="text-sm sm:text-base font-bold text-charcoal-900">
            Assignment Progress
          </h3>
        </div>

        <span className="text-xs sm:text-sm font-extrabold text-[#0D766E]">
          {assignedItemsCount} of {totalItems} dishes ({percentage}%)
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0D766E] to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#0D766E] text-white shadow-sm'
              : 'bg-[#F8FAFC] text-charcoal-600 hover:bg-charcoal-100'
          }`}
        >
          All ({totalItems})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('unassigned')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unassigned'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-[#F8FAFC] text-charcoal-600 hover:bg-charcoal-100'
          }`}
        >
          Unassigned ({unassignedItemsCount})
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('assigned')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'assigned'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[#F8FAFC] text-charcoal-600 hover:bg-charcoal-100'
          }`}
        >
          Assigned ({assignedItemsCount})
        </button>
      </div>
    </div>
  );
};
