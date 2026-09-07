import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBill } from '@/context/BillContext';

export const ReviewActions: React.FC = () => {
  const navigate = useNavigate();
  const { resetToDemoBill } = useBill();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/split')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs sm:text-sm font-bold text-charcoal-700 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-charcoal-500" />
          <span>Back to Upload</span>
        </button>

        <button
          type="button"
          onClick={resetToDemoBill}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 shadow-sm transition-all cursor-pointer"
          title="Reset to sample bill data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/add-people')}
        className="px-7 py-3.5 bg-[#0D766E] hover:bg-[#0B615A] text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(13,118,110,0.35)] justify-center"
      >
        <span>Continue to Add People</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
};
