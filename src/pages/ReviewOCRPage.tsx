import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, FileQuestion, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { ReceiptInfoCard } from '@/components/review/ReceiptInfoCard';
import { BillSummary } from '@/components/review/BillSummary';
import { ExtractedItemsTable } from '@/components/review/ExtractedItemsTable';
import { TotalsValidation } from '@/components/review/TotalsValidation';
import { ReviewActions } from '@/components/review/ReviewActions';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';

export const ReviewOCRPage: React.FC = () => {
  const navigate = useNavigate();
  const { bill } = useBill();

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Reusable Dynamic Multi-Step Progress Stepper */}
          <BillProgressStepper currentStep={2} />

          {/* Page Heading Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                Review extracted items
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-600 font-medium mt-1">
                We've extracted the following items from your receipt. Please review and make any corrections.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/split')}
              className="w-fit text-xs font-bold text-charcoal-700 bg-white hover:bg-charcoal-50 border-charcoal-200 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5 text-charcoal-500" />
              <span>Edit Receipt</span>
            </Button>
          </div>

          {/* Empty State Guard */}
          {bill.items.length === 0 && !bill.restaurantName ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-charcoal-200/90 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-charcoal-100 text-charcoal-400 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                No bill to review
              </h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Upload a receipt image on Step 1 to scan and extract dish items automatically.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/split')}
                className="bg-[#0D766E] hover:bg-[#0B615A]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to Upload</span>
              </Button>
            </div>
          ) : (
            /* Main 2-Column Review Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Receipt Info Card & Bill Summary (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <ReceiptInfoCard />
                <BillSummary />
              </div>

              {/* Right Column: Line Items Table, Validation, Actions (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <ExtractedItemsTable />
                <TotalsValidation />
                <ReviewActions />
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
