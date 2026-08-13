'use client';

import React from 'react';
import { FileText, Database, Layers, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'الآيات المحققة', count: '6,236', icon: FileText, color: 'text-emerald-600' },
    { label: 'الأحاديث المخرجة', count: '62,400', icon: Database, color: 'text-blue-600' },
    { label: 'كتب التفسير المعتمدة', count: '14', icon: Layers, color: 'text-amber-600' },
    { label: 'المصادر والتحقيقات المعلقة', count: '3', icon: Clock, color: 'text-purple-600' }
  ];

  const pendingImports = [
    {
      id: 'job-1',
      sourceName: 'مكتبة السنة النبوية (جامع الخادم)',
      adapter: 'HadithAdapter',
      status: 'PENDING_REVIEW',
      count: 1450,
      license: 'Public Domain',
      date: '2026-08-09'
    },
    {
      id: 'job-2',
      sourceName: 'تفسير الطبري - تحقيق د. التركي',
      adapter: 'TafsirAdapter',
      status: 'VERIFIED',
      count: 6236,
      license: 'Open Access',
      date: '2026-08-08'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-2xl font-bold text-[#0F382C] dark:text-white">
                لوحة تدقيق وتحقيق المحتوى الشرعي
              </h1>
              <span className="bg-[#0F382C] text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full">
                نظام السند Verification Engine
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              إدارة المصادر، تراخيص البيانات، مراجعة الواردات، واعتماد حالة التوثيق الشرعي
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500">{s.label}</span>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-[#0F382C] dark:text-white font-mono">
                {s.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Import Jobs Verification Table */}
      <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0F382C] dark:text-white">
            مهام الاستيراد والتحقيق الحالية (Data Ingestion Jobs)
          </h3>
          <span className="text-xs text-gray-400">تحديث تلقائي</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-[#0D1412] text-gray-500 font-bold uppercase border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4">اسم المصدر</th>
                <th className="p-4">المحول (Adapter)</th>
                <th className="p-4">عدد السجلات</th>
                <th className="p-4">الترخيص الشرعي</th>
                <th className="p-4">حالة التحقيق</th>
                <th className="p-4">إجراءات Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingImports.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-bold text-[#0F382C] dark:text-white">{job.sourceName}</td>
                  <td className="p-4 font-mono">{job.adapter}</td>
                  <td className="p-4 font-mono font-bold">{job.count.toLocaleString()}</td>
                  <td className="p-4">{job.license}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      job.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {job.status === 'VERIFIED' ? 'محقق وموثق' : 'قيد المراجعة والتدقيق'}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 space-x-reverse">
                    <button className="bg-[#0F382C] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#164E3D]">
                      اعتماد للنشر
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
