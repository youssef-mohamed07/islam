'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Loader2 } from 'lucide-react';

interface SeerahEvent {
  id: string;
  title: string;
  dateHijri: string;
  dateGregorian: string;
  location: string;
  category: string;
  description: string;
  isMajor: boolean;
}

export const SeerahTimeline: React.FC = () => {
  const [selectedEra, setSelectedEra] = useState('الكل');
  const [events, setEvents] = useState<SeerahEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const eras = ['الكل', 'العهد المكي المبكر', 'الهجرة', 'العهد المدني', 'الفتوحات والسرايا'];

  useEffect(() => {
    let isMounted = true;
    
    fetch('/data/seerah.json')
      .then(res => res.json())
      .then(data => {
        if (isMounted) setEvents(data);
      })
      .catch(err => console.error("Failed to load seerah events", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, []);

  const filteredEvents = events.filter(e => {
    const eraMatch = selectedEra === 'الكل' || e.category === selectedEra;
    const locMatch = !selectedLocation || (e.location && (e.location.includes(selectedLocation) || selectedLocation.includes(e.location)));
    return eraMatch && locMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Banner */}
      <div className="bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-[#F5F7F6]">
                السيرة النبوية والتاريخ الإسلامي
              </h1>
              <span className="hidden sm:inline-block bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                الخط الزمني التفاعلي
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              جدول زمني يوثق أحداث السيرة الشريفة والغزوات والهجرة النبوية ببيانات حقيقية كاملة
            </p>
          </div>
        </div>

        {/* Filter Eras */}
        <div className="mt-4 pt-3 sm:mt-6 sm:pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar">
          {eras.map((era) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedEra === era
                  ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-gray-950 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>



      {/* Timeline Stream */}
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-500 font-bold">جاري تحميل أحداث السيرة العطرة...</p>
        </div>
      ) : (
        <div className="relative border-r-2 border-[#0F382C]/20 dark:border-[#C5A059]/30 mr-4 sm:mr-8 pr-6 sm:pr-10 space-y-4 sm:space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative group">
              
              {/* Timeline Dot Badge */}
              <div className={`absolute -right-[31px] sm:-right-[47px] top-1.5 w-6 h-6 rounded-full border-4 border-[#FDFBF7] dark:border-[#0D1412] shadow-md flex items-center justify-center text-white text-[10px] font-bold ${event.isMajor ? 'bg-[#C5A059]' : 'bg-[#0F382C]'}`}>
                {index + 1}
              </div>

              {/* Event Card */}
              <div className={`bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border ${event.isMajor ? 'border-[#C5A059]/50' : 'border-gray-200/80 dark:border-gray-800'} hover:border-[#0F382C]/40 transition-all`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
                  <span className="bg-[#C5A059]/20 text-amber-900 dark:text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-500 font-mono">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 ml-1 text-[#C5A059]" />
                      {event.dateHijri} ({event.dateGregorian})
                    </span>
                    {event.location && (
                      <button 
                        onClick={() => setSelectedLocation(event.location)}
                        className="flex items-center hover:text-emerald-700 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                        {event.location}
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#0F382C] dark:text-white mb-2">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-quran leading-[2] my-3 bg-gray-50 dark:bg-[#0D1412] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-justify">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-center py-10 text-gray-500 font-bold">
              لا توجد أحداث في هذه الحقبة.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
