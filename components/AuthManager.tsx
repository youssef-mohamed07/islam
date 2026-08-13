'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, LogOut, Settings, Heart, BookOpen, ShieldCheck, Loader2, KeyRound } from 'lucide-react';
import { login, register, logout, getSession } from '@/app/actions/auth';

interface AuthManagerProps {
  onNavigate: (tab: string) => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'login' | 'register' | 'profile'>('login');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionUser = await getSession();
        if (sessionUser) {
          setUser(sessionUser);
          setView('profile');
        }
      } catch (err) {
        console.error('Failed to fetch session', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = view === 'login' ? await login(formData) : await register(formData);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        const sessionUser = await getSession();
        if (sessionUser) {
          setUser(sessionUser);
          setView('profile');
        }
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      setUser(null);
      setView('login');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
          <span className="text-xs text-gray-500 font-medium">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  /* PROFILE VIEW */
  if (user && view === 'profile') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
        <div className="bg-white dark:bg-[#162621] rounded-3xl shadow-lg border border-[#0F382C]/10 dark:border-[#C5A059]/20 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0F382C] to-[#164E3D] p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C5A059] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-md border-2 border-white/20">
                  {user.name?.charAt(0) || 'م'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{user.name}</h2>
                    <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-medium">
                      عضو موثق
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isSubmitting}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <BookOpen className="w-5 h-5 mx-auto text-[#0F382C] dark:text-[#C5A059] mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-[11px] text-gray-500 mt-0.5">ختمات مكتملة</div>
              </div>

              <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <Heart className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-[11px] text-gray-500 mt-0.5">أحاديث مفضلة</div>
              </div>

              <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                <Settings className="w-5 h-5 mx-auto text-gray-400 mb-2" />
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">الإعدادات</div>
                <div className="text-[11px] text-gray-500 mt-0.5">تفضيلات الحساب</div>
              </div>

            </div>

            {/* Account Details */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">معلومات الحساب</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 dark:bg-[#0D1412] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between">
                  <span className="text-gray-500">البريد الإلكتروني:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{user.email}</span>
                </div>
                <div className="bg-gray-50 dark:bg-[#0D1412] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between">
                  <span className="text-gray-500">تاريخ الانضمام:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* LOGIN / REGISTER VIEW */
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-[#162621] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
        
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#0F382C] text-[#C5A059] flex items-center justify-center font-quran text-2xl font-bold shadow-md border border-[#C5A059]/30 mb-3">
            س
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F382C] dark:text-white">
            {view === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {view === 'login' ? 'مرحباً بك في منصة سَنَد المعرفية' : 'انضم إلى منصة سَنَد المعرفية'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-100 dark:bg-[#0D1412] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setView('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              view === 'login'
                ? 'bg-white dark:bg-[#162621] text-[#0F382C] dark:text-[#C5A059] shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setView('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              view === 'register'
                ? 'bg-white dark:bg-[#162621] text-[#0F382C] dark:text-[#C5A059] shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {view === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">الاسم الكامل</label>
              <div className="relative flex items-center">
                <div className="absolute right-3.5 pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="أحمد محمود"
                  className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
            <div className="relative flex items-center">
              <div className="absolute right-3.5 pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
            <div className="relative flex items-center">
              <div className="absolute right-3.5 pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl py-2.5 pr-10 pl-4 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#0F382C] hover:bg-[#164E3D] dark:bg-[#C5A059] dark:hover:bg-[#d4b069] text-white dark:text-gray-950 font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{view === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
