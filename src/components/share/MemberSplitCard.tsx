import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, CheckCircle2, QrCode, MessageSquare, Copy, CheckCheck, UserCheck, ShieldCheck } from 'lucide-react';
import { PersonShareSummary, DiningCompanion } from '@/types';
import { formatCurrency, getInitials } from '@/lib/utils';

interface MemberSplitCardProps {
  shareSummary: PersonShareSummary;
  isPaid: boolean;
  isPayer: boolean;
  isOrganizer: boolean;
  restaurantName: string;
  payer: DiningCompanion | null;
  onTogglePaid: () => void;
  onOpenUpi: (share: PersonShareSummary) => void;
}

export const MemberSplitCard: React.FC<MemberSplitCardProps> = ({
  shareSummary,
  isPaid,
  isPayer,
  isOrganizer,
  restaurantName,
  payer,
  onOpenUpi,
  onTogglePaid,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedBreakdown, setCopiedBreakdown] = useState(false);

  const { person, items, subtotal, taxShare, serviceChargeShare, totalShare } = shareSummary;

  const handleCopyBreakdown = async () => {
    const dishLines = items.map(
      (it) => `• ${it.item.name} (${it.isShared ? `Shared by ${it.assignedCount}` : 'Solo'}) - ${formatCurrency(it.shareAmount)}`
    ).join('\n');

    const text = `Split Breakdown for ${person.name} @ ${restaurantName}\n${dishLines}\n------------------------\nSubtotal: ${formatCurrency(subtotal)}\nTax & Charges: ${formatCurrency(taxShare + serviceChargeShare)}\nTotal Owed: ${formatCurrency(totalShare)}\nStatus: ${isPaid ? 'PAID' : 'PENDING'}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedBreakdown(true);
      setTimeout(() => setCopiedBreakdown(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSendWhatsApp = () => {
    const dishList = items.map((it) => it.item.name).slice(0, 3).join(', ');
    const extra = items.length > 3 ? ` and ${items.length - 3} more` : '';
    const payeeName = payer?.name || 'the organizer';

    const message = `Hey ${person.name}! 👋 Your share for ${restaurantName} is ${formatCurrency(totalShare)}. You had: ${dishList}${extra}.\n\nPlease settle up with ${payeeName} via UPI. Thanks!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border transition-all duration-300 ${
        isPaid
          ? 'border-emerald-200/90 bg-emerald-50/10'
          : 'border-charcoal-200/90 hover:border-teal-300'
      }`}
    >
      {/* Top row: Avatar, Name, Badges, Amount, Paid toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-sm shrink-0 border border-white/40"
            style={{ backgroundColor: person.avatarColor || '#0D766E' }}
          >
            {getInitials(person.name)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-bold text-base text-charcoal-900">{person.name}</h3>

              {isOrganizer && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#0D766E] border border-teal-200">
                  <ShieldCheck className="w-3 h-3" /> Organizer
                </span>
              )}

              {isPayer && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                  <UserCheck className="w-3 h-3 text-amber-600" /> Payer
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-500 font-medium">
              <span>{items.length} {items.length === 1 ? 'dish' : 'dishes'} assigned</span>
              {isPayer && (
                <>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold">Settled receipt</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount & Paid Status Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-charcoal-100">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
              Total Share
            </span>
            <span
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isPaid ? 'text-emerald-700' : 'text-charcoal-900'
              }`}
            >
              {formatCurrency(totalShare)}
            </span>
          </div>

          {/* Paid Button */}
          <button
            type="button"
            onClick={onTogglePaid}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/80'
                : 'bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200'
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Paid</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-charcoal-400" />
                <span>Mark Paid</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion Toggle */}
      <div className="mt-4 pt-3 border-t border-charcoal-100/90 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-[#0D766E] hover:text-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{isExpanded ? 'Hide Dish Breakdown' : `View ${items.length} Dishes Breakdown`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1.5">
          {/* WhatsApp Action */}
          <button
            type="button"
            onClick={handleSendWhatsApp}
            title="Send WhatsApp share request"
            className="p-1.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* UPI Pay / QR Action */}
          <button
            type="button"
            onClick={() => onOpenUpi(shareSummary)}
            title="View UPI QR Code & Pay Link"
            className="p-1.5 rounded-xl text-[#0D766E] bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5 text-[#0D766E]" />
            <span className="hidden sm:inline">UPI QR</span>
          </button>

          {/* Copy breakdown text */}
          <button
            type="button"
            onClick={handleCopyBreakdown}
            title="Copy itemized text breakdown"
            className="p-1.5 rounded-xl text-charcoal-600 bg-charcoal-50 hover:bg-charcoal-100 border border-charcoal-200/80 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
          >
            {copiedBreakdown ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-charcoal-500" />
            )}
            <span className="hidden sm:inline">{copiedBreakdown ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Breakdown Table */}
      {isExpanded && (
        <div className="mt-3.5 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/70 p-4 animate-fadeIn">
          <div className="space-y-2 text-xs">
            {items.map((it) => (
              <div
                key={it.item.id}
                className="flex items-center justify-between py-1 border-b border-charcoal-100/60 last:border-0"
              >
                <div className="flex-1 pr-3">
                  <span className="font-bold text-charcoal-900 block">{it.item.name}</span>
                  <span className="text-[11px] text-charcoal-500 font-medium">
                    {it.isShared ? (
                      <span className="text-purple-700 font-semibold">
                        Shared by {it.assignedCount} diners ({it.coDinerNames.slice(0, 2).join(', ')}{it.coDinerNames.length > 2 ? '...' : ''})
                      </span>
                    ) : (
                      'Solo Dish'
                    )}
                    {' • '}Total line {formatCurrency(it.itemTotal)}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-charcoal-900">
                    {formatCurrency(it.shareAmount)}
                  </span>
                </div>
              </div>
            ))}

            {/* Charges Rows */}
            <div className="pt-2 mt-2 border-t border-charcoal-200/80 space-y-1 text-charcoal-600 font-medium text-[11px]">
              <div className="flex items-center justify-between">
                <span>Dishes Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
              </div>
              {taxShare > 0 && (
                <div className="flex items-center justify-between text-charcoal-500">
                  <span>Proportional GST / Tax</span>
                  <span className="font-semibold text-charcoal-800">+{formatCurrency(taxShare)}</span>
                </div>
              )}
              {serviceChargeShare > 0 && (
                <div className="flex items-center justify-between text-charcoal-500">
                  <span>Proportional Service Charge</span>
                  <span className="font-semibold text-charcoal-800">+{formatCurrency(serviceChargeShare)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-charcoal-200/80 font-bold text-xs text-charcoal-900">
                <span>Total Amount Owed</span>
                <span className="font-extrabold text-[#0D766E] text-sm">
                  {formatCurrency(totalShare)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
