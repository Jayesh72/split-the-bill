import React from 'react';
import { UploadCloud, Camera, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputMethod = 'upload' | 'photo' | 'manual';

interface InputMethodTabsProps {
  selectedMethod: InputMethod;
  onSelectMethod: (method: InputMethod) => void;
}

export const InputMethodTabs: React.FC<InputMethodTabsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const tabs = [
    {
      id: 'upload' as InputMethod,
      title: 'Upload Bill',
      subtitle: 'PDF, Images or Camera',
      icon: <UploadCloud className="w-5 h-5" />,
    },
    {
      id: 'photo' as InputMethod,
      title: 'Take Photo',
      subtitle: 'Direct Phone / Webcam',
      icon: <Camera className="w-5 h-5" />,
    },
    {
      id: 'manual' as InputMethod,
      title: 'Enter Manually',
      subtitle: 'Add Items & custom totals',
      icon: <FileEdit className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {tabs.map((tab) => {
        const isSelected = selectedMethod === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMethod(tab.id)}
            className={cn(
              'flex items-center gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 text-left cursor-pointer border',
              isSelected
                ? 'bg-white border-[#0D766E]/40 shadow-[0_8px_24px_-4px_rgba(13,118,110,0.12),0_2px_6px_0_rgba(15,23,42,0.04)] ring-1 ring-[#0D766E]/20'
                : 'bg-white/70 border-charcoal-200/80 hover:bg-white hover:border-charcoal-300 shadow-sm'
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors',
                isSelected
                  ? 'bg-[#E6F4EA] text-[#0D766E] border border-[#A7F3D0]/80'
                  : 'bg-charcoal-100 text-charcoal-600'
              )}
            >
              {tab.icon}
            </div>

            {/* Content */}
            <div>
              <div
                className={cn(
                  'text-sm font-bold tracking-tight',
                  isSelected ? 'text-[#0D766E]' : 'text-charcoal-800'
                )}
              >
                {tab.title}
              </div>
              <div className="text-[11px] text-charcoal-500 font-medium mt-0.5">
                {tab.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
