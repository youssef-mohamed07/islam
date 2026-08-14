'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Radio, HeartPulse, Compass } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const items = [
    { id: 'home', label: 'الرئيسية', icon: Home, href: '/' },
    { id: 'quran', label: 'القرآن', icon: BookOpen, href: '/quran' },
    { id: 'radio', label: 'الراديو', icon: Radio, href: '/radio' },
    { id: 'adhkar', label: 'الأذكار', icon: HeartPulse, href: '/adhkar' },
    { id: 'tools', label: 'الأدوات', icon: Compass, href: '/tools' },
  ];

  return (
    <div className="lg:hidden sticky bottom-0 z-30 bg-white/90 dark:bg-[#0D1412]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-[env(safe-area-inset-bottom)] pt-1.5 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-11 transition-all duration-300 ${
                isActive ? 'text-[#0F382C] dark:text-[#C5A059]' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
