import React, { useState } from 'react';
import { UserPlus, Plus, Check, X } from 'lucide-react';
import { useBill, AVATAR_COLOR_PALETTE } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';

interface AddPersonFormProps {
  onSuccess?: () => void;
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({ onSuccess }) => {
  const { addPerson, people } = useBill();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(
    AVATAR_COLOR_PALETTE[people.length % AVATAR_COLOR_PALETTE.length].value
  );
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setName('');
    setSelectedColor(
      AVATAR_COLOR_PALETTE[people.length % AVATAR_COLOR_PALETTE.length].value
    );
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name for the companion.');
      return;
    }

    if (people.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already in this dinner group.`);
      return;
    }

    addPerson(trimmed, selectedColor);
    setName('');
    setError(null);
    setIsOpen(false);
    if (onSuccess) onSuccess();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-charcoal-300 hover:border-[#0D766E] bg-white/50 hover:bg-[#E6F4EA]/40 text-charcoal-700 hover:text-[#0D766E] transition-all flex items-center justify-center gap-2 font-bold text-xs sm:text-sm shadow-sm cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-charcoal-100 group-hover:bg-[#E6F4EA] group-hover:text-[#0D766E] text-charcoal-600 flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        <span>+ Add Dining Companion</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border-2 border-[#0D766E]/40 shadow-sm flex flex-col gap-4 animate-fadeIn"
    >
      <div className="flex items-center justify-between pb-2 border-b border-charcoal-200/80">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#0D766E]" />
          <h4 className="text-xs sm:text-sm font-bold text-charcoal-900">
            Add Dining Companion
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-200/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar Live Preview */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base text-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: selectedColor }}
        >
          {getInitials(name)}
        </div>

        <div className="flex-1 w-full">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
            Companion Name
          </label>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter name (e.g. Priya, Rahul)"
            className="w-full px-3.5 py-2.5 bg-white border border-charcoal-200 rounded-xl text-xs sm:text-sm font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 focus:border-[#0D766E]"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          {error}
        </p>
      )}

      {/* Color Picker Palette */}
      <div>
        <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-2">
          Choose Avatar Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {AVATAR_COLOR_PALETTE.map((color) => {
            const isSelected = selectedColor === color.value;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-offset-2 ring-[#0D766E] scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={`Select ${color.name} avatar color`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal-200/60">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!name.trim()}
          className="bg-[#0D766E] hover:bg-[#0B615A] text-xs font-bold px-5 cursor-pointer"
        >
          Add Person
        </Button>
      </div>
    </form>
  );
};
