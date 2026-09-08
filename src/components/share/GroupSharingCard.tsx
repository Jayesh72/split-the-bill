import React, { useState } from 'react';
import { Share2, MessageSquare, Copy, CheckCheck, FileDown, Sparkles } from 'lucide-react';
import { Bill, PersonShareSummary, DiningCompanion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface GroupSharingCardProps {
  bill: Bill;
  personShares: PersonShareSummary[];
  payer: DiningCompanion | null;
  onPrintPdf: () => void;
}

export const GroupSharingCard: React.FC<GroupSharingCardProps> = ({
  bill,
  personShares,
  payer,
  onPrintPdf,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const generateFullTextSummary = (): string => {
    const header = `🧾 *Split the Bill Summary — ${bill.restaurantName}*\nTotal Bill: ${formatCurrency(bill.grandTotal)} (${bill.items.length} items)\nPaid by: ${payer?.name || 'Organizer'}\n--------------------------------\n`;

    const membersList = personShares
      .map((s, idx) => {
        const dishSummary = s.items.map((it) => it.item.name).slice(0, 2).join(', ');
        return `${idx + 1}. *${s.person.name}*: ${formatCurrency(s.totalShare)} (${s.itemsCount} dishes${dishSummary ? ` — ${dishSummary}` : ''})`;
      })
      .join('\n');

    const footer = `\n--------------------------------\n💳 Please transfer your share to ${payer?.name || 'the organizer'} via UPI.\nCreated with Split The Bill ⚡`;

    return header + membersList + footer;
  };

  const handleWhatsAppShare = () => {
    const text = generateFullTextSummary();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    // Current application URL with step 5
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopySummaryText = async () => {
    const text = generateFullTextSummary();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-charcoal-200/90 relative overflow-hidden transition-all duration-300">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D766E] flex items-center justify-center shrink-0 shadow-sm">
          <Share2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-900">
              Group Actions & Sharing
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#0D766E] border border-teal-200">
              <Sparkles className="w-3 h-3" /> 1-Click
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5 font-medium">
            Broadcast everyone's breakdown via WhatsApp, copy a direct link, or print receipt PDF.
          </p>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* WhatsApp Button */}
        <Button
          variant="primary"
          size="md"
          onClick={handleWhatsAppShare}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-transparent shadow-sm text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span>WhatsApp Bill</span>
        </Button>

        {/* Copy Split Link */}
        <Button
          variant="outline"
          size="md"
          onClick={handleCopyLink}
          className="w-full text-charcoal-800 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {copiedLink ? (
            <>
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-charcoal-500" />
              <span>Copy Split Link</span>
            </>
          )}
        </Button>

        {/* Download / Print PDF */}
        <Button
          variant="outline"
          size="md"
          onClick={onPrintPdf}
          className="w-full text-charcoal-800 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-charcoal-500" />
          <span>Download PDF</span>
        </Button>

        {/* Copy Text Summary */}
        <Button
          variant="outline"
          size="md"
          onClick={handleCopySummaryText}
          className="w-full text-charcoal-800 bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {copiedText ? (
            <>
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Text Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-charcoal-500" />
              <span>Copy Summary Text</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
