'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, User, ArrowLeft, Loader2, CheckCircle2, Circle, Clock, Star } from 'lucide-react';
import { createKhatmahPlan, getKhatmahDetails, claimAssignment, completeAssignment, getKhatmahByJoinCode } from '@/app/actions/khatmah';

interface KhatmahPlannerProps {
  onClose?: () => void;
}

export const KhatmahPlanner: React.FC<KhatmahPlannerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [khatmahId, setKhatmahId] = useState<string | null>(null);
  const [khatmahData, setKhatmahData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  
  // Create Form State
  const [targetDays, setTargetDays] = useState(30);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  useEffect(() => {
    // Load from local storage on mount
    const savedId = localStorage.getItem('sannad_khatmah_id');
    const savedName = localStorage.getItem('sannad_guest_name');
    if (savedName) setGuestName(savedName);
    
    if (savedId) {
      setKhatmahId(savedId);
      loadKhatmah(savedId);
    }
  }, []);

  const loadKhatmah = async (id: string) => {
    setIsLoading(true);
    const res = await getKhatmahDetails(id);
    if (res.success) {
      setKhatmahData(res.khatmah);
      setActiveTab('view');
    } else {
      localStorage.removeItem('sannad_khatmah_id');
      setKhatmahId(null);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (isGroup && !groupName) return alert('يرجى إدخال اسم المجموعة');
    setIsLoading(true);
    const res = await createKhatmahPlan({ targetDays, isGroup, groupName });
    if (res.success && res.khatmah) {
      localStorage.setItem('sannad_khatmah_id', res.khatmah.id);
      setKhatmahId(res.khatmah.id);
      await loadKhatmah(res.khatmah.id);
    }
    setIsLoading(false);
  };

  const handleJoin = async () => {
    if (!joinCodeInput) return;
    setIsLoading(true);
    const res = await getKhatmahByJoinCode(joinCodeInput);
    if (res.success && res.khatmah) {
      localStorage.setItem('sannad_khatmah_id', res.khatmah.id);
      setKhatmahId(res.khatmah.id);
      await loadKhatmah(res.khatmah.id);
    } else {
      alert('كود المجموعة غير صحيح');
    }
    setIsLoading(false);
  };

  const saveGuestName = (name: string) => {
    setGuestName(name);
    localStorage.setItem('sannad_guest_name', name);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-[#C5A059]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-extrabold text-lg">جاري التحديث...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0D1412] rounded-[2rem] shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0 shadow-xl">
            <BookOpen className="w-8 h-8 text-[#C5A059]" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              مخطط الختمات
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              حدد هدفك لختم القرآن الكريم، سواء بختمة فردية أو بمشاركة عائلتك وأصدقائك عبر رابط واحد، وتابع إنجازك اليومي بسهولة.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 md:p-10 bg-gray-50/50 dark:bg-[#121C19]/30">
        {activeTab === 'create' && !khatmahId && (
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
            
            {/* Create Card */}
            <div className="lg:col-span-3 bg-white dark:bg-[#162621] p-6 sm:p-8 rounded-3xl shadow-card border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-[#0F382C] dark:text-emerald-400">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  إنشاء خطة جديدة
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setIsGroup(false)}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden ${!isGroup ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-md scale-[1.02]' : 'border-gray-100 dark:border-gray-800 hover:border-[#C5A059]/30 bg-gray-50/50 dark:bg-[#0D1412]'}`}
                >
                  {!isGroup && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>}
                  <div className={`p-3.5 rounded-full ${!isGroup ? 'bg-[#C5A059] text-white' : 'bg-white dark:bg-gray-800 text-gray-400 shadow-sm'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${!isGroup ? 'text-[#0F382C] dark:text-[#C5A059]' : 'text-gray-500 dark:text-gray-400'}`}>ختمة فردية</span>
                </button>
                
                <button 
                  onClick={() => setIsGroup(true)}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden ${isGroup ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-md scale-[1.02]' : 'border-gray-100 dark:border-gray-800 hover:border-[#C5A059]/30 bg-gray-50/50 dark:bg-[#0D1412]'}`}
                >
                  {isGroup && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>}
                  <div className={`p-3.5 rounded-full ${isGroup ? 'bg-[#0F382C] dark:bg-[#C5A059] text-white' : 'bg-white dark:bg-gray-800 text-gray-400 shadow-sm'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${isGroup ? 'text-[#0F382C] dark:text-[#C5A059]' : 'text-gray-500 dark:text-gray-400'}`}>ختمة جماعية</span>
                </button>
              </div>

              <div className="space-y-6">
                {isGroup && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم المجموعة</label>
                    <input 
                      type="text" 
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all dark:text-white"
                      placeholder="مثال: عائلة محمد، أصدقاء المسجد..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">المدة المطلوبة للختمة (بالأيام)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="3" max="365"
                      value={targetDays}
                      onChange={(e) => setTargetDays(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 text-xl font-extrabold focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all dark:text-white"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-lg border border-[#C5A059]/20">
                      {Math.ceil(604 / targetDays)} صفحات / يوم
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCreate}
                  className="w-full bg-gradient-to-r from-[#0F382C] to-[#164E3D] text-white rounded-xl py-4 font-extrabold text-lg hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>بدء الختمة الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Join Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#0F382C] to-[#142922] p-6 sm:p-8 rounded-3xl shadow-xl border border-[#C5A059]/20 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/30 backdrop-blur-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    لديك كود دعوة؟
                  </h3>
                </div>
                
                <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
                  إذا قام أحد أصدقائك بإنشاء ختمة جماعية وأرسل لك الكود، أدخله هنا للانضمام إلى مجموعتهم والمشاركة في الأجر.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-emerald-300/70 mb-2 uppercase tracking-wider">كود المجموعة</label>
                    <input 
                      type="text" 
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="w-full bg-[#081813]/60 border border-[#C5A059]/30 rounded-xl px-4 py-4 text-3xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] font-mono text-center tracking-[0.5em] font-extrabold text-white shadow-inner"
                      placeholder="ABCDEF"
                    />
                  </div>
                  
                  <button 
                    onClick={handleJoin}
                    disabled={joinCodeInput.length < 6}
                    className="w-full bg-[#C5A059] text-gray-900 rounded-xl py-4 font-extrabold text-lg hover:bg-[#D5B069] transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] disabled:opacity-50 disabled:shadow-none disabled:hover:bg-[#C5A059] flex items-center justify-center gap-2"
                  >
                    <span>انضمام للمجموعة</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'view' && khatmahData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto">
            
            {/* Khatmah Dashboard Header */}
            <div className="bg-white dark:bg-[#162621] p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="absolute left-0 top-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl"></div>
               
               <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0F382C] to-[#164E3D] text-[#C5A059] flex items-center justify-center shadow-lg border border-[#C5A059]/20 shrink-0">
                   {khatmahData.isGroup ? <Users className="w-7 h-7 sm:w-8 sm:h-8" /> : <User className="w-7 h-7 sm:w-8 sm:h-8" />}
                 </div>
                 <div>
                   <h3 className="font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white mb-2">
                     {khatmahData.isGroup ? `ختمة جماعية: ${khatmahData.groupName}` : 'الختمة الفردية'}
                   </h3>
                   <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
                     <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-500" /> {khatmahData.targetDays} يوم</span>
                     <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                     <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-500" /> {khatmahData.pagesPerDay} صفحات باليوم</span>
                   </div>
                 </div>
               </div>

               {khatmahData.isGroup && (
                 <div className="relative z-10 w-full md:w-auto bg-gray-50 dark:bg-[#0D1412] px-8 py-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner flex flex-col items-center">
                   <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider">كود الدعوة للمشاركة</p>
                   <p className="font-mono text-3xl font-extrabold tracking-[0.2em] text-[#0F382C] dark:text-[#C5A059]">
                     {khatmahData.groupJoinCode}
                   </p>
                 </div>
               )}
            </div>

            {!guestName ? (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-700/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div>
                  <h4 className="font-extrabold text-xl text-amber-900 dark:text-amber-400 mb-2">أدخل اسمك للمشاركة</h4>
                  <p className="text-sm text-amber-700/80 dark:text-amber-500/80 font-medium">سيظهر اسمك للآخرين عند حجز الأجزاء وتلاوتها.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    id="guestNameInput"
                    className="flex-1 md:w-64 bg-white dark:bg-[#0D1412] border border-amber-200 dark:border-amber-700/50 rounded-xl px-5 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-white"
                    placeholder="الاسم الكريم..."
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('guestNameInput') as HTMLInputElement;
                      if (input.value) saveGuestName(input.value);
                    }}
                    className="bg-amber-500 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-amber-600 transition-colors"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#162621] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0F382C]/10 dark:bg-[#C5A059]/10 flex items-center justify-center text-[#0F382C] dark:text-[#C5A059]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5">أنت تشارك باسم</p>
                    <p className="font-extrabold text-[#0F382C] dark:text-white text-lg leading-none">{guestName}</p>
                  </div>
                </div>
                <button onClick={() => setGuestName('')} className="mt-4 sm:mt-0 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50">تغيير الاسم</button>
              </div>
            )}

            {khatmahData.isGroup ? (
              <div className="bg-white dark:bg-[#162621] p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#C5A059]" />
                    توزيع الأجزاء (30 جزء)
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                  {khatmahData.assignments?.map((a: any) => (
                    <div 
                      key={a.id} 
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden group ${
                        a.status === 'COMPLETED' ? 'bg-[#0F382C]/5 dark:bg-emerald-900/10 border-emerald-500/30 hover:border-emerald-500' : 
                        a.status === 'READING' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400/40 hover:border-amber-400' : 
                        'bg-white dark:bg-[#0D1412] border-gray-100 dark:border-gray-800 hover:border-[#C5A059]/50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {a.status === 'COMPLETED' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}
                      {a.status === 'READING' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 animate-pulse"></div>}
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xl font-extrabold shadow-inner group-hover:scale-110 transition-transform ${
                        a.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' :
                        a.status === 'READING' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' :
                        'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}>
                        {a.juzNumber}
                      </div>
                      
                      {a.status === 'PENDING' ? (
                        <button 
                          onClick={async () => {
                            if (!guestName) return alert('يرجى إدخال اسمك أولاً بالأعلى');
                            setIsLoading(true);
                            await claimAssignment(a.id, guestName);
                            await loadKhatmah(khatmahData.id);
                          }}
                          className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0F382C] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-gray-900 transition-colors w-full"
                        >
                          حجز للقراءة
                        </button>
                      ) : (
                        <div className="flex flex-col items-center w-full mt-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-full mb-3">
                            {a.guestName}
                          </span>
                          
                          {a.status === 'READING' && a.guestName === guestName ? (
                            <button 
                              onClick={async () => {
                                setIsLoading(true);
                                await completeAssignment(a.id);
                                await loadKhatmah(khatmahData.id);
                              }}
                              className="text-xs bg-emerald-500 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-600 w-full flex items-center justify-center gap-1.5 font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" /> أتممت
                            </button>
                          ) : a.status === 'READING' ? (
                            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl flex items-center justify-center gap-1 font-bold w-full">
                              <Clock className="w-3 h-3" /> يقرأ الآن
                            </span>
                          ) : (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-xl flex items-center justify-center gap-1 font-bold w-full">
                              <CheckCircle2 className="w-3 h-3" /> تم الختم
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#162621] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h4 className="font-extrabold text-xl text-gray-700 dark:text-gray-300 mb-2">مخطط الختمة الفردية</h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  هذا القسم سيتم ربطه قريباً بنسبة تقدمك اليومية في التلاوة من قسم "اقرأ القرآن" ليقوم بتحديث تقدمك تلقائياً دون الحاجة للإدخال اليدوي.
                </p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('sannad_khatmah_id');
                    setKhatmahId(null);
                    setActiveTab('create');
                  }}
                  className="mt-8 px-6 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  إلغاء الخطة وبدء خطة جديدة
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
