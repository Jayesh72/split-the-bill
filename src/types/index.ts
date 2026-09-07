export interface BillItem {
  id: string | number;
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  confidence?: number;
  isShared?: boolean;
  assignedTo?: string[];
}

export interface Bill {
  id: string;
  restaurantName: string;
  address?: string;
  dateTime?: string;
  billNumber?: string;
  currency: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  serviceCharge: number;
  serviceChargeRate: number;
  receiptTotal: number;
  grandTotal: number;
  receiptImagePreviewUrl?: string;
}

export interface ReceiptItem {
  id: number;
  name: string;
  qtyDescription: string;
  price: number;
  isShared?: boolean;
  assignedTo: string;
  assignedCount?: string;
}

export interface DinerShare {
  name: string;
  initial: string;
  description: string;
  amount: number;
  isPaid?: boolean;
  status?: 'Paid' | 'Pending';
}

export interface BillSummary {
  restaurantName: string;
  isVerified: boolean;
  location: string;
  billNumber: string;
  companionsCount: number;
  subtotal: number;
  gst: number;
  gstRate: number;
  serviceCharge: number;
  serviceChargeRate: number;
  grandTotal: number;
}

