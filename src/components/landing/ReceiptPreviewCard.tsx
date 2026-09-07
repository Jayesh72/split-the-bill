import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  Check,
  Share2,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LogoIcon } from '@/components/ui/LogoIcon';

export const ReceiptPreviewCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const receiptItems = [
    {
      id: 1,
      name: 'Butter Chicken',
      desc: 'Qty 1 • Single diner',
      price: '₹420',
      tag: 'Jayesh',
      tagType: 'single',
    },
    {
      id: 2,
      name: 'Paneer Tikka',
      desc: 'Qty 1 • Single diner',
      price: '₹360',
      tag: 'Rahul',
      tagType: 'single',
    },
    {
      id: 3,
      name: 'Garlic Naan ×2',
      isShared: true,
      desc: 'Qty 2 • ₹90 each',
      price: '₹180',
      tag: 'Jayesh + Priya (½)',
      tagType: 'shared',
    },
    {
      id: 4,
      name: 'Dal Makhani',
      desc: 'Qty 1 • Single diner',
      price: '₹320',
      tag: 'Ankit',
      tagType: 'single',
    },
    {
      id: 5,
      name: 'Coke ×2',
      isShared: true,
      desc: 'Qty 2 • ₹40 each',
      price: '₹80',
      tag: 'Rahul + Ankit (½)',
      tagType: 'shared',
    },
    {
      id: 6,
      name: 'Gulab Jamun',
      desc: 'Qty 2 • Dessert',
      price: '₹240',
      tag: 'Priya',
      tagType: 'single',
    },
  ];

  const settlementList = [
    {
      avatar: 'J',
      name: 'Jayesh',
      breakdown: 'Butter Chicken + ½ Naan',
      amount: '₹668.00',
    },
    {
      avatar: 'R',
      name: 'Rahul',
      breakdown: 'Paneer Tikka + ½ Coke',
      amount: '₹490.00',
    },
    {
      avatar: 'A',
      name: 'Ankit',
      breakdown: 'Dal Makhani + ½ Coke',
      amount: '₹445.00',
    },
    {
      avatar: 'P',
      name: 'Priya',
      breakdown: 'Gulab Jamun + ½ Naan',
      amount: '₹445.00',
    },
  ];

  return (
    <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-16">
      {/* Outer Neumorphic Card Container */}
      <div className="bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08),0_4px_16px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] shadow-sm flex-shrink-0">
              <LogoIcon className="w-6 h-6 text-[#0D766E]" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-charcoal-900">
                  The Olive Table
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
                  <Check className="w-3 h-3 text-[#0D766E]" strokeWidth={2.5} />
                  AI OCR Verified
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                Indiranagar, Bengaluru • Bill #IND-89241 • 4 Companions
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-charcoal-50 border border-charcoal-200 shadow-sm text-xs sm:text-sm font-semibold text-charcoal-800 transition-all hover:border-charcoal-300 self-start sm:self-auto cursor-pointer"
          >
            <span>Open This Bill in Split Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-charcoal-600" />
          </button>
        </div>

        {/* 2-Column Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Column: Detected Items (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-bold tracking-wider text-charcoal-500 uppercase">
                DETECTED RECEIPT ITEMS (6)
              </span>
              <span className="text-[11px] font-semibold text-[#0D766E] hover:underline cursor-pointer">
                Tapped to reassign
              </span>
            </div>

            {/* List of items */}
            <div className="flex flex-col gap-2.5">
              {receiptItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200/90 shadow-[0_2px_6px_0_rgba(15,23,42,0.03)] hover:shadow-soft hover:border-brand-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-charcoal-100 text-charcoal-600 font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand transition-colors">
                      {item.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal-900">
                          {item.name}
                        </span>
                        {item.isShared && (
                          <span className="px-1.5 py-0.5 rounded bg-charcoal-100 text-charcoal-600 text-[10px] font-semibold">
                            Shared
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-charcoal-500 font-normal">
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-charcoal-900 tracking-tight">
                      {item.price}
                    </span>
                    <Badge variant={item.tagType === 'shared' ? 'teal' : 'pill-user'}>
                      {item.tagType === 'single' ? `● ${item.tag}` : item.tag}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Grand Total & Settlement (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Calculation Card */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/90 shadow-[inset_0_1px_3px_0_rgba(15,23,42,0.02)]">
              <div className="flex flex-col gap-2 pb-4 border-b border-charcoal-200/80 text-xs">
                <div className="flex items-center justify-between text-charcoal-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-charcoal-900">₹1,600.00</span>
                </div>
                <div className="flex items-center justify-between text-charcoal-600">
                  <span className="inline-flex items-center gap-1 font-medium">
                    GST (18%) <Info className="w-3 h-3 text-charcoal-400" />
                  </span>
                  <span className="font-bold text-charcoal-900">₹288.00</span>
                </div>
                <div className="flex items-center justify-between text-charcoal-600">
                  <span className="inline-flex items-center gap-1 font-medium">
                    Service Charge (10%) <Info className="w-3 h-3 text-charcoal-400" />
                  </span>
                  <span className="font-bold text-charcoal-900">₹160.00</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-xs font-bold tracking-wider text-charcoal-800 uppercase">
                  GRAND TOTAL
                </span>
                <span className="text-2xl font-extrabold text-[#0D766E] tracking-tight">
                  ₹2,048.00
                </span>
              </div>
            </div>

            {/* Settlement Breakdown */}
            <div className="mt-5">
              <div className="text-[11px] font-bold tracking-wider text-charcoal-500 uppercase mb-2.5 px-1">
                SETTLEMENT BREAKDOWN (EXACT PAISA PRECISION)
              </div>

              <div className="flex flex-col gap-2">
                {settlementList.map((diner) => (
                  <div
                    key={diner.name}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-charcoal-200/80 shadow-sm hover:shadow-soft transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-charcoal-100 text-charcoal-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {diner.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-charcoal-900">
                          {diner.name}
                        </div>
                        <div className="text-[11px] text-charcoal-500 font-normal">
                          {diner.breakdown}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#0D766E] tracking-tight">
                        {diner.amount}
                      </div>
                      <div className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        <span>Incl. taxes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-built WhatsApp & UPI Link bar */}
            <div className="mt-4 p-3 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 text-[#0D766E]" />
                </div>
                <span className="text-xs font-semibold text-charcoal-800">
                  Pre-built WhatsApp & UPI Link
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-semibold text-charcoal-800 shadow-sm transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-charcoal-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
