/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Bill, BillItem } from '@/types';
import { ExtractedReceiptData } from '@/lib/gemini';

interface BillContextType {
  bill: Bill;
  setBill: React.Dispatch<React.SetStateAction<Bill>>;
  updateItem: (id: string | number, updates: Partial<Omit<BillItem, 'id' | 'totalPrice'>>) => void;
  addItem: (name?: string, qty?: number, unitPrice?: number) => void;
  deleteItem: (id: string | number) => void;
  setTaxRate: (rate: number) => void;
  setServiceChargeRate: (rate: number) => void;
  setBillFromOCR: (data: ExtractedReceiptData, imagePreviewUrl?: string) => void;
  resetToDemoBill: () => void;
  isTotalsMatching: boolean;
  totalsDiff: number;
}

export const DEMO_BILL: Bill = {
  id: 'demo-olive-table',
  restaurantName: 'The Olive Table',
  address: '100ft Road, Indiranagar, Bengaluru',
  dateTime: 'Sep 7, 2026 • 9:42 PM',
  billNumber: '#IND-89241',
  currency: '₹',
  items: [
    {
      id: '1',
      name: 'Butter Chicken',
      qty: 1,
      unitPrice: 420.0,
      totalPrice: 420.0,
      isShared: false,
    },
    {
      id: '2',
      name: 'Garlic Naan',
      qty: 2,
      unitPrice: 90.0,
      totalPrice: 180.0,
      isShared: true,
    },
    {
      id: '3',
      name: 'Paneer Tikka',
      qty: 1,
      unitPrice: 360.0,
      totalPrice: 360.0,
      isShared: false,
    },
    {
      id: '4',
      name: 'Coke',
      qty: 2,
      unitPrice: 40.0,
      totalPrice: 80.0,
      isShared: true,
    },
    {
      id: '5',
      name: 'Dal Makhani',
      qty: 1,
      unitPrice: 320.0,
      totalPrice: 320.0,
      isShared: false,
    },
    {
      id: '6',
      name: 'Gulab Jamun',
      qty: 1,
      unitPrice: 240.0,
      totalPrice: 240.0,
      isShared: false,
    },
  ],
  subtotal: 1600.0,
  tax: 288.0,
  taxRate: 18,
  serviceCharge: 160.0,
  serviceChargeRate: 10,
  receiptTotal: 2048.0,
  grandTotal: 2048.0,
};

const BillContext = createContext<BillContextType | undefined>(undefined);

