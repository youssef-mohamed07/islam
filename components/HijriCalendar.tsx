import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Moon, ChevronRight, ChevronLeft, Info, Star, Loader2 } from 'lucide-react';

interface DayData {
  gregorian: {
    day: string;
    weekday: { en: string };
    month: { en: string; number: number };
    year: string;
  };
  hijri: {
    day: string;
    month: { ar: string; en: string; number: number };
    year: string;
    holidays: string[];
  };
}

export function HijriCalendar() {
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track current Hijri month/year instead of Gregorian
  const [currentHijri, setCurrentHijri] = useState<{ month: number; year: number } | null>(null);

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  // 1. On Mount: Get today's Hijri month & year to initialize
  useEffect(() => {
    const initTodayHijri = async () => {
      try {
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
        const data = await res.json();
        
        if (data.code === 200) {
          setCurrentHijri({
            month: data.data.hijri.month.number,
            year: parseInt(data.data.hijri.year)
          });
        }
      } catch (error) {
        console.error('Failed to init Hijri date', error);
      }
    };
    initTodayHijri();
  }, []);

  // 2. Fetch the whole Hijri month when currentHijri changes
  useEffect(() => {
    if (!currentHijri) return;

    const fetchMonthData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${currentHijri.month}/${currentHijri.year}`);
        const data = await res.json();
        
        if (data.code === 200) {
          const days = data.data.map((item: any) => ({
            gregorian: item.gregorian,
            hijri: item.hijri,
          }));
          setCalendarData(days);
        }
      } catch (error) {
        console.error('Failed to fetch hijri calendar', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthData();
  }, [currentHijri]);

  const nextMonth = () => {
    if (!currentHijri) return;
    let nextM = currentHijri.month + 1;
    let nextY = currentHijri.year;
    if (nextM > 12) {
      nextM = 1;
      nextY++;
    }
    setCurrentHijri({ month: nextM, year: nextY });
  };

  const prevMonth = () => {
    if (!currentHijri) return;
    let prevM = currentHijri.month - 1;
    let prevY = currentHijri.year;
    if (prevM < 1) {
      prevM = 12;
      prevY--;
    }
    setCurrentHijri({ month: prevM, year: prevY });
  };

  const goToEvent = (eventName: string, hijriMonth: number) => {
    if (!currentHijri) return;
    setCurrentHijri({ month: hijriMonth, year: currentHijri.year });
  };

  const isFastingDay = (hijriDay: number, hijriMonth: number, weekdayEn: string) => {
    const reasons = [];
    if (hijriMonth === 9) reasons.push("صيام فرض (رمضان)");
    
    if (hijriDay === 13 || hijriDay === 14 || hijriDay === 15) {
      if (!(hijriMonth === 12 && hijriDay === 13)) {
        reasons.push("الأيام البيض");
      }
    }
    
    if (weekdayEn === "Monday") reasons.push("يوم الإثنين");
    if (weekdayEn === "Thursday") reasons.push("يوم الخميس");
    if (hijriMonth === 1 && hijriDay === 9) reasons.push("تاسوعاء");
    if (hijriMonth === 1 && hijriDay === 10) reasons.push("عاشوراء");
    if (hijriMonth === 12 && hijriDay === 9) reasons.push("يوم عرفة");

    if ((hijriMonth === 10 && hijriDay === 1) || (hijriMonth === 12 && (hijriDay >= 10 && hijriDay <= 13))) {
      return { isFasting: false, reasons: ["يوم عيد/تشريق (يحرم الصيام)"], forbidden: true };
    }

    return {
      isFasting: reasons.length > 0,
      reasons
    };
  };

  const getIslamicEvents = () => {
    return [
      { name: "رأس السنة الهجرية", month: 1, day: 1, dateStr: "1 محرم" },
      { name: "عاشوراء", month: 1, day: 10, dateStr: "10 محرم" },
      { name: "الإسراء والمعراج", month: 7, day: 27, dateStr: "27 رجب" },
      { name: "النصف من شعبان", month: 8, day: 15, dateStr: "15 شعبان" },
      { name: "بداية شهر رمضان", month: 9, day: 1, dateStr: "1 رمضان" },
      { name: "عيد الفطر", month: 10, day: 1, dateStr: "1 شوال" },
      { name: "يوم عرفة", month: 12, day: 9, dateStr: "9 ذو الحجة" },
      { name: "عيد الأضحى", month: 12, day: 10, dateStr: "10 ذو الحجة" },
    ];
  };

  const getDayOfWeekIndex = (dateString: string) => {
    const [d, m, y] = dateString.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getDay();
  };

  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const gregorianMonthsAr = [
    '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const renderGrid = () => {
    if (calendarData.length === 0) return null;

    const firstDayIndex = getDayOfWeekIndex(`${calendarData[0].gregorian.day}-${calendarData[0].gregorian.month.number}-${calendarData[0].gregorian.year}`);
    const blanks = Array(firstDayIndex).fill(null);
    
    // Get the dominant Gregorian month for the header using Arabic names
    const gregorianMonths = Array.from(new Set(calendarData.map(d => gregorianMonthsAr[d.gregorian.month.number])));
    const gregorianYear = calendarData[15]?.gregorian.year;
    const gregorianMonthDisplay = gregorianMonths.join(' / ');
    
    return (
      <div className="bg-white dark:bg-[#162621] rounded-2xl p-5 sm:p-8 shadow-soft border border-gray-200/80 dark:border-gray-800 mb-8 max-w-4xl mx-auto">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <button onClick={prevMonth} className="p-2 sm:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0F382C] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors border border-gray-200/50 dark:border-gray-700">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center space-x-2 space-x-reverse bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full mb-2">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400">
                {gregorianMonthDisplay} {gregorianYear} م
              </span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-white font-quran">
              {calendarData[0]?.hijri.month.ar} {calendarData[0]?.hijri.year}
            </h3>
          </div>

          <button onClick={nextMonth} className="p-2 sm:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#0F382C] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors border border-gray-200/50 dark:border-gray-700">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6 text-[10px] sm:text-xs font-medium">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#0F382C] shadow-sm"></div> 
            <span className="text-gray-600 dark:text-gray-400">تاريخ اليوم</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800"></div> 
            <span className="text-gray-600 dark:text-gray-400">أيام الصيام</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800"></div> 
            <span className="text-gray-600 dark:text-gray-400">منهي عن صيامها</span>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid gap-1 sm:gap-2 mb-2" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square rounded-xl bg-transparent"></div>
          ))}
          
          {calendarData.map((dayData, i) => {
            const hDay = parseInt(dayData.hijri.day);
            const hMonth = dayData.hijri.month.number;
            const fastingInfo = isFastingDay(hDay, hMonth, dayData.gregorian.weekday.en);
            
            const isToday = `${dayData.gregorian.day}-${String(dayData.gregorian.month.number).padStart(2, '0')}-${dayData.gregorian.year}` === todayStr;
            
            let bgClass = "bg-white dark:bg-[#162621] border border-gray-100 dark:border-gray-800 hover:border-[#C5A059]/40 hover:shadow-sm";
            let textClass = "text-gray-500 dark:text-gray-400";
            let hijriTextClass = "text-[#0F382C] dark:text-white";
            let indicator = null;
            
            if (isToday) {
              bgClass = "bg-[#0F382C] border-[#0F382C] shadow-md scale-105 z-10";
              textClass = "text-emerald-100/70";
              hijriTextClass = "text-white";
            } else if (fastingInfo.forbidden) {
              bgClass = "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30";
              hijriTextClass = "text-red-700 dark:text-red-400";
            } else if (fastingInfo.isFasting) {
              bgClass = "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30";
              hijriTextClass = "text-emerald-700 dark:text-emerald-400";
              indicator = <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>;
            }

            if (dayData.hijri.holidays.length > 0 && !isToday) {
              indicator = <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 bg-[#C5A059] rounded-full"></div>;
            }

            return (
              <div 
                key={i} 
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 sm:p-2 transition-all duration-200 group cursor-pointer ${bgClass}`}
              >
                {indicator}
                
                <div className={`font-quran text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1 ${hijriTextClass}`}>
                  {hDay}
                </div>
                <div className={`text-[9px] sm:text-xs font-sans ${textClass}`}>
                  {dayData.gregorian.day}
                </div>
                
                {/* Tooltip */}
                {(fastingInfo.isFasting || dayData.hijri.holidays.length > 0) && !isToday && (
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[100px] sm:max-w-none text-center bg-gray-900 text-white text-[9px] sm:text-[10px] px-2 sm:px-3 py-1.5 rounded-lg z-30 pointer-events-none shadow-lg">
                    {dayData.hijri.holidays.length > 0 ? dayData.hijri.holidays.join('، ') : fastingInfo.reasons.join('، ')}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F382C]/10 dark:bg-[#C5A059]/10 text-[#0F382C] dark:text-[#C5A059] mb-4">
          <Moon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F382C] dark:text-white mb-2 font-quran">
          التقويم الهجري
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          تابع الأيام والشهور وأيام الصيام المستحبة والمناسبات الإسلامية
        </p>
      </div>

      {!currentHijri || loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {renderGrid()}
          
          {/* Islamic Events Section */}
          <div className="bg-white dark:bg-[#162621] rounded-2xl p-5 sm:p-8 shadow-soft border border-gray-200/80 dark:border-gray-800 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F382C] dark:text-white mb-6 flex items-center gap-3">
              <Star className="w-5 h-5 text-[#C5A059] fill-current" />
              أهم المناسبات الإسلامية
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {getIslamicEvents().map((event, index) => (
                <button 
                  key={index} 
                  onClick={() => goToEvent(event.name, event.month)}
                  className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-[#C5A059]/50 hover:shadow-sm transition-all text-right"
                >
                  <span className="font-bold text-[#0F382C] dark:text-gray-200 flex items-center gap-2">
                    {event.name}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-full">
                    {event.dateStr}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex gap-3 items-start p-4 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs sm:text-sm leading-relaxed">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                اضغط على أي مناسبة أعلاه لينتقل التقويم مباشرة إلى تاريخها لتتمكن من رؤية اليوم الذي توافقه بالميلادي ومعرفة أيام الصيام المرتبطة بها.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
