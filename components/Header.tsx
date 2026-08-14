'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Moon, Sun, User, Menu, X } from 'lucide-react';
import { ar } from '@/lib/i18n';
import { useShell } from './AudioContext';
import { VoiceAssistant } from './VoiceAssistant';

export const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openSearch } = useShell();

  const t = ar;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'home', label: t.nav.home, href: '/' },
    { id: 'quran', label: t.nav.quran, href: '/quran' },
    { id: 'qiraat', label: t.nav.qiraat, href: '/qiraat' },
    { id: 'tafsir', label: t.nav.tafsir, href: '/tafsir' },
    { id: 'hadith', label: t.nav.hadith, href: '/hadith' },
    { id: 'adhkar', label: t.nav.adhkar, href: '/adhkar' },
    { id: 'fiqh', label: t.nav.fiqh, href: '/fiqh' },
    { id: 'seerah', label: t.nav.seerah, href: '/seerah' },
    { id: 'radio', label: 'الراديو', href: '/radio' },
    { id: 'calendar', label: 'التقويم', href: '/calendar' },
    { id: 'names', label: 'أسماء الله', href: '/names' },
    { id: 'scholars', label: t.nav.scholars, href: '/scholars' },
    { id: 'tools', label: t.nav.tools, href: '/tools' },
    { id: 'zakat', label: 'حاسبة الزكاة', href: '/zakat' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#0D1412]/90 backdrop-blur-md border-b border-[#0F382C]/10 dark:border-[#C5A059]/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 space-x-reverse cursor-pointer">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-md border border-[#C5A059]/30">
              <Image src="/logo.jpg" alt="خير سند" fill sizes="(max-width: 768px) 100vw, 50px" className="object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#0F382C] dark:text-[#F5F7F6]">
                  خير سند
                </span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] font-medium border border-[#C5A059]/30">
                  سَنَدٌ مُحَقَّقٌ
                </span>
              </div>
              <p className="text-[11px] text-[#2A5C4D] dark:text-gray-400 hidden md:block">
                {t.brand.motto}
              </p>
            </div>
          </Link>

          {/* Search Trigger Button */}
          <button
            onClick={openSearch}
            className="hidden md:flex items-center space-x-3 space-x-reverse bg-white dark:bg-[#141C19] border border-[#0F382C]/15 dark:border-gray-800 rounded-full px-5 py-2.5 shadow-soft hover:border-[#0F382C]/40 text-[#2A5C4D] dark:text-gray-300 text-sm transition-all group w-72"
          >
            <Search className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
            <span className="flex-1 text-right text-gray-500 dark:text-gray-400">
              {t.search.placeholder}
            </span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 rounded text-gray-400 border border-gray-200 dark:border-gray-700">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-3 space-x-reverse">

            {/* Voice assistant — mic docked with the header controls */}
            <VoiceAssistant />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg text-[#0F382C] dark:text-gray-300 hover:bg-[#0F382C]/5 dark:hover:bg-gray-800 transition-colors"
              title="تغيير المظهر"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#C5A059]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0F382C]" />
              )}
            </button>

            {/* Account Button */}
            <Link
              href="/account"
              className="flex items-center space-x-2 space-x-reverse bg-[#0F382C] text-white dark:bg-[#164E3D] hover:bg-[#164E3D] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <User className="w-4 h-4 text-[#C5A059]" />
              <span>{t.nav.account}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2 space-x-reverse">
            <button
              onClick={openSearch}
              className="p-2 rounded-lg text-[#0F382C] dark:text-gray-300 bg-[#0F382C]/5"
            >
              <Search className="w-5 h-5 text-[#0F382C] dark:text-[#C5A059]" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F382C] dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Sub-Header Navigation Bar (Desktop Only) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#0F382C]/5 dark:border-gray-800 py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 space-x-reverse">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1 space-x-reverse ${
                    active
                      ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-gray-950 font-bold shadow-sm'
                      : 'text-[#2A5C4D] dark:text-gray-300 hover:bg-[#0F382C]/5 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Full Screen Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs text-right font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#0F382C] text-white font-bold'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
