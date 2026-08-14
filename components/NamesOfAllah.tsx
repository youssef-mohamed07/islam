'use client';

import React, { useState } from 'react';
import { namesOfAllah } from '@/lib/namesOfAllahData';
import { Search } from 'lucide-react';

export function NamesOfAllah() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = namesOfAllah.filter((nameObj) =>
    nameObj.name.includes(searchTerm) || nameObj.meaning.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F382C] dark:text-white mb-2 font-quran">
          أسماء الله الحسنى
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          قال رسول الله صلى الله عليه وسلم: "إن لله تسعة وتسعين اسماً مائة إلا واحداً من أحصاها دخل الجنة"
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن اسم أو معنى..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-800 rounded-2xl py-3 px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 transition-shadow text-[#0F382C] dark:text-[#F5F7F6]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredNames.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-card hover:border-[#C5A059]/30 transition-all group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-[#0F382C]/5 dark:bg-[#C5A059]/10 flex items-center justify-center text-[#0F382C] dark:text-[#C5A059] font-bold mb-4 group-hover:scale-110 transition-transform">
              {item.id}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F382C] dark:text-white mb-2 font-quran">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.meaning}
            </p>
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          لم يتم العثور على نتائج مطابقة لبحثك.
        </div>
      )}
    </div>
  );
}
