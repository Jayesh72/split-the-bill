import React from 'react';
import { ArrowLeft, Printer, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface ShareActionsProps {
  onPrintReceipt: () => void;
  onResetNewBill: () => void;
}

export const ShareActions: React.FC<ShareActionsProps> = ({
  onPrintReceipt,
  onResetNewBill,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-6 border-t border-charcoal-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Back to Assign Items */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate('/assign')}
        className="w-full sm:w-auto text-xs font-bold text-charcoal-700 bg-white hover:bg-charcoal-50 border-charcoal-200 shadow-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to Assign Items</span>
      </Button>

      {/* Right Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrintReceipt}
          className="w-full sm:w-auto text-xs font-bold text-charcoal-800 bg-white hover:bg-charcoal-50 border-charcoal-200/90 shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 mr-1.5 text-charcoal-500" />
          <span>Print Receipt</span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={onResetNewBill}
          className="w-full sm:w-auto text-xs font-bold shadow-md shadow-teal-700/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>Start New Bill Split</span>
        </Button>
      </div>
    </div>
  );
};
