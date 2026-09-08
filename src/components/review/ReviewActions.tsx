import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ReviewActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
      <button
        type="button"
        onClick={() => navigate('/split')}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs sm:text-sm font-bold text-charcoal-700 shadow-sm transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-charcoal-500" />
        <span>Back to Upload</span>
      </button>

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
