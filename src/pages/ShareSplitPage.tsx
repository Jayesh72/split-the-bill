import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, AlertCircle, ArrowLeft, Users, Receipt, PlusCircle } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { useBill } from '@/context/BillContext';
import { PersonShareSummary } from '@/types';
import { Button } from '@/components/ui/Button';
import { SettlementHeaderCard } from '@/components/share/SettlementHeaderCard';
import { SettlementStatusCard } from '@/components/share/SettlementStatusCard';
import { GroupSharingCard } from '@/components/share/GroupSharingCard';
import { MemberSplitCard } from '@/components/share/MemberSplitCard';
import { UpiPaymentModal } from '@/components/share/UpiPaymentModal';
import { ShareActions } from '@/components/share/ShareActions';
import { PrintableReceipt } from '@/components/share/PrintableReceipt';

export const ShareSplitPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    bill,
    people,
    payer,
    organizer,
    personShares,
    paidStatus,
    togglePaidStatus,
    markAllPaid,
    paidMembersCount,
    totalPaidAmount,
    totalPendingAmount,
    isAllMembersPaid,
    isAllItemsAssigned,
    unassignedItemsCount,
    resetAll,
  } = useBill();

  // Selected diner for UPI payment modal
  const [selectedUpiShare, setSelectedUpiShare] = useState<PersonShareSummary | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Trigger print
  const handlePrintPdf = () => {
    window.print();
  };

  // Guard 1: No Bill available
  if (!bill || !bill.items || bill.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
        <div>
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            <BillProgressStepper currentStep={5} />
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 text-center my-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Receipt className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mb-2">No Bill Available</h2>
              <p className="text-sm text-charcoal-600 max-w-md mx-auto mb-6">
                Please upload or scan a receipt first before settling the bill.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/split')}
                className="text-xs font-bold shadow-md shadow-teal-700/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Go to Upload Bill</span>
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Guard 2: No dining companions
  if (people.length === 0) {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
        <div>
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            <BillProgressStepper currentStep={5} />
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 text-center my-8">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 text-[#0D766E] flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mb-2">No Dining Companions</h2>
              <p className="text-sm text-charcoal-600 max-w-md mx-auto mb-6">
                Add the people who shared this meal to divide and settle the bill.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/add-people')}
                className="text-xs font-bold shadow-md shadow-teal-700/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Go to Add People</span>
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Guard 3: Unassigned items exist
  if (!isAllItemsAssigned) {
    return (
      <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
        <div>
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            <BillProgressStepper currentStep={5} />
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] border border-amber-200 text-center my-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mb-2">
                {unassignedItemsCount} {unassignedItemsCount === 1 ? 'Dish' : 'Dishes'} Still Unassigned
              </h2>
              <p className="text-sm text-charcoal-600 max-w-md mx-auto mb-6">
                Every dish on the bill must be assigned to at least one person before generating the final split.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/assign')}
                className="text-xs font-bold shadow-md shadow-teal-700/10 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to Assign Items</span>
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 print:p-0">
          {/* Print View Component */}
          <PrintableReceipt
            bill={bill}
            personShares={personShares}
            payer={payer}
            paidStatus={paidStatus}
          />

          {/* Screen View */}
          <div className="print:hidden">
            {/* Dynamic Step 5 Progress Stepper */}
            <BillProgressStepper currentStep={5} />

            {/* Page Header */}
            <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0] mb-2.5">
                  <Share2 className="w-3.5 h-3.5" /> Step 5 • Final Settle
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                  Share split & settle
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-600 font-medium mt-1 max-w-2xl">
                  Everyone's share is calculated with 100% arithmetic balance. Send payment requests or settle up instantly.
                </p>
              </div>
            </div>

            {/* Main 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 Cols on LG): Bill Summary, Settlement Progress, Group Sharing */}
              <div className="lg:col-span-5 space-y-6">
                <SettlementHeaderCard
                  bill={bill}
                  payer={payer}
                  organizer={organizer}
                  companionCount={people.length}
                />

                <SettlementStatusCard
                  grandTotal={bill.grandTotal}
                  totalPaidAmount={totalPaidAmount}
                  totalPendingAmount={totalPendingAmount}
                  paidMembersCount={paidMembersCount}
                  totalMembersCount={people.length}
                  isAllMembersPaid={isAllMembersPaid}
                  onToggleAllPaid={() => markAllPaid(!isAllMembersPaid)}
                />

                <GroupSharingCard
                  bill={bill}
                  personShares={personShares}
                  payer={payer}
                  onPrintPdf={handlePrintPdf}
                />
              </div>

              {/* Right Column (7 Cols on LG): Individual Member Split Cards */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-charcoal-900">
                      Individual Member Splits
                    </h2>
                    <span className="text-xs text-charcoal-500 font-medium">
                      {people.length} dining {people.length === 1 ? 'companion' : 'companions'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-charcoal-500">
                    {paidMembersCount} of {people.length} marked paid
                  </span>
                </div>

                {/* List of Member Cards */}
                <div className="space-y-4">
                  {personShares.map((summary) => (
                    <MemberSplitCard
                      key={summary.person.id}
                      shareSummary={summary}
                      isPaid={!!paidStatus[summary.person.id]}
                      isPayer={summary.person.id === payer?.id}
                      isOrganizer={summary.person.id === organizer?.id}
                      restaurantName={bill.restaurantName}
                      payer={payer}
                      onTogglePaid={() => togglePaidStatus(summary.person.id)}
                      onOpenUpi={(share) => setSelectedUpiShare(share)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <ShareActions
              onPrintPdf={handlePrintPdf}
              onResetNewBill={() => setIsResetConfirmOpen(true)}
            />
          </div>
        </main>
      </div>

      <Footer />

      {/* UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={!!selectedUpiShare}
        onClose={() => setSelectedUpiShare(null)}
        shareSummary={selectedUpiShare}
        payer={payer}
        restaurantName={bill.restaurantName}
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-charcoal-200 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D766E] flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-charcoal-900 mb-1.5">
              Start a New Bill Split?
            </h3>
            <p className="text-xs text-charcoal-600 mb-6 font-medium">
              This will clear the current bill assignments and dining companions so you can upload a new receipt.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsResetConfirmOpen(false)}
                className="text-xs font-bold text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsResetConfirmOpen(false);
                  resetAll();
                  navigate('/split');
                }}
                className="text-xs font-bold shadow-md shadow-teal-700/10 cursor-pointer"
              >
                Start New Split
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
