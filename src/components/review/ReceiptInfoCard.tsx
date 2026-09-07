import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Calendar, Receipt, Check, Edit3, Image as ImageIcon } from 'lucide-react';
import { useBill } from '@/context/BillContext';

export const ReceiptInfoCard: React.FC = () => {
  const navigate = useNavigate();
  const { bill } = useBill();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90 flex flex-col gap-4">
      {/* Top Bar: Title & Edit Button */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#0D766E]" />
          <h3 className="text-sm font-bold text-charcoal-900">Receipt Information</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/split')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D766E] hover:text-[#0B615A] transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Receipt</span>
        </button>
      </div>

      {/* Receipt Photo / Preview Thumbnail if available */}
      {bill.receiptImagePreviewUrl ? (
        <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-900 border border-charcoal-200 flex items-center justify-center group">
          <img
            src={bill.receiptImagePreviewUrl}
            alt="Uploaded Receipt"
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Uploaded Document
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] border border-[#A7F3D0]/70 flex items-center justify-center text-[#0D766E] flex-shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-charcoal-900 truncate">
                {bill.restaurantName}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70 flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" /> OCR Verified
              </span>
            </div>
            <span className="text-xs text-charcoal-500 truncate block">
              {bill.address || 'Dining Receipt'}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Meta Information */}
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-charcoal-100">
          <span className="text-charcoal-500 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-charcoal-400" /> Restaurant
          </span>
          <span className="font-bold text-charcoal-900">{bill.restaurantName}</span>
        </div>

        {bill.address && (
          <div className="flex items-start justify-between py-1.5 border-b border-charcoal-100 gap-2">
            <span className="text-charcoal-500 flex items-center gap-1.5 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" /> Address
            </span>
            <span className="font-semibold text-charcoal-800 text-right truncate">
              {bill.address}
            </span>
          </div>
        )}

        {bill.dateTime && (
          <div className="flex items-center justify-between py-1.5 border-b border-charcoal-100">
            <span className="text-charcoal-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-charcoal-400" /> Date & Time
            </span>
            <span className="font-semibold text-charcoal-800">{bill.dateTime}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-1.5">
          <span className="text-charcoal-500 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-charcoal-400" /> Bill Number
          </span>
          <span className="font-bold text-charcoal-900">{bill.billNumber || '#IND-89241'}</span>
        </div>
      </div>
    </div>
  );
};
