import React, { useState } from 'react';
import { Edit2, Trash2, Check, Crown, User } from 'lucide-react';
import { DiningCompanion } from '@/types';
import { useBill, AVATAR_COLOR_PALETTE } from '@/context/BillContext';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';

interface PersonCardProps {
  person: DiningCompanion;
  onAlert?: (msg: string) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onAlert }) => {
  const { updatePerson, removePerson, setOrganizer } = useBill();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [editColor, setEditColor] = useState(person.avatarColor);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;

    updatePerson(person.id, {
      name: trimmed,
      avatarColor: editColor,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(person.name);
    setEditColor(person.avatarColor);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const res = removePerson(person.id);
    if (!res.success && res.reason && onAlert) {
      onAlert(res.reason);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border-2 border-[#0D766E]/40 shadow-sm flex flex-col gap-4 animate-fadeIn"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            {/* Live Avatar Preview */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: editColor }}
            >
              {getInitials(editName)}
            </div>

            <div className="flex-1">
              <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                Companion Name
              </label>
              <input
                type="text"
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-3 py-2 bg-white border border-charcoal-200 rounded-xl text-xs sm:text-sm font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-[#0D766E]/20 focus:border-[#0D766E]"
              />
            </div>
          </div>

          {/* Organizer Toggle Button */}
          {!person.isOrganizer && (
            <button
              type="button"
              onClick={() => setOrganizer(person.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-charcoal-50 border border-charcoal-200 text-xs font-semibold text-charcoal-700 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Make Organizer</span>
            </button>
          )}
        </div>

        {/* Avatar Color Picker Palette */}
        <div>
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-2">
            Avatar Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {AVATAR_COLOR_PALETTE.map((color) => {
              const isSelected = editColor === color.value;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setEditColor(color.value)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-offset-2 ring-[#0D766E] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-200/60">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!editName.trim()}
            className="bg-[#0D766E] hover:bg-[#0B615A] text-xs font-bold px-4"
          >
            Save Changes
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-charcoal-200/90 shadow-[0_2px_6px_0_rgba(15,23,42,0.03)] hover:shadow-soft hover:border-brand-200 transition-all flex items-center justify-between gap-3 group">
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Avatar Circle */}
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm sm:text-base text-white shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
          style={{ backgroundColor: person.avatarColor }}
        >
          {getInitials(person.name)}
        </div>

        {/* Name & Badge */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-charcoal-900 truncate">
              {person.name}
            </span>

            {person.isOrganizer ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80">
                <Crown className="w-3 h-3 text-[#0D766E]" />
                Organizer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-charcoal-100 text-charcoal-600">
                <User className="w-3 h-3 text-charcoal-400" />
                Member
              </span>
            )}
          </div>
          <span className="text-xs text-charcoal-500 font-medium block mt-0.5">
            {person.isOrganizer ? 'Responsible for splitting bill' : 'Splits assigned items'}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setEditName(person.name);
            setEditColor(person.avatarColor);
            setIsEditing(true);
          }}
          className="p-2 rounded-xl text-charcoal-500 hover:text-[#0D766E] hover:bg-[#E6F4EA] transition-colors cursor-pointer"
          title="Edit companion"
          aria-label={`Edit ${person.name}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title={person.isOrganizer ? "Organizer" : 'Remove companion'}
          aria-label={`Remove ${person.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
