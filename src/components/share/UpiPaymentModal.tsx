import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  CheckCheck,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Edit3,
  Check,
  Info,
  UserCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import { PersonShareSummary, DiningCompanion } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useBill } from '@/context/BillContext';
import { isValidUpiId, generateUpiUri } from '@/lib/upi';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareSummary?: PersonShareSummary | null;
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
  const { upiId, setUpiId } = useBill();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  // Local state for editing UPI ID inside modal
  const [inputUpi, setInputUpi] = useState('');
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Payee name & calculated amount (only set if paying for an individual diner share)
  const payeeName = payer?.name || 'Split Organizer';
  const amount = shareSummary ? shareSummary.totalShare : 0;
  const isIndividualShare = Boolean(shareSummary && amount > 0);
  const transactionNote = `Split bill for ${restaurantName || 'Meal'}`;

  // Keep local input in sync with context upiId
  useEffect(() => {
    if (isOpen) {
      setInputUpi(upiId || '');
      setIsEditingUpi(!upiId || !isValidUpiId(upiId));
      setErrorMsg('');
      setCopiedUpi(false);
      setCopiedUri(false);
    }
  }, [isOpen, upiId]);

  const hasValidUpi = Boolean(upiId && isValidUpiId(upiId));
  const upiUri = hasValidUpi
    ? generateUpiUri({
        upiId: upiId!,
        payeeName,
        amount: isIndividualShare ? amount : undefined,
        transactionNote,
      })
    : '';

  useEffect(() => {
    if (!isOpen || !hasValidUpi || !upiUri) {
      setQrDataUrl('');
      return;
    }

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
  }, [isOpen, hasValidUpi, upiUri]);

  if (!isOpen) return null;

  const handleSaveUpiId = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUpi.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a UPI ID.');
      return;
    }
    if (!isValidUpiId(trimmed)) {
      setErrorMsg('Please enter a valid UPI ID format (e.g. 7440487705@ibl, rahul@okaxis).');
      return;
    }
    setUpiId(trimmed);
    setIsEditingUpi(false);
    setErrorMsg('');
  };

  const handleCopyUpiId = async () => {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyPaymentLink = async () => {
    if (!upiUri) return;
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-charcoal-200/90 relative animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D766E] flex items-center justify-center shrink-0 shadow-sm">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-charcoal-900">
              {isIndividualShare ? 'Individual Share Payment' : 'Payer Bank Account QR'}
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Scan with Google Pay, PhonePe, Paytm, BHIM or any UPI app
            </p>
          </div>
        </div>

        {/* Amount & Diner Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/80 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
              {isIndividualShare ? `Paying for ${shareSummary?.person.name}` : 'Payment Share'}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0D766E] tracking-tight">
              {isIndividualShare ? formatCurrency(amount) : 'Enter Share on Scan'}
            </span>
          </div>

          <div className="text-right text-xs">
            <span className="text-charcoal-500 flex items-center justify-end gap-1">
              <UserCheck className="w-3 h-3 text-amber-600" />
              Bill Paid by
            </span>
            <strong className="font-bold text-charcoal-900 block">{payeeName}</strong>
          </div>
        </div>

        {/* CONDITION 1: NO UPI ID OR USER IS EDITING UPI ID */}
        {(!hasValidUpi || isEditingUpi) && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 mb-4">
            <div className="flex items-start gap-2.5 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  {hasValidUpi ? 'Update Payee UPI ID' : 'Enter Organizer / Payer UPI ID'}
                </h4>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                  Enter the real UPI ID of the person who paid the bill to generate their payment QR.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUpiId} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={inputUpi}
                  onChange={(e) => {
                    setInputUpi(e.target.value.trim());
                    setErrorMsg('');
                  }}
                  placeholder="e.g. 7440487705@ibl, rahul@okaxis"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errorMsg}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>{hasValidUpi ? 'Update UPI ID' : 'Save & Generate QR'}</span>
                </Button>

                {hasValidUpi && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputUpi(upiId || '');
                      setIsEditingUpi(false);
                      setErrorMsg('');
                    }}
                    className="text-xs font-semibold text-charcoal-700 bg-white hover:bg-charcoal-50 cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* CONDITION 2: VALID UPI ID PRESENT */}
        {hasValidUpi && !isEditingUpi && (
          <>
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-dashed border-charcoal-200/90 mb-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Code to pay ${payeeName}`}
                  className="w-52 h-52 rounded-xl object-contain shadow-sm"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-charcoal-400 font-medium">
                  Generating UPI QR code...
                </div>
              )}

              <span className="text-[11px] text-charcoal-500 font-medium mt-2 flex items-center gap-1 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {isIndividualShare
                  ? `Dynamic QR for ${payeeName} (${formatCurrency(amount)})`
                  : `Bank QR for ${payeeName} • Each diner enters their share`}
              </span>
            </div>

            {/* UPI ID Pill, Edit, & Copy */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-charcoal-50 border border-charcoal-200/80 mb-4 text-xs">
              <div className="truncate mr-2">
                <span className="text-charcoal-400 text-[10px] uppercase font-bold block">
                  Payee UPI ID
                </span>
                <span className="font-mono font-bold text-charcoal-800 truncate block">
                  {upiId}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingUpi(true)}
                  className="p-1.5 rounded-lg bg-white hover:bg-charcoal-100 border border-charcoal-200/80 font-medium text-charcoal-600 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Edit UPI ID"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-charcoal-100 border border-charcoal-200/80 font-bold text-charcoal-700 flex items-center gap-1 cursor-pointer shadow-sm transition-colors text-[11px]"
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
            </div>

            {/* Mobile UPI App Intent Button & Actions */}
            <div className="space-y-2 mb-4">
              {upiUri && (
                <a
                  href={upiUri}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#0D766E] hover:bg-[#0B645E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-700/10 cursor-pointer transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {isIndividualShare
                      ? `Pay ${formatCurrency(amount)} with UPI`
                      : `Open in UPI App`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPaymentLink}
                className="w-full text-xs font-bold text-charcoal-700 bg-white hover:bg-charcoal-50 border-charcoal-200 cursor-pointer"
              >
                {copiedUri ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span className="text-emerald-700">Payment Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1 text-charcoal-500" />
                    <span>Copy UPI Payment Link</span>
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Non-custodial Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Payments are completed directly through your UPI app. Split the Bill does not store or process payment funds.
          </span>
        </div>
      </div>
    </div>
  );
};
