'use client';

import React from 'react';
import { Play, Star, Heart, BookOpen, Music } from 'lucide-react';

export const KidsSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-300 to-orange-400 p-8 rounded-[2rem] shadow-card text-center relative overflow-hidden mb-12 border-4 border-white">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Star className="w-24 h-24 text-white" />
        </div>
        <div className="absolute bottom-0 left-0 p-4 opacity-20">
          <Heart className="w-24 h-24 text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg text-4xl">
            👶
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            سند للأطفال
          </h1>
          <p className="text-orange-50 text-lg font-bold max-w-2xl mx-auto drop-shadow-sm">
            رحلة ممتعة في عالم القيم، قصص الأنبياء، وتعلم القرآن والصلاة!
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Stories */}
        <div className="bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-card transition-transform hover:-translate-y-2 border-2 border-blue-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4 shadow-inner">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">قصص الأنبياء</h3>
          <p className="text-gray-500 mb-6 font-medium">حكايات شيقة ومصورة من القرآن الكريم لتعليم القيم والأخلاق.</p>
          <button className="mt-auto bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-blue-600 transition-colors w-full flex items-center justify-center space-x-2 space-x-reverse">
            <Play className="w-5 h-5 fill-current" />
            <span>ابدأ القصة</span>
          </button>
        </div>

        {/* Wudu & Salah */}
        <div className="bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-card transition-transform hover:-translate-y-2 border-2 border-emerald-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
            <Star className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">تعلم الصلاة</h3>
          <p className="text-gray-500 mb-6 font-medium">خطوات الوضوء والصلاة بطريقة تفاعلية وممتعة للأبطال الصغار.</p>
          <button className="mt-auto bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-emerald-600 transition-colors w-full flex items-center justify-center space-x-2 space-x-reverse">
            <Play className="w-5 h-5 fill-current" />
            <span>تعلم الآن</span>
          </button>
        </div>

        {/* Quran for kids */}
        <div className="bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-card transition-transform hover:-translate-y-2 border-2 border-purple-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-4 shadow-inner">
            <Music className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">جزء عمّ</h3>
          <p className="text-gray-500 mb-6 font-medium">استمع وردد قصار السور مع الأطفال لسهولة الحفظ والمراجعة.</p>
          <button className="mt-auto bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-purple-600 transition-colors w-full flex items-center justify-center space-x-2 space-x-reverse">
            <Play className="w-5 h-5 fill-current" />
            <span>ابدأ الحفظ</span>
          </button>
        </div>

      </div>

    </div>
  );
};
