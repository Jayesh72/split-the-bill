import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Users, ArrowLeft, Utensils } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { AssignHeaderCard } from '@/components/assign/AssignHeaderCard';
import { ItemAssignmentCard } from '@/components/assign/ItemAssignmentCard';
import { AssignmentProgressCard } from '@/components/assign/AssignmentProgressCard';
import { PersonSharesCard } from '@/components/assign/PersonSharesCard';
import { AssignmentTotalsCard } from '@/components/assign/AssignmentTotalsCard';
import { AssignActions } from '@/components/assign/AssignActions';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';

export const AssignItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bill, people, assignments } = useBill();
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');

  // Filter items based on active tab
  const filteredItems = bill.items.filter((item) => {
    const isAssigned = (assignments[item.id] || []).length > 0;
    if (filter === 'unassigned') return !isAssigned;
    if (filter === 'assigned') return isAssigned;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Progress Stepper showing Step 4 ACTIVE */}
          <BillProgressStepper currentStep={4} />

          {/* Empty State Guard 1: No Bill */}
          {bill.items.length === 0 && !bill.restaurantName ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-charcoal-200/90 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-charcoal-100 text-charcoal-400 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                No bill available
              </h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Upload a receipt first on Step 1 to scan and extract dishes.
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
          ) : people.length === 0 ? (
            /* Empty State Guard 2: No Dining Companions */
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-charcoal-200/90 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-charcoal-100 text-charcoal-400 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                No dining companions added
              </h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Add the people sharing this bill in Step 3 before claiming dishes.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/add-people')}
                className="bg-[#0D766E] hover:bg-[#0B615A]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Back to Add People</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Page Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                  Assign items to diners
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-600 font-medium mt-1">
                  Tap each dish to assign it to the person who had it. Shared items can be assigned to multiple people.
                </p>
              </div>

              {/* Verified Bill Context Card */}
              <AssignHeaderCard />

              {/* Main Content: 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Progress Card + Item Cards List (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <AssignmentProgressCard
                    filter={filter}
                    onFilterChange={setFilter}
                  />

                  {/* Filtered Items List */}
                  <div className="flex flex-col gap-3">
                    {filteredItems.map((item, idx) => (
                      <ItemAssignmentCard
                        key={item.id}
                        item={item}
                        itemIndex={idx}
                      />
                    ))}

                    {filteredItems.length === 0 && (
                      <div className="bg-white rounded-3xl p-8 text-center border border-charcoal-200/90 text-charcoal-400 text-xs font-semibold">
                        <Utensils className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        No dishes match the selected filter.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Totals Balance + Diners Breakdown (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <AssignmentTotalsCard />
                  <PersonSharesCard />

                  {/* Quick Tip Box */}
                  <div className="p-5 rounded-3xl bg-white border border-charcoal-200/90 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06)] flex flex-col gap-2.5">
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">
                      💡 Split Tip
                    </h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                      For shared dishes, each selected companion pays an equal fractional share. In the final step, you'll see exact breakdowns and customizable settlement links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <AssignActions />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
