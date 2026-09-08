/**
 * UPI Payment Intent Utilities
 * Generates standard NPCI UPI payment URIs and validates format.
 */

// Basic UPI VPA format: username@provider
// e.g. rahul@okaxis, john.doe@oksbi, user_99@upi
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
  amount: number;
  transactionNote?: string;
}

/**
 * Generates a standard NPCI UPI payment URI (upi://pay?...).
 * Parameters are strictly URL-encoded.
 *
 * @param params UpiPaymentParams containing payee UPI ID, name, amount, and optional note.
 * @returns Standard upi://pay URI or empty string if invalid input.
 */
export function generateUpiUri({
  upiId,
  payeeName,
  amount,
  transactionNote = 'Split the Bill',
}: UpiPaymentParams): string {
  const trimmedUpi = upiId ? upiId.trim() : '';
  if (!trimmedUpi || !isValidUpiId(trimmedUpi) || isNaN(amount) || amount < 0) {
    return '';
  }

  const cleanPayeeName = (payeeName && payeeName.trim()) || 'Split Organizer';
  const cleanAmount = (Math.round(amount * 100) / 100).toFixed(2);
  const cleanNote = (transactionNote && transactionNote.trim()) || 'Split the Bill';

  const queryParams = new URLSearchParams({
    pa: trimmedUpi,
    pn: cleanPayeeName,
    am: cleanAmount,
    cu: 'INR',
    tn: cleanNote,
  });

  return `upi://pay?${queryParams.toString()}`;
}
