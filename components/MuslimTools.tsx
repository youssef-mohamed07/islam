'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Clock, Calculator, Calendar, HeartPulse, RefreshCw, MapPin } from 'lucide-react';

export const MuslimTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'prayer' | 'qibla' | 'zakat' | 'tasbeeh'>('prayer');
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState('سُبْحَانَ اللَّهِ');

  // Zakat state
  const [wealthAmount, setWealthAmount] = useState<number>(100000);
  const [goldPrice, setGoldPrice] = useState<number>(3200); // User can change this
  const nisabThreshold = 85 * goldPrice;
  const calculatedZakat = wealthAmount >= nisabThreshold ? wealthAmount * 0.025 : 0;

  // Prayer & Location State
  const [locationName, setLocationName] = useState('القاهرة، مصر (الافتراضي)');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({ lat: 30.0444, lng: 31.2357 });
  const [prayerTimes, setPrayerTimes] = useState<{ [key: string]: string }>({});
  const [hijriDate, setHijriDate] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState<number>(136); // default Cairo
  const [heading, setHeading] = useState<number | null>(null);
  const [compassPermission, setCompassPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [countdownString, setCountdownString] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleOrientation = React.useCallback((event: any) => {
    let compass = null;
    if (event.webkitCompassHeading) {
      compass = event.webkitCompassHeading;
    } else if (event.absolute && event.alpha !== null) {
      compass = 360 - event.alpha;
    } else if (event.alpha !== null) {
      compass = 360 - event.alpha;
    }
    
    if (compass !== null) {
      setHeading(compass);
    }
  }, []);

  const requestCompassPermission = async () => {
    if (typeof window !== 'undefined') {
      if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            setCompassPermission('granted');
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            setCompassPermission('denied');
          }
        } catch (error) {
          console.error('Compass permission error:', error);
          setCompassPermission('denied');
        }
      } else {
        setCompassPermission('granted');
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      }
    };
  }, [handleOrientation]);

  // Ask for location and fetch data
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async (lat: number, lng: number, locName: string) => {
      try {
        setIsLoading(true);
        // Fetch Prayer Times & Hijri
        const ts = Math.floor(Date.now() / 1000);
        const ptRes = await fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=5`);
        if (ptRes.ok) {
          const ptData = await ptRes.json();
          if (isMounted) {
            setPrayerTimes(ptData.data.timings);
            const hd = ptData.data.date.hijri;
            setHijriDate(`${hd.day} ${hd.month.ar} ${hd.year} هـ`);
          }
        }

        // Fetch Qibla
        const qRes = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
        if (qRes.ok) {
          const qData = await qRes.json();
          if (isMounted && qData.data && qData.data.direction) {
            setQiblaDirection(qData.data.direction);
          }
        }

        if (isMounted) {
          setLocationCoords({ lat, lng });
          setLocationName(locName);
        }
      } catch (err) {
        console.error('Failed to fetch Islamic tools data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          fetchData(position.coords.latitude, position.coords.longitude, 'موقعك الحالي');
        },
        (error) => {
          // Fallback to default (Cairo)
          console.warn('Geolocation denied or failed, using default');
          fetchData(30.0444, 31.2357, 'القاهرة، مصر (الافتراضي)');
        }
      );
    } else {
      fetchData(30.0444, 31.2357, 'القاهرة، مصر (الافتراضي)');
    }

    return () => { isMounted = false; };
  }, []);

  // Next Prayer Countdown Logic
  useEffect(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const prayersToConsider = [
        { key: 'Fajr', ar: 'الفجر' },
        { key: 'Sunrise', ar: 'الشروق' },
        { key: 'Dhuhr', ar: 'الظهر' },
        { key: 'Asr', ar: 'العصر' },
        { key: 'Maghrib', ar: 'المغرب' },
        { key: 'Isha', ar: 'العشاء' }
      ];

      let nextPrayer = null;
      let minDiff = Infinity;

      for (let p of prayersToConsider) {
        if (prayerTimes[p.key]) {
          const [hours, minutes] = prayerTimes[p.key].split(':').map(Number);
          const ptDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
          
          let diffMs = ptDate.getTime() - now.getTime();
          
          // If this prayer already passed today, it's for tomorrow
          if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
          }

          if (diffMs < minDiff) {
            minDiff = diffMs;
            nextPrayer = p.ar;
          }
        }
      }

      if (nextPrayer) {
        setNextPrayerName(nextPrayer);
        const h = Math.floor(minDiff / (1000 * 60 * 60));
        const m = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((minDiff % (1000 * 60)) / 1000);
        setCountdownString(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const convertTo12Hour = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const displayPrayers = [
    { key: 'Fajr', ar: 'الفجر' },
    { key: 'Sunrise', ar: 'الشروق' },
    { key: 'Dhuhr', ar: 'الظهر' },
    { key: 'Asr', ar: 'العصر' },
    { key: 'Maghrib', ar: 'المغرب' },
    { key: 'Isha', ar: 'العشاء' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-[#F5F7F6]">
                أدوات المسلم اليومية
              </h1>
              <span className="hidden sm:inline-block bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                مواقيت الصلاة • القبلة • الزكاة • التسبيح
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              مجموعة من التطبيقات والخدمات الرقمية المتصلة ببيانات حقيقية لمساعدتك في عبادتك
            </p>
          </div>
        </div>

        {/* Tools Subnav Tabs */}
        <div className="mt-4 pt-3 sm:mt-6 sm:pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar">
          {[
            { id: 'prayer', label: 'مواقيت الصلاة', icon: Clock },
            { id: 'qibla', label: 'اتجاه القبلة', icon: Compass },
            { id: 'zakat', label: 'حاسبة الزكاة', icon: Calculator },
            { id: 'tasbeeh', label: 'المسبحة الإلكترونية', icon: HeartPulse }
          ].map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 space-x-reverse ${
                  isSelected
                    ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-gray-950 shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 ml-1" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#C5A059]" />
          <p className="mt-4 text-gray-500">جاري جلب البيانات الحقيقية...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Tool View 1: Prayer Times */}
          {activeTool === 'prayer' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] text-white p-5 sm:p-8 rounded-2xl shadow-card flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 border border-[#C5A059]/30">
                <div>
                  <span className="text-xs text-[#C5A059] font-bold flex items-center">
                    <MapPin className="w-3 h-3 ml-1" />
                    {locationName}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-2">الصلاة القادمة: {nextPrayerName || '...'}</h2>
                  <p className="text-sm text-emerald-200 mt-2 font-mono text-lg">
                    متبقي على الأذان: {countdownString || '...'}
                  </p>
                </div>
                <div className="bg-[#C5A059]/20 px-6 py-4 rounded-2xl border border-[#C5A059]/40 text-center min-w-[200px]">
                  <div className="text-xs text-[#C5A059]">التاريخ الهجري (اليوم)</div>
                  <div className="text-xl font-bold font-quran text-white mt-1">{hijriDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {displayPrayers.map((p) => {
                  const isActive = nextPrayerName === p.ar;
                  return (
                    <div
                      key={p.key}
                      className={`p-5 rounded-2xl text-center border transition-all ${
                        isActive
                          ? 'bg-[#0F382C] text-white border-[#C5A059] shadow-md scale-105'
                          : 'bg-white dark:bg-[#162621] text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-gray-800'
                      }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${isActive ? 'text-[#C5A059]' : 'text-gray-500'}`}>
                        {p.ar}
                      </div>
                      <div className="text-lg font-extrabold font-mono">{convertTo12Hour(prayerTimes[p.key])}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tool View 2: Qibla Direction */}
          {activeTool === 'qibla' && (
            <div className="bg-white dark:bg-[#162621] p-6 sm:p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 text-center max-w-xl mx-auto relative overflow-hidden">
              <h2 className="text-2xl font-bold text-[#0F382C] dark:text-white mb-2">
                اتجاه القبلة الشريفة
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                بناءً على: {locationName}
              </p>

              {compassPermission !== 'granted' ? (
                <div className="flex flex-col items-center justify-center space-y-4 mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                  <Compass className="w-16 h-16 text-[#C5A059] animate-pulse drop-shadow-lg" />
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 text-center font-bold">
                    نحتاج إلى إذن استخدام بوصلة الهاتف لتحديد الاتجاه تلقائياً
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center px-4">
                    ملاحظة: تتطلب هذه الميزة اتصالاً آمناً (HTTPS) لتعمل على الهواتف.
                  </p>
                  <button 
                    onClick={requestCompassPermission}
                    className="bg-gradient-to-r from-[#0F382C] to-[#164E3D] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    تفعيل البوصلة الذكية
                  </button>
                  {compassPermission === 'denied' && (
                    <p className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">تم رفض الإذن. يرجى تفعيله من إعدادات المتصفح أو إعادة تحميل الصفحة.</p>
                  )}
                </div>
              ) : (
                <div 
                  className="relative mx-auto mb-12 flex items-center justify-center mt-12"
                  style={{ width: '280px', height: '280px', minHeight: '280px' }}
                >
                  {/* The Rotating Compass Wheel */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-emerald-900/10 dark:border-emerald-700/30 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex items-center justify-center bg-white dark:bg-[#0D1412] transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
                  >
                    {/* Tick marks around the compass */}
                    {Array.from({ length: 72 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full h-full flex justify-center items-start" 
                        style={{ transform: `rotate(${i * 5}deg)` }}
                      >
                        <div className={`w-[2px] ${i % 18 === 0 ? 'h-3 bg-[#C5A059]' : (i % 9 === 0 ? 'h-2 bg-gray-400' : 'h-1 bg-gray-200 dark:bg-gray-800')} rounded-full mt-1.5`}></div>
                      </div>
                    ))}

                    {/* North/South/East/West Markers */}
                    <div className="absolute top-5 text-xl font-bold text-red-500 font-mono drop-shadow-md">N</div>
                    <div className="absolute bottom-5 text-sm font-bold text-gray-400 font-mono">S</div>
                    <div className="absolute right-5 text-sm font-bold text-gray-400 font-mono">E</div>
                    <div className="absolute left-5 text-sm font-bold text-gray-400 font-mono">W</div>

                    {/* Qibla Indicator Needle */}
                    <div 
                      className="absolute w-full h-full flex justify-center items-start"
                      style={{ transform: `rotate(${qiblaDirection}deg)` }}
                    >
                       <div className="w-12 h-1/2 relative flex flex-col items-center justify-start z-20">
                          {/* Kaaba Icon at the tip */}
                          <div className="w-12 h-12 mt-3 bg-[#111] border-[3px] border-[#C5A059] rounded flex flex-col items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.5)] relative z-20 overflow-hidden">
                            <div className="w-full h-2.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 mb-1"></div>
                            <div className="w-4 h-4 border-t-2 border-r-2 border-[#C5A059]/80 rounded-tr-sm"></div>
                          </div>
                          
                          {/* Golden Line to center */}
                          <div className="w-1.5 flex-1 bg-gradient-to-t from-transparent via-[#C5A059] to-[#C5A059] rounded-full -mt-2 shadow-sm z-10"></div>
                       </div>
                    </div>
                  </div>
                  
                  {/* Compass Center Dot */}
                  <div className="w-8 h-8 bg-[#162621] border-[3px] border-[#C5A059] rounded-full absolute z-30 shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#C5A059] rounded-full shadow-inner"></div>
                  </div>
                  
                  {/* Fixed Phone Indicator overlaid on top (points straight up) */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-40">
                     <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-blue-500 drop-shadow-lg"></div>
                     <div className="mt-1 bg-blue-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">اتجاه الهاتف</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center items-center gap-8 mt-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">زاوية القبلة</p>
                  <p className="text-xl font-mono font-bold text-[#C5A059]">{qiblaDirection.toFixed(0)}°</p>
                </div>
                {heading !== null && (
                  <div className="text-center border-r border-gray-200 dark:border-gray-700 pr-8">
                    <p className="text-xs text-gray-500 mb-1">اتجاه هاتفك</p>
                    <p className="text-xl font-mono font-bold text-blue-500">{heading.toFixed(0)}°</p>
                  </div>
                )}
              </div>
              
              {heading !== null && (
                 (() => {
                   let diff = Math.abs(heading - qiblaDirection) % 360;
                   let distance = diff > 180 ? 360 - diff : diff;
                   if (distance < 10) {
                     return (
                       <div className="mt-6 bg-emerald-500 text-white p-4 rounded-xl font-bold animate-pulse shadow-lg shadow-emerald-500/20">
                         أنت الآن تواجه القبلة! تقبل الله صلاتك.
                       </div>
                     );
                   }
                   return null;
                 })()
              )}
            </div>
          )}

          {/* Tool View 3: Zakat Calculator */}
          {activeTool === 'zakat' && (
            <div className="bg-white dark:bg-[#162621] p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0F382C] dark:text-white mb-4 flex items-center">
                <Calculator className="w-6 h-6 ml-2 text-[#C5A059]" />
                حاسبة الزكاة الشرعية (2.5%)
              </h2>
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      سعر جرام الذهب عيار 21 اليوم (تقريبي)
                    </label>
                    <input
                      type="number"
                      value={goldPrice}
                      onChange={(e) => setGoldPrice(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-lg font-bold text-[#0F382C] dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      إجمالي الأموال والذهب المدخر (بالعملة المحلية)
                    </label>
                    <input
                      type="number"
                      value={wealthAmount}
                      onChange={(e) => setWealthAmount(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-lg font-bold text-[#0F382C] dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">نصاب الذهب الشرعي (85 جرام):</span>
                    <span className="font-bold font-mono bg-white dark:bg-[#162621] px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">{nisabThreshold.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                    {wealthAmount >= nisabThreshold ? (
                      <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-300 font-bold">
                        <span>المال بالغ للنصاب، مقدار الزكاة الواجب إخراجها:</span>
                        <span className="font-mono text-2xl text-[#C5A059]">{calculatedZakat.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="text-amber-600 dark:text-amber-400 font-bold text-center">
                        المال لم يبلغ النصاب، ولا تجب فيه الزكاة.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool View 4: Tasbeeh Counter */}
          {activeTool === 'tasbeeh' && (
            <div className="bg-white dark:bg-[#162621] p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 text-center max-w-md mx-auto">
              <div className="flex justify-center flex-wrap gap-2 mb-6">
                {['سُبْحَانَ اللَّهِ', 'الْحَمْدُ لِلَّهِ', 'اللَّهُ أَكْبَرُ', 'لاَ إِلَهَ إِلاَّ اللَّهُ', 'أستغفر الله'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDhikr(d);
                      setTasbeehCount(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDhikr === d 
                      ? 'bg-[#0F382C] text-white shadow-md' 
                      : 'bg-gray-100 dark:bg-[#0D1412] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="font-quran text-3xl sm:text-4xl font-bold text-[#0F382C] dark:text-[#C5A059] my-8 leading-normal h-16 flex items-center justify-center">
                {selectedDhikr}
              </div>

              <button
                onClick={() => setTasbeehCount((c) => c + 1)}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#0F382C] to-[#164E3D] text-[#C5A059] border-4 border-[#C5A059]/50 shadow-2xl flex flex-col items-center justify-center mx-auto hover:scale-105 active:scale-95 active:shadow-inner transition-all group relative overflow-hidden"
              >
                {/* Ripple effect overlay on click would be nice but CSS active is enough */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity rounded-full"></div>
                <span className="text-6xl font-extrabold font-mono text-white relative z-10 drop-shadow-md">{tasbeehCount}</span>
                <span className="text-xs text-emerald-200 mt-2 relative z-10 font-bold tracking-wider">اضغط للتسبيح</span>
              </button>

              <div className="mt-8 flex items-center justify-center space-x-4 space-x-reverse text-xs text-gray-500">
                <button
                  onClick={() => setTasbeehCount(0)}
                  className="flex items-center text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  <RefreshCw className="w-4 h-4 ml-1.5" />
                  تصفير العداد
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
