import React, { useState } from 'react';
import { Plus, Trash2, Minus, Utensils } from 'lucide-react';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';

export const ExtractedItemsTable: React.FC = () => {
  const { bill, updateItem, addItem, deleteItem } = useBill();
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isAddingInline, setIsAddingInline] = useState(false);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const priceNum = parseFloat(newItemPrice) || 0;
    addItem(newItemName.trim(), 1, priceNum);
    setNewItemName('');
    setNewItemPrice('');
    setIsAddingInline(false);
  };

  const formatCurrency = (val: number) => {
    return `${bill.currency}${val.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-charcoal-200/90">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 text-[#0D766E]" />
          <h2 className="text-base sm:text-lg font-bold text-charcoal-900">
            Extracted Line Items
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/70">
            {bill.items.length} items
          </span>
        </div>

        {!isAddingInline && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingInline(true)}
            className="text-xs font-bold text-[#0D766E] border-[#0D766E]/30 hover:bg-[#E6F4EA] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Item</span>
          </Button>
        )}
      </div>

      {/* Inline Add Item Form */}
      {isAddingInline && (
        <form
          onSubmit={handleAddNew}
          className="my-4 p-4 rounded-2xl bg-[#F8FAFC] border border-charcoal-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fadeIn"
        >
          <div className="flex-1">
            <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
              Item Name
            </label>
            <input
              type="text"
              autoFocus
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Masala Dosa"
              className="w-full px-3 py-2 bg-white border border-charcoal-200 rounded-xl text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 focus:border-[#0D766E]"
            />
          </div>

          <div className="w-full sm:w-36">
            <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
              Price ({bill.currency})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 text-xs font-bold">
                {bill.currency}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="150.00"
                className="w-full pl-7 pr-3 py-2 bg-white border border-charcoal-200 rounded-xl text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 focus:border-[#0D766E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-4">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#0D766E] hover:bg-[#0B615A] text-xs font-bold flex-1 sm:flex-initial"
            >
              Add
            </Button>
            <button
              type="button"
              onClick={() => setIsAddingInline(false)}
              className="px-3 py-2 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Items Table / List */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="border-b border-charcoal-100 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">
              <th className="py-3 px-3 w-10">#</th>
              <th className="py-3 px-3">Item Name</th>
              <th className="py-3 px-3 w-32 text-center">Qty</th>
              <th className="py-3 px-3 w-32 text-right">Unit Price</th>
              <th className="py-3 px-3 w-28 text-right">Total</th>
              <th className="py-3 px-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100 text-xs font-medium">
            {bill.items.map((item, idx) => (
              <tr
                key={item.id}
                className="hover:bg-[#F8FAFC]/80 transition-colors group"
              >
                {/* # Index */}
                <td className="py-3.5 px-3 font-bold text-charcoal-400">
                  <span className="w-6 h-6 rounded-full bg-charcoal-100 flex items-center justify-center text-[11px] font-bold text-charcoal-600">
                    {idx + 1}
                  </span>
                </td>

                {/* Editable Item Name */}
                <td className="py-3.5 px-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full font-bold text-charcoal-900 bg-transparent hover:bg-white focus:bg-white px-2 py-1.5 rounded-lg border border-transparent hover:border-charcoal-200 focus:border-[#0D766E] focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 transition-all text-xs sm:text-sm"
                    aria-label={`Item ${idx + 1} name`}
                  />
                </td>

                {/* Editable Qty with Stepper */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center justify-center gap-1 bg-white border border-charcoal-200 rounded-xl p-1 shadow-sm w-fit mx-auto">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { qty: Math.max(1, item.qty - 1) })}
                      disabled={item.qty <= 1}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-charcoal-500 hover:bg-charcoal-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-charcoal-900 text-xs">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, { qty: item.qty + 1 })}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-charcoal-500 hover:bg-charcoal-100 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Editable Unit Price */}
                <td className="py-3.5 px-3 text-right">
                  <div className="relative inline-block w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 font-bold text-xs">
                      {bill.currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unitPrice: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="w-full text-right font-bold text-charcoal-800 bg-transparent hover:bg-white focus:bg-white pl-6 pr-2 py-1.5 rounded-lg border border-transparent hover:border-charcoal-200 focus:border-[#0D766E] focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 transition-all text-xs"
                      aria-label={`Item ${idx + 1} unit price`}
                    />
                  </div>
                </td>

                {/* Calculated Total Price */}
                <td className="py-3.5 px-3 text-right font-extrabold text-charcoal-900 text-xs sm:text-sm">
                  {formatCurrency(item.totalPrice)}
                </td>

                {/* Delete Action */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {bill.items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-charcoal-400">
                  <p className="text-xs font-semibold mb-2">No items in the bill</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingInline(true)}
                    className="text-xs font-bold text-[#0D766E]"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Item
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Quick Summary & Add Trigger */}
      <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setIsAddingInline(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D766E] hover:text-[#0B615A] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add another item</span>
        </button>

        <div className="text-right">
          <span className="text-charcoal-500 font-medium mr-2">Items Subtotal:</span>
          <span className="font-extrabold text-charcoal-900 text-sm">
            {formatCurrency(bill.subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
