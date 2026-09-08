/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Bill, BillItem, DiningCompanion, AvatarColorOption, PersonShareSummary } from '@/types';
import { ExtractedReceiptData } from '@/lib/gemini';

export const AVATAR_COLOR_PALETTE: AvatarColorOption[] = [
  { name: 'Teal', value: '#0D766E', bgClass: 'bg-[#0D766E]', borderClass: 'border-[#0D766E]', textClass: 'text-white' },
  { name: 'Blue', value: '#2563EB', bgClass: 'bg-[#2563EB]', borderClass: 'border-[#2563EB]', textClass: 'text-white' },
  { name: 'Purple', value: '#7C3AED', bgClass: 'bg-[#7C3AED]', borderClass: 'border-[#7C3AED]', textClass: 'text-white' },
  { name: 'Pink', value: '#DB2777', bgClass: 'bg-[#DB2777]', borderClass: 'border-[#DB2777]', textClass: 'text-white' },
  { name: 'Orange', value: '#EA580C', bgClass: 'bg-[#EA580C]', borderClass: 'border-[#EA580C]', textClass: 'text-white' },
  { name: 'Emerald', value: '#059669', bgClass: 'bg-[#059669]', borderClass: 'border-[#059669]', textClass: 'text-white' },
  { name: 'Amber', value: '#D97706', bgClass: 'bg-[#D97706]', borderClass: 'border-[#D97706]', textClass: 'text-white' },
  { name: 'Indigo', value: '#4F46E5', bgClass: 'bg-[#4F46E5]', borderClass: 'border-[#4F46E5]', textClass: 'text-white' },
];

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
  
  // People / Dining Companions
  people: DiningCompanion[];
  setPeople: React.Dispatch<React.SetStateAction<DiningCompanion[]>>;
  addPerson: (name: string, avatarColor?: string, isOrganizer?: boolean) => boolean;
  updatePerson: (id: string, updates: Partial<DiningCompanion>) => void;
  removePerson: (id: string) => { success: boolean; reason?: string };
  setOrganizer: (id: string) => void;
  
  // Payer (Who settled the receipt)
  payerId: string | null;
  setPayerId: (id: string | null) => void;

  // Step 4: Item Assignments (itemId -> personId[])
  assignments: Record<string | number, string[]>;
  assignItem: (itemId: string | number, personIds: string[]) => void;
  togglePersonOnItem: (itemId: string | number, personId: string) => void;
  clearItemAssignment: (itemId: string | number) => void;
  assignedItemsCount: number;
  unassignedItemsCount: number;
  isAllItemsAssigned: boolean;
  assignedAmount: number;
  unassignedAmount: number;
  personShares: PersonShareSummary[];
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
  // Clean empty people state - NO hardcoded default people
  const [people, setPeople] = useState<DiningCompanion[]>([]);
  const [payerId, setPayerId] = useState<string | null>(null);
  // Assignments state: itemId -> personId[]
  const [assignments, setAssignments] = useState<Record<string | number, string[]>>({});

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
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
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
    setAssignments({});
  }, []);

  const resetToDemoBill = useCallback(() => {
    setBill(recalculateBill(DEMO_BILL));
    setAssignments({});
  }, []);

  const totalsDiff = useMemo(() => {
    return Math.round((bill.grandTotal - bill.receiptTotal) * 100) / 100;
  }, [bill.grandTotal, bill.receiptTotal]);

  const isTotalsMatching = useMemo(() => {
    return Math.abs(totalsDiff) < 0.5;
  }, [totalsDiff]);

  // People / Dining Companions Actions
  const addPerson = useCallback((name: string, avatarColor?: string, isOrganizer = false): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    setPeople((prev) => {
      // Pick next available color from palette
      const assignedColor =
        avatarColor ||
        AVATAR_COLOR_PALETTE[prev.length % AVATAR_COLOR_PALETTE.length].value;

      const isFirst = prev.length === 0;

      const newPerson: DiningCompanion = {
        id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: trimmed,
        avatarColor: assignedColor,
        isOrganizer: isFirst ? true : isOrganizer,
      };

      // If this is the first person and no payer was selected yet, auto-select them as default payer
      if (isFirst) {
        setPayerId((currentPayer) => currentPayer || newPerson.id);
      }

      return [...prev, newPerson];
    });

    return true;
  }, []);

  const updatePerson = useCallback((id: string, updates: Partial<DiningCompanion>) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === id) {
          const updatedName = updates.name !== undefined ? updates.name.trim() : person.name;
          return {
            ...person,
            ...updates,
            name: updatedName || person.name,
          };
        }
        return person;
      })
    );
  }, []);

  const removePerson = useCallback((id: string): { success: boolean; reason?: string } => {
    let result: { success: boolean; reason?: string } = { success: true };

    setPeople((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) {
        result = { success: false, reason: 'Person not found' };
        return prev;
      }

      const remaining = prev.filter((p) => p.id !== id);

      // If removed person was the payer, reset payerId to null
      setPayerId((currentPayer) => (currentPayer === id ? null : currentPayer));

      // If the removed person was the organizer and other members remain, reassign organizer to the first remaining member
      if (target.isOrganizer && remaining.length > 0) {
        if (!remaining.some((p) => p.isOrganizer)) {
          remaining[0].isOrganizer = true;
        }
      }

      return remaining;
    });

    // Clean up assignment references to this removed person
    setAssignments((prev) => {
      const next: Record<string | number, string[]> = {};
      for (const itemId in prev) {
        const filtered = (prev[itemId] || []).filter((pid) => pid !== id);
        if (filtered.length > 0) {
          next[itemId] = filtered;
        }
      }
      return next;
    });

    return result;
  }, []);

  const setOrganizer = useCallback((id: string) => {
    setPeople((prev) =>
      prev.map((p) => ({
        ...p,
        isOrganizer: p.id === id,
      }))
    );
  }, []);

  // Step 4: Assignments Actions & Dynamic Calculations
  const assignItem = useCallback((itemId: string | number, personIds: string[]) => {
    setAssignments((prev) => ({
      ...prev,
      [itemId]: personIds,
    }));
  }, []);

  const togglePersonOnItem = useCallback((itemId: string | number, personId: string) => {
    setAssignments((prev) => {
      const current = prev[itemId] || [];
      const isAssigned = current.includes(personId);
      const updated = isAssigned
        ? current.filter((id) => id !== personId)
        : [...current, personId];
      return {
        ...prev,
        [itemId]: updated,
      };
    });
  }, []);

  const clearItemAssignment = useCallback((itemId: string | number) => {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  // Assignment Progress & Totals
  const assignedItemsCount = useMemo(() => {
    return bill.items.filter((item) => (assignments[item.id] || []).length > 0).length;
  }, [bill.items, assignments]);

  const unassignedItemsCount = useMemo(() => {
    return bill.items.length - assignedItemsCount;
  }, [bill.items.length, assignedItemsCount]);

  const isAllItemsAssigned = useMemo(() => {
    return bill.items.length > 0 && assignedItemsCount === bill.items.length;
  }, [bill.items.length, assignedItemsCount]);

  const assignedAmount = useMemo(() => {
    return Math.round(
      bill.items.reduce((sum, item) => {
        const isAssigned = (assignments[item.id] || []).length > 0;
        return isAssigned ? sum + item.totalPrice : sum;
      }, 0) * 100
    ) / 100;
  }, [bill.items, assignments]);

  const unassignedAmount = useMemo(() => {
    return Math.round(
      bill.items.reduce((sum, item) => {
        const isAssigned = (assignments[item.id] || []).length > 0;
        return isAssigned ? sum : sum + item.totalPrice;
      }, 0) * 100
    ) / 100;
  }, [bill.items, assignments]);

  // Per-person calculated shares
  const personShares = useMemo((): PersonShareSummary[] => {
    return people.map((person) => {
      let personSubtotal = 0;
      let personItemsCount = 0;

      bill.items.forEach((item) => {
        const itemDiners = assignments[item.id] || [];
        if (itemDiners.includes(person.id)) {
          personItemsCount += 1;
          const share = item.totalPrice / itemDiners.length;
          personSubtotal += share;
        }
      });

      const roundedSubtotal = Math.round(personSubtotal * 100) / 100;
      const proportion = bill.subtotal > 0 ? roundedSubtotal / bill.subtotal : 0;
      const taxShare = Math.round(bill.tax * proportion * 100) / 100;
      const serviceChargeShare = Math.round(bill.serviceCharge * proportion * 100) / 100;
      const totalShare = Math.round((roundedSubtotal + taxShare + serviceChargeShare) * 100) / 100;

      return {
        person,
        itemsCount: personItemsCount,
        subtotal: roundedSubtotal,
        taxShare,
        serviceChargeShare,
        totalShare,
      };
    });
  }, [people, bill.items, bill.subtotal, bill.tax, bill.serviceCharge, assignments]);

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
        people,
        setPeople,
        addPerson,
        updatePerson,
        removePerson,
        setOrganizer,
        payerId,
        setPayerId,
        assignments,
        assignItem,
        togglePersonOnItem,
        clearItemAssignment,
        assignedItemsCount,
        unassignedItemsCount,
        isAllItemsAssigned,
        assignedAmount,
        unassignedAmount,
        personShares,
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
