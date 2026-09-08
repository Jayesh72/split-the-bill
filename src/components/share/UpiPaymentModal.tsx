import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, CheckCheck, ExternalLink, ShieldCheck, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';
import { PersonShareSummary, DiningCompanion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareSummary: PersonShareSummary | null;
  payer: DiningCompanion | null;
  restaurantName: string;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  shareSummary,
  payer,
  restaurantName,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  // Generate clean payee UPI ID based on payer or organizer name
  const payeeName = payer?.name || 'Split Organizer';
  const sanitizedPayeeName = payeeName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'payee';
  const defaultUpiId = `${sanitizedPayeeName}@okaxis`;

  const amount = shareSummary ? shareSummary.totalShare : 0;
  const note = `Split bill for ${restaurantName}`;

  // Standard UPI URI format
  const upiUri = `upi://pay?pa=${encodeURIComponent(defaultUpiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    if (!isOpen || amount <= 0) return;

    QRCode.toDataURL(upiUri, {
      margin: 1,
      width: 280,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, upiUri, amount]);

  if (!isOpen || !shareSummary) return null;

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(defaultUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyPaymentLink = async () => {
    try {
      await navigator.clipboard.writeText(upiUri);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-charcoal-200/90 relative animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D766E] flex items-center justify-center shrink-0 shadow-sm">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-charcoal-900">
              UPI Instant Payment
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Scan with Google Pay, PhonePe, Paytm or any UPI app
            </p>
          </div>
        </div>

        {/* Amount & Diner Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
              Paying for {shareSummary.person.name}
            </span>
            <span className="text-2xl font-extrabold text-[#0D766E] tracking-tight">
              {formatCurrency(amount)}
            </span>
          </div>

          <div className="text-right text-xs">
            <span className="text-charcoal-500 block">Payee</span>
            <strong className="font-bold text-charcoal-900 block">{payeeName}</strong>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-dashed border-charcoal-200/90 mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`UPI QR Code to pay ${formatCurrency(amount)}`}
              className="w-56 h-56 rounded-xl object-contain shadow-sm"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-charcoal-400 font-medium">
              Generating dynamic QR code...
            </div>
          )}

          <span className="text-[11px] text-charcoal-400 font-medium mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Direct peer-to-peer UPI transfer
          </span>
        </div>

        {/* UPI ID Pill & Copy */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-charcoal-50 border border-charcoal-200/80 mb-5 text-xs">
          <div className="truncate mr-2">
            <span className="text-charcoal-400 text-[10px] uppercase font-bold block">UPI ID</span>
            <span className="font-mono font-bold text-charcoal-800 truncate block">{defaultUpiId}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyUpiId}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-charcoal-100 border border-charcoal-200/80 font-bold text-charcoal-700 flex items-center gap-1 shrink-0 cursor-pointer shadow-sm transition-colors text-[11px]"
          >
            {copiedUpi ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-charcoal-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile UPI App Intent Button & Actions */}
        <div className="space-y-2.5">
          <a
            href={upiUri}
            className="w-full py-3 px-4 rounded-2xl bg-[#0D766E] hover:bg-[#0B645E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/10 cursor-pointer transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open UPI App to Pay {formatCurrency(amount)}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPaymentLink}
            className="w-full text-xs font-bold text-charcoal-700 bg-white hover:bg-charcoal-50 border-charcoal-200 cursor-pointer"
          >
            {copiedUri ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span className="text-emerald-700">UPI Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-charcoal-500" />
                <span>Copy UPI Payment Intent URI</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
