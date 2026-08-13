'use client';

import React from 'react';
import { Home, BookOpen, Search, HeartPulse, Compass } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearchModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  openSearchModal,
}) => {
  const items = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'القرآن', icon: BookOpen },
    { id: 'search', label: 'بحث', icon: Search, isAction: true },
    { id: 'adhkar', label: 'الأذكار', icon: HeartPulse },
    { id: 'tools', label: 'الأدوات', icon: Compass },
  ];

  return (
    <div className="lg:hidden sticky bottom-0 z-50 bg-white/80 dark:bg-[#0D1412]/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-[env(safe-area-inset-bottom)] pt-1.5 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={openSearchModal}
                className="flex flex-col items-center justify-center text-[#FDFBF7] bg-gradient-to-tr from-[#0F382C] to-[#164E3D] dark:from-[#C5A059] dark:to-[#E5C687] dark:text-[#0D1412] w-12 h-12 rounded-full shadow-lg active:scale-95 transition-transform absolute left-1/2 -translate-x-1/2 -top-6 border-4 border-white dark:border-[#0D1412]"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-11 transition-all duration-300 ${
                isActive ? 'text-[#0F382C] dark:text-[#C5A059]' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
