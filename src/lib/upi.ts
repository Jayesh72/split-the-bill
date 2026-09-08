/**
 * UPI Payment Intent Utilities
 * Generates standard NPCI UPI payment URIs and validates format.
 */

// Basic UPI VPA format: username@provider
// e.g. 7440487705@ibl, rahul@okaxis, user_99@upi
const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

/**
 * Validates whether a given string is in a reasonable UPI ID (VPA) format.
 * NOTE: This validates format syntax only, not existence/ownership of the ID.
 */
export function isValidUpiId(upiId: string | null | undefined): boolean {
  if (!upiId) return false;
  const trimmed = upiId.trim();
  return UPI_REGEX.test(trimmed);
}

export interface UpiPaymentParams {
  upiId: string;
  payeeName: string;
  amount?: number;
  transactionNote?: string;
}

/**
 * Generates a standard NPCI UPI payment URI (upi://pay?...).
 * When amount is not specified or 0, generates an open bank account UPI URI
 * so each diner can scan and input their individual share.
 *
 * @param params UpiPaymentParams containing payee UPI ID, name, optional amount, and optional note.
 * @returns Standard upi://pay URI or empty string if invalid input.
 */
export function generateUpiUri({
  upiId,
  payeeName,
  amount,
  transactionNote = 'Split the Bill',
}: UpiPaymentParams): string {
  const trimmedUpi = upiId ? upiId.trim() : '';
  if (!trimmedUpi || !isValidUpiId(trimmedUpi)) {
    return '';
  }

  const cleanPayeeName = (payeeName && payeeName.trim()) || 'Split Organizer';
  const cleanNote = (transactionNote && transactionNote.trim()) || 'Split the Bill';

  const paramsObj: Record<string, string> = {
    pa: trimmedUpi,
    pn: cleanPayeeName,
    cu: 'INR',
    tn: cleanNote,
  };

  // Only append 'am' if an explicit positive amount is provided (e.g. for individual diner shares)
  if (amount !== undefined && amount !== null && amount > 0 && !isNaN(amount)) {
    paramsObj.am = (Math.round(amount * 100) / 100).toFixed(2);
  }

  const queryParams = new URLSearchParams(paramsObj);
  return `upi://pay?${queryParams.toString()}`;
}
