'use client';

import React from 'react';
import { AudioProvider, useShell } from '@/components/AudioContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { SearchModal } from '@/components/SearchModal';
import { AudioPlayer } from '@/components/AudioPlayer';

function Shell({ children }: { children: React.ReactNode }) {
  const { currentTrack, closeAudio, isSearchOpen, closeSearch } = useShell();

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1412] text-[#1A2421] dark:text-[#F5F7F6] font-arabic flex flex-col">

      {/* Header */}
      <Header />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Route Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-[#162621] border-t border-gray-200 dark:border-[#C5A059]/10 text-center py-6 sm:py-8 mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 space-y-3 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/developer.jpg" alt="Youssef Mohamed" className="w-10 h-10 rounded-full border-2 border-[#0F382C] dark:border-[#C5A059] shadow-sm object-cover" />
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              تم التطوير بواسطة{' '}
              <a
                href="https://www.youssefmohamed.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F382C] dark:text-[#C5A059] font-bold hover:underline transition-all"
              >
                Youssef Mohamed
              </a>
            </p>
          </div>
          <p className="text-xs sm:text-sm font-quran text-[#0F382C] dark:text-[#C5A059]/70 leading-relaxed max-w-2xl mx-auto">
            "اللهم اجعله عملاً صالحاً، واجعله لوجهك خالصاً، ولا تجعل لأحدٍ فيه شيئاً، وانفع به الإسلام والمسلمين"
          </p>
        </div>
      </footer>

      {/* Sticky Audio Player Bar */}
      <AudioPlayer currentTrack={currentTrack} onClose={closeAudio} />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <Shell>{children}</Shell>
    </AudioProvider>
  );
}
