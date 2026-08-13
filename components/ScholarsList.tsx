'use client';

import React, { useState, useEffect } from 'react';
import { Search, Book, Award, Clock, Loader2, ListFilter } from 'lucide-react';

interface Scholar {
  id: string;
  nameArabic: string;
  title: string;
  birthYearAH: number;
  deathYearAH: number;
  era: string;
  biography: string;
  fieldOfExpertise: string[];
  famousWorks: string[];
}

export const ScholarsList: React.FC = () => {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('الكل');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/data/scholars.json')
      .then(res => res.json())
      .then(data => {
        if (isMounted) setScholars(data);
      })
      .catch(err => console.error("Failed to load scholars", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Extract unique specialties
  const allSpecialties = Array.from(new Set(scholars.flatMap(s => s.fieldOfExpertise)));
  const specialties = ['الكل', ...allSpecialties];

  const filteredScholars = scholars.filter(scholar => {
    const matchesSearch = scholar.nameArabic.includes(searchTerm) || scholar.biography.includes(searchTerm);
    const matchesSpecialty = selectedSpecialty === 'الكل' || scholar.fieldOfExpertise.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] p-8 rounded-3xl shadow-card text-center relative overflow-hidden mb-8 border border-[#C5A059]/30">
        <h1 className="text-4xl font-extrabold text-[#C5A059] mb-4">
          تراجم العلماء الأعلام
        </h1>
        <p className="text-emerald-100 text-sm max-w-2xl mx-auto mb-6">
          موسوعة سير أعلام النبلاء والعلماء الذين حفظوا لنا الدين وبلغوه، ببيانات تاريخية محققة.
        </p>
        
        <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3.5 w-5 h-5 text-emerald-200/60" />
            <input
              type="text"
              placeholder="ابحث عن اسم العالم أو في سيرته..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-emerald-200/60 rounded-xl py-3 px-10 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all md:w-48 appearance-none"
          >
            {specialties.map(spec => (
              <option key={spec} value={spec} className="text-gray-900">{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-500 font-bold">جاري تحميل تراجم العلماء...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholars.map((scholar) => (
            <div key={scholar.id} className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-card">
              
              <div className="flex items-start justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-xl text-[#0F382C] dark:text-white mb-1">
                    {scholar.nameArabic}
                  </h3>
                  <span className="text-[#C5A059] text-xs font-bold bg-[#C5A059]/10 px-2 py-1 rounded-md">
                    {scholar.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono bg-gray-50 dark:bg-[#0D1412] p-2 rounded-lg">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>{scholar.birthYearAH} هـ - {scholar.deathYearAH} هـ</span>
                </div>
                <span>•</span>
                <div>{scholar.era}</div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1 leading-relaxed text-justify">
                {scholar.biography}
              </p>

              <div className="space-y-3 mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <Award className="w-4 h-4 text-[#C5A059] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">التخصص:</div>
                    <div className="flex flex-wrap gap-1">
                      {scholar.fieldOfExpertise.map((field, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 space-x-reverse">
                  <Book className="w-4 h-4 text-[#C5A059] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">أشهر المؤلفات:</div>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {scholar.famousWorks.map((work, i) => (
                        <li key={i}>{work}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredScholars.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-2xl border border-gray-200/80 dark:border-gray-800 mt-6">
          <p className="text-gray-500 font-bold">لم يتم العثور على علماء متطابقين مع بحثك.</p>
        </div>
      )}

    </div>
  );
};
