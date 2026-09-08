import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, FileQuestion, ArrowLeft, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { BillContextCard } from '@/components/people/BillContextCard';
import { PersonCard } from '@/components/people/PersonCard';
import { AddPersonForm } from '@/components/people/AddPersonForm';
import { PayerSelectorCard } from '@/components/people/PayerSelectorCard';
import { GroupSummaryCard } from '@/components/people/GroupSummaryCard';
import { PeopleActions } from '@/components/people/PeopleActions';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';

export const AddPeoplePage: React.FC = () => {
  const navigate = useNavigate();
  const { bill, people } = useBill();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const personCountText =
    people.length === 0
      ? '0 people'
      : people.length === 1
      ? '1 person'
      : `${people.length} people`;

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Dynamic Progress Stepper showing Step 3 ACTIVE */}
          <BillProgressStepper currentStep={3} />

          {/* Empty State Guard if no bill exists */}
          {bill.items.length === 0 && !bill.restaurantName ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-charcoal-200/90 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-charcoal-100 text-charcoal-400 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                No bill to split yet
              </h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Upload a bill first on Step 1 to extract dishes and add dining companions.
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
            <div className="flex flex-col gap-6">
              {/* Page Heading Section */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                  Add dining companions
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-600 font-medium mt-1">
                  Who's joining this split? Add everyone at the table and we'll make assigning dishes easy.
                </p>
              </div>

              {/* Compact Verified Bill Context Card */}
              <BillContextCard />

              {/* Alert / Notification Banner */}
              {alertMessage && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{alertMessage}</span>
                </div>
              )}

              {/* Main Content: 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Dinner Group & Person Cards (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* Dinner Group Container Card */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-5 h-5 text-[#0D766E]" />
                        <h2 className="text-base sm:text-lg font-bold text-charcoal-900">
                          Dinner Group
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
                          {personCountText}
                        </span>
                      </div>

                      <span className="text-xs text-charcoal-500 font-medium">
                        {people.length > 0 ? 'Tap pencil to edit name/color' : 'Add diners below'}
                      </span>
                    </div>

                    {/* Person Cards List */}
                    <div className="flex flex-col gap-3 my-4">
                      {people.map((person) => (
                        <PersonCard
                          key={person.id}
                          person={person}
                          onAlert={showAlert}
                        />
                      ))}

                      {/* Clean Empty State when no people are added yet */}
                      {people.length === 0 && (
                        <div className="py-8 px-4 text-center rounded-2xl bg-[#F8FAFC] border border-dashed border-charcoal-200">
                          <div className="w-12 h-12 rounded-2xl bg-charcoal-100 text-charcoal-400 flex items-center justify-center mx-auto mb-3">
                            <UserPlus className="w-6 h-6 text-charcoal-400" />
                          </div>
                          <p className="text-sm font-bold text-charcoal-800 mb-0.5">
                            No dining companions added yet
                          </p>
                          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                            Add everyone who's sharing this bill to get started. The first person added will be marked as the organizer.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add Person Form / Button */}
                    <div className="pt-2 border-t border-charcoal-100">
                      <AddPersonForm onSuccess={() => setAlertMessage(null)} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Payer Selector & Group Summary (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Who paid the bill? Card */}
                  <PayerSelectorCard />

                  {/* Summary Metric Card */}
                  <GroupSummaryCard />

                  {/* Splitting Tip Box */}
                  <div className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-3">
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">
                      💡 Quick Splitting Tip
                    </h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                      Every diner gets a distinct avatar color for rapid identification during item assignment. Shared items like appetizers and drinks can easily be split evenly across multiple members in Step 4.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Actions */}
              <PeopleActions disabled={people.length === 0} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
