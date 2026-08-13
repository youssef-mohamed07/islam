'use client';

import React, { useEffect, useState } from 'react';
import { Search, X, Check } from 'lucide-react';

export interface BottomSheetItem {
  id: string;
  label: string;
  sublabel?: string;
  trailing?: string;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: BottomSheetItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  items,
  selectedId,
  onSelect,
  searchable = false,
  searchPlaceholder = 'ابحث...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Reset search & lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = searchTerm
    ? items.filter((item) => item.label.includes(searchTerm) || item.sublabel?.includes(searchTerm))
    : items;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#162621] rounded-t-3xl shadow-2xl border-t border-x border-gray-200/80 dark:border-gray-700 max-h-[80vh] flex flex-col animate-[slideUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-extrabold text-[#0F382C] dark:text-[#C5A059]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        {searchable && (
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pr-10 pl-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="overflow-y-auto px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          {filteredItems.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={`w-full text-right px-4 py-3 rounded-xl mb-1 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#0F382C] text-white font-bold'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 active:bg-gray-100 dark:active:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                  {isSelected && <Check className="w-4 h-4 text-[#C5A059] shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{item.label}</div>
                    {item.sublabel && (
                      <div className={`text-[11px] truncate ${isSelected ? 'text-emerald-100/80' : 'text-gray-400'}`}>
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                </div>
                {item.trailing && (
                  <span
                    className={`text-[10px] font-mono shrink-0 mr-2 px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#C5A059] text-gray-950' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {item.trailing}
                  </span>
                )}
              </button>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="text-center text-xs text-gray-400 py-10">لا توجد نتائج</div>
          )}
        </div>
      </div>
    </div>
  );
};
