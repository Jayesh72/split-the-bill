import React, { useState } from 'react';
import { Users, Check, X, UserCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { BillItem } from '@/types';
import { useBill } from '@/context/BillContext';
import { getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ItemAssignmentCardProps {
  item: BillItem;
  itemIndex: number;
}

export const ItemAssignmentCard: React.FC<ItemAssignmentCardProps> = ({
  item,
  itemIndex,
}) => {
  const { bill, people, assignments, assignItem, togglePersonOnItem, clearItemAssignment } = useBill();
  const [isExpanded, setIsExpanded] = useState(false);

  const assignedPersonIds = assignments[item.id] || [];
  const assignedPeople = people.filter((p) => assignedPersonIds.includes(p.id));
  const isAssigned = assignedPeople.length > 0;
  const isShared = assignedPeople.length > 1;

  const costPerPerson = isAssigned
    ? Math.round((item.totalPrice / assignedPeople.length) * 100) / 100
    : item.totalPrice;

  const handleSelectAll = () => {
    assignItem(
      item.id,
      people.map((p) => p.id)
    );
  };

  const handleClear = () => {
    clearItemAssignment(item.id);
  };

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
        isAssigned
          ? 'bg-white border-charcoal-200/90 shadow-[0_4px_16px_0_rgba(15,23,42,0.04)] hover:shadow-soft hover:border-brand-200'
          : 'bg-[#FCFDFF] border-dashed border-charcoal-300 shadow-sm'
      }`}
    >
      {/* Main Item Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Index, Name & Details */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
              isAssigned
                ? 'bg-[#E6F4EA] text-[#0D766E]'
                : 'bg-charcoal-100 text-charcoal-500'
            }`}
          >
            {itemIndex + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-charcoal-900 truncate">
                {item.name}
              </h4>

              {/* Status Badges */}
              {!isAssigned ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-charcoal-100 text-charcoal-500 border border-charcoal-200">
                  Unassigned
                </span>
              ) : isShared ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80">
                  <Users className="w-3 h-3 text-[#0D766E]" />
                  Shared ({assignedPeople.length})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-900 border border-brand-200">
                  <UserCheck className="w-3 h-3 text-brand" />
                  Solo
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-500 font-medium mt-0.5">
              {item.qty > 1 ? `${item.qty} × ` : ''}
              {bill.currency}
              {item.unitPrice.toFixed(2)}
              {isShared && (
                <span className="text-emerald-700 font-bold ml-1.5">
                  • {bill.currency}
                  {costPerPerson.toFixed(2)} each
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Assigned Avatars Preview */}
        {isAssigned && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {assignedPeople.map((person) => (
                <div
                  key={person.id}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: person.avatarColor }}
                  title={`${person.name} (${bill.currency}${costPerPerson.toFixed(2)})`}
                >
                  {getInitials(person.name)}
                </div>
              ))}
            </div>

            {!isShared && assignedPeople[0] && (
              <span className="text-xs font-bold text-charcoal-800 hidden md:inline">
                {assignedPeople[0].name}
              </span>
            )}
          </div>
        )}

        {/* Right: Total Price & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-100 flex-shrink-0">
          <span className="text-sm sm:text-base font-black text-charcoal-900 tracking-tight">
            {bill.currency}
            {item.totalPrice.toFixed(2)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAssigned
                  ? 'bg-white hover:bg-charcoal-50 border border-charcoal-200 text-charcoal-700 shadow-sm'
                  : 'bg-[#0D766E] hover:bg-[#0B615A] text-white shadow-[0_2px_8px_rgba(13,118,110,0.25)]'
              }`}
            >
              <span>{isAssigned ? 'Change' : 'Assign'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isAssigned && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Clear item assignment"
                aria-label="Clear assignment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Interactive Assignment Panel */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-5 pt-3 bg-[#F8FAFC] border-t border-charcoal-200/80 animate-fadeIn flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Who had {item.name}?
            </span>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-bold text-[#0D766E] hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-charcoal-300">•</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-charcoal-500 hover:text-charcoal-800 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Companions Selectable Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {people.map((person) => {
              const isSelected = assignedPersonIds.includes(person.id);
              return (
                <div
                  key={person.id}
                  onClick={() => togglePersonOnItem(item.id, person.id)}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-white border-[#0D766E] shadow-sm ring-1 ring-[#0D766E]/20'
                      : 'bg-white/60 hover:bg-white border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: person.avatarColor }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <span className="text-xs font-bold text-charcoal-900 truncate">
                      {person.name}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#0D766E] border-[#0D766E] text-white'
                        : 'border-charcoal-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share Calculation Live Banner & Done Action */}
          <div className="flex items-center justify-between pt-2 border-t border-charcoal-200/60 flex-wrap gap-2 text-xs">
            <div>
              {assignedPeople.length > 0 ? (
                <span className="text-emerald-950 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D766E]" />
                  {bill.currency}
                  {costPerPerson.toFixed(2)} each (split across{' '}
                  {assignedPeople.length}{' '}
                  {assignedPeople.length === 1 ? 'diner' : 'diners'})
                </span>
              ) : (
                <span className="text-charcoal-400 font-medium">
                  Tap companions above to assign this dish
                </span>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="bg-[#0D766E] hover:bg-[#0B615A] text-xs font-bold px-4 cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
