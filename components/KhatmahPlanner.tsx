'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, User, ArrowLeft, Loader2, CheckCircle2, Circle, Clock } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-10 h-64 text-[#C5A059]">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-bold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 overflow-hidden max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#0F382C] text-white p-6 relative">
        <h2 className="text-2xl font-extrabold flex items-center">
          <BookOpen className="w-6 h-6 ml-3 text-[#C5A059]" />
          مُخطط الختمات (Khatmah Planner)
        </h2>
        <p className="text-emerald-100/70 mt-2 text-sm max-w-xl">
          حدد هدفك لختم القرآن الكريم، سواء بختمة فردية أو بمشاركة عائلتك وأصدقائك عبر رابط واحد.
        </p>
      </div>

      <div className="p-6">
        {activeTab === 'create' && !khatmahId && (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Create New */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                إنشاء خطة جديدة
              </h3>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsGroup(false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${!isGroup ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-gray-200 dark:border-gray-700 hover:border-[#C5A059]/50'}`}
                >
                  <User className={`w-8 h-8 ${!isGroup ? 'text-[#C5A059]' : 'text-gray-400'}`} />
                  <span className="font-bold text-sm dark:text-gray-200">ختمة فردية</span>
                </button>
                <button 
                  onClick={() => setIsGroup(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isGroup ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-gray-200 dark:border-gray-700 hover:border-[#C5A059]/50'}`}
                >
                  <Users className={`w-8 h-8 ${isGroup ? 'text-[#C5A059]' : 'text-gray-400'}`} />
                  <span className="font-bold text-sm dark:text-gray-200">ختمة جماعية</span>
                </button>
              </div>

              {isGroup && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">اسم المجموعة (مثال: عائلة محمد)</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0D1412] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] dark:text-white"
                    placeholder="أدخل اسم المجموعة"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">المدة المطلوبة للختمة (بالأيام)</label>
                <input 
                  type="number" 
                  min="3" max="365"
                  value={targetDays}
                  onChange={(e) => setTargetDays(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0D1412] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] dark:text-white"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  بمعدل <span className="font-bold text-[#C5A059]">{Math.ceil(604 / targetDays)} صفحات</span> يومياً تقريباً
                </p>
              </div>

              <button 
                onClick={handleCreate}
                className="w-full bg-[#0F382C] text-white rounded-xl py-3 font-bold hover:bg-[#0F382C]/90 transition-colors shadow-md"
              >
                إنشاء الخطة
              </button>
            </div>

            {/* Join Existing */}
            <div className="space-y-6 md:border-r md:border-gray-200 dark:md:border-gray-800 md:pr-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                الانضمام لختمة جماعية
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                إذا قام أحد أفراد عائلتك أو أصدقائك بإنشاء ختمة جماعية، يمكنك الانضمام إليها باستخدام كود المجموعة.
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">كود المجموعة (6 أحرف)</label>
                <input 
                  type="text" 
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full bg-white dark:bg-[#0D1412] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] font-mono text-center tracking-[0.5em] font-bold dark:text-white"
                  placeholder="ABCDEF"
                />
              </div>
              <button 
                onClick={handleJoin}
                className="w-full bg-[#C5A059] text-gray-950 rounded-xl py-3 font-bold hover:bg-[#C5A059]/90 transition-colors shadow-md"
              >
                انضمام
              </button>
            </div>

          </div>
        )}

        {activeTab === 'view' && khatmahData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 gap-4">
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg flex items-center gap-2">
                  {khatmahData.isGroup ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  {khatmahData.isGroup ? `ختمة جماعية: ${khatmahData.groupName}` : 'الختمة الفردية'}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-500 mt-1">
                  الهدف: {khatmahData.targetDays} يوم (الورد اليومي: {khatmahData.pagesPerDay} صفحة)
                </p>
              </div>
              
              {khatmahData.isGroup && (
                <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center min-w-[150px]">
                  <p className="text-[10px] text-gray-500 font-bold mb-1">كود الدعوة</p>
                  <p className="font-mono text-lg font-extrabold tracking-widest text-[#C5A059]">
                    {khatmahData.groupJoinCode}
                  </p>
                </div>
              )}
            </div>

            {!guestName ? (
              <div className="bg-white dark:bg-[#0D1412] p-6 rounded-xl border border-amber-200 dark:border-amber-900/30">
                <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-2">أدخل اسمك للمشاركة</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="guestNameInput"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm dark:text-white"
                    placeholder="الاسم الكريم..."
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('guestNameInput') as HTMLInputElement;
                      if (input.value) saveGuestName(input.value);
                    }}
                    className="bg-[#0F382C] text-white px-6 py-2 rounded-lg text-sm font-bold"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm dark:text-gray-300">أنت تشارك باسم: <span className="font-bold text-[#C5A059]">{guestName}</span></p>
                <button onClick={() => setGuestName('')} className="text-[10px] text-gray-500 hover:text-red-500">تغيير الاسم</button>
              </div>
            )}

            {khatmahData.isGroup ? (
              <div>
                <h4 className="font-bold text-lg mb-4 dark:text-white">توزيع الأجزاء (30 جزء)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {khatmahData.assignments?.map((a: any) => (
                    <div 
                      key={a.id} 
                      className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                        a.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/50' : 
                        a.status === 'READING' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400/50' : 
                        'bg-white dark:bg-[#0D1412] border-gray-200 dark:border-gray-800 hover:border-emerald-300'
                      }`}
                    >
                      <span className="font-bold text-gray-900 dark:text-gray-100 mb-1">الجزء {a.juzNumber}</span>
                      
                      {a.status === 'PENDING' ? (
                        <button 
                          onClick={async () => {
                            if (!guestName) return alert('يرجى إدخال اسمك أولاً بالأعلى');
                            setIsLoading(true);
                            await claimAssignment(a.id, guestName);
                            await loadKhatmah(khatmahData.id);
                          }}
                          className="mt-2 text-[10px] bg-[#0F382C] text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 w-full"
                        >
                          حجز للقراءة
                        </button>
                      ) : (
                        <div className="flex flex-col items-center w-full mt-1">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full mb-2">
                            {a.guestName}
                          </span>
                          
                          {a.status === 'READING' && a.guestName === guestName ? (
                            <button 
                              onClick={async () => {
                                setIsLoading(true);
                                await completeAssignment(a.id);
                                await loadKhatmah(khatmahData.id);
                              }}
                              className="text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-full hover:bg-emerald-600 w-full flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> أتممت القراءة
                            </button>
                          ) : a.status === 'READING' ? (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                              <Clock className="w-3 h-3" /> قيد القراءة
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> مكتمل
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  (مخطط الختمة الفردية سيظهر هنا متصلاً بنسبة تقدمك اليومية)
                </p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('sannad_khatmah_id');
                    setKhatmahId(null);
                    setActiveTab('create');
                  }}
                  className="mt-4 text-red-500 text-sm font-bold"
                >
                  حذف الخطة الفردية
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
