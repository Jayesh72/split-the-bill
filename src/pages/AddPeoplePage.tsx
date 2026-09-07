import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Clock } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';

export const AddPeoplePage: React.FC = () => {
  const navigate = useNavigate();
  const { bill } = useBill();

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Progress Stepper showing Step 3 ACTIVE */}
          <BillProgressStepper currentStep={3} />

          {/* Step 3 Placeholder Card */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 text-center my-8">
            <div className="w-16 h-16 rounded-3xl bg-[#E6F4EA] border border-[#A7F3D0] text-[#0D766E] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Users className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80 mb-3">
              <Clock className="w-3.5 h-3.5" /> Step 3 Placeholder
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight mb-2">
              Add Dining Companions
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto mb-6 font-medium">
              Coming next in Step 3: Add group members, set avatar colors, and assign people to split your {bill.items.length} dishes from {bill.restaurantName}.
            </p>

            {/* Current Bill Meta Pill */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/90 max-w-md mx-auto mb-8 text-left text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal-900 block">{bill.restaurantName}</span>
                <span className="text-charcoal-500">{bill.items.length} items verified</span>
              </div>
              <span className="font-extrabold text-[#0D766E] text-base">
                {bill.currency}{bill.grandTotal.toFixed(2)}
              </span>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/review')}
              className="text-xs font-bold text-charcoal-700 bg-white hover:bg-charcoal-50 border-charcoal-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Review OCR</span>
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
