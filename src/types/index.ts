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

export interface DiningCompanion {
  id: string;
  name: string;
  avatarColor: string;
  isOrganizer: boolean;
}

export interface AvatarColorOption {
  name: string;
  value: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export interface AssignedItemShare {
  item: BillItem;
  itemTotal: number;
  assignedCount: number;
  shareAmount: number;
  isShared: boolean;
  coDinerNames: string[];
}

export interface PersonShareSummary {
  person: DiningCompanion;
  itemsCount: number;
  subtotal: number;
  taxShare: number;
  serviceChargeShare: number;
  totalShare: number;
  items: AssignedItemShare[];
}

export interface ExtractedReceiptItem {
  name: string;
  qty: number;
  price: number;
  isShared?: boolean;
}

export interface ExtractedReceiptData {
  restaurantName: string;
  location?: string;
  billNumber?: string;
  currency?: string;
  items: ExtractedReceiptItem[];
  subtotal: number;
  gst?: number;
  gstRate?: number;
  serviceCharge?: number;
  serviceChargeRate?: number;
  grandTotal: number;
}
