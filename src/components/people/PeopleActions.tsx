import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBill } from '@/context/BillContext';

interface PeopleActionsProps {
  disabled?: boolean;
}

export const PeopleActions: React.FC<PeopleActionsProps> = ({ disabled }) => {
  const navigate = useNavigate();
  const { people, setPeople, setPayerId } = useBill();

  const handleClearAll = () => {
    setPeople([]);
    setPayerId(null);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs sm:text-sm font-bold text-charcoal-700 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-charcoal-500" />
          <span>Back to Review OCR</span>
        </button>

        {people.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white hover:bg-red-50 border border-charcoal-200 text-xs font-semibold text-charcoal-500 hover:text-red-600 shadow-sm transition-all cursor-pointer"
            title="Clear all dining companions"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/assign')}
        disabled={disabled}
        className="px-7 py-3.5 bg-[#0D766E] hover:bg-[#0B615A] disabled:opacity-50 disabled:pointer-events-none text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(13,118,110,0.35)] justify-center cursor-pointer"
      >
        <span>Continue to Assign Items</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
};