function recalculateBill(bill: Bill): Bill {
  const calculatedItems = bill.items.map((item) => ({
    ...item,
    qty: Math.max(1, Number(item.qty) || 1),
    unitPrice: Math.max(0, Number(item.unitPrice) || 0),
    totalPrice: Math.round((Math.max(1, Number(item.qty) || 1) * Math.max(0, Number(item.unitPrice) || 0)) * 100) / 100,
  }));

  const subtotal = Math.round(calculatedItems.reduce((sum, item) => sum + item.totalPrice, 0) * 100) / 100;
  const tax = Math.round((subtotal * (bill.taxRate / 100)) * 100) / 100;
  const serviceCharge = Math.round((subtotal * (bill.serviceChargeRate / 100)) * 100) / 100;
  const grandTotal = Math.round((subtotal + tax + serviceCharge) * 100) / 100;

  return {
    ...bill,
    items: calculatedItems,
    subtotal,
    tax,
    serviceCharge,
    grandTotal,
  };
}

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bill, setBill] = useState<Bill>(() => recalculateBill(DEMO_BILL));

  const updateItem = useCallback((id: string | number, updates: Partial<Omit<BillItem, 'id' | 'totalPrice'>>) => {
    setBill((prevBill) => {
      const updatedItems = prevBill.items.map((item) => {
        if (item.id === id) {
          const newQty = updates.qty !== undefined ? updates.qty : item.qty;
          const newUnitPrice = updates.unitPrice !== undefined ? updates.unitPrice : item.unitPrice;
          const newName = updates.name !== undefined ? updates.name : item.name;
          const newIsShared = updates.isShared !== undefined ? updates.isShared : item.isShared;

          return {
            ...item,
            name: newName,
            qty: newQty,
            unitPrice: newUnitPrice,
            totalPrice: Math.round(newQty * newUnitPrice * 100) / 100,
            isShared: newIsShared,
          };
        }
        return item;
      });

      return recalculateBill({
        ...prevBill,
        items: updatedItems,
      });
    });
  }, []);

  const addItem = useCallback((name = 'New Dish', qty = 1, unitPrice = 100.0) => {
    setBill((prevBill) => {
      const newItem: BillItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        qty,
        unitPrice,
        totalPrice: Math.round(qty * unitPrice * 100) / 100,
        isShared: false,
      };

      return recalculateBill({
        ...prevBill,
        items: [...prevBill.items, newItem],
      });
    });
  }, []);

  const deleteItem = useCallback((id: string | number) => {
    setBill((prevBill) => {
      const filteredItems = prevBill.items.filter((item) => item.id !== id);
      return recalculateBill({
        ...prevBill,
        items: filteredItems,
      });
    });
  }, []);

  const setTaxRate = useCallback((rate: number) => {
    setBill((prevBill) => recalculateBill({ ...prevBill, taxRate: rate }));
  }, []);

  const setServiceChargeRate = useCallback((rate: number) => {
    setBill((prevBill) => recalculateBill({ ...prevBill, serviceChargeRate: rate }));
  }, []);

  const setBillFromOCR = useCallback((data: ExtractedReceiptData, imagePreviewUrl?: string) => {
    const mappedItems: BillItem[] = (data.items || []).map((item, idx) => {
      const qty = item.qty || 1;
      const unitPrice = qty > 1 ? item.price / qty : item.price;
      return {
        id: `ocr-${idx + 1}`,
        name: item.name || `Item ${idx + 1}`,
        qty,
        unitPrice: Math.round(unitPrice * 100) / 100,
        totalPrice: Math.round(item.price * 100) / 100,
        isShared: item.isShared || false,
      };
    });

    const taxRate = data.gstRate !== undefined ? data.gstRate : 5;
    const serviceChargeRate = data.serviceChargeRate !== undefined ? data.serviceChargeRate : 10;
    const receiptTotal = data.grandTotal || data.subtotal || 0;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      restaurantName: data.restaurantName || 'Restaurant Receipt',
      address: data.location || 'Local Restaurant',
      dateTime: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      billNumber: data.billNumber || `#REC-${Math.floor(10000 + Math.random() * 90000)}`,
      currency: data.currency || '₹',
      items: mappedItems,
      subtotal: data.subtotal || mappedItems.reduce((acc, it) => acc + it.totalPrice, 0),
      tax: data.gst || 0,
      taxRate,
      serviceCharge: data.serviceCharge || 0,
      serviceChargeRate,
      receiptTotal,
      grandTotal: receiptTotal,
      receiptImagePreviewUrl: imagePreviewUrl,
    };

    setBill(recalculateBill(newBill));
  }, []);

  const resetToDemoBill = useCallback(() => {
    setBill(recalculateBill(DEMO_BILL));
  }, []);

  const totalsDiff = useMemo(() => {
    return Math.round((bill.grandTotal - bill.receiptTotal) * 100) / 100;
  }, [bill.grandTotal, bill.receiptTotal]);

  const isTotalsMatching = useMemo(() => {
    return Math.abs(totalsDiff) < 0.5;
  }, [totalsDiff]);

  return (
    <BillContext.Provider
      value={{
        bill,
        setBill,
        updateItem,
        addItem,
        deleteItem,
        setTaxRate,
        setServiceChargeRate,
        setBillFromOCR,
        resetToDemoBill,
        isTotalsMatching,
        totalsDiff,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBill = (): BillContextType => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};
