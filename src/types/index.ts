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
