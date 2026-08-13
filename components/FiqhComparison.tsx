'use client';

import React, { useState, useEffect } from 'react';
import { Scale, CheckCircle2, ShieldAlert, Loader2, ListFilter } from 'lucide-react';

interface FiqhOpinion {
  scholar: string;
  ruling: string;
  evidence: string;
  source: string;
}

interface FiqhIssue {
  id: string;
  topic: string;
  title: string;
  opinions: {
    hanafi: FiqhOpinion;
    maliki: FiqhOpinion;
    shafii: FiqhOpinion;
    hanbali: FiqhOpinion;
  };
}

export const FiqhComparison: React.FC = () => {
  const [issues, setIssues] = useState<FiqhIssue[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('الكل');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    fetch('/data/fiqh.json')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.length > 0) {
          setIssues(data);
          setSelectedIssueId(data[0].id);
        }
      })
      .catch(err => console.error("Failed to load fiqh issues", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, []);

  const topics = ['الكل', ...Array.from(new Set(issues.map(i => i.topic)))];

  const filteredIssues = selectedTopic === 'الكل' 
    ? issues 
    : issues.filter(i => i.topic === selectedTopic);

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Banner */}
      <div className="bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-[#F5F7F6]">
                الفقه الإسلامي المقارن
              </h1>
              <span className="hidden sm:flex bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30 items-center">
                <Scale className="w-3 h-3 ml-1" />
                المذاهب الفقهية الأربعة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              عرض علمي أكاديمي محايد لآراء الأئمة الأربعة بأدلتهم الشرعية من الكتاب والسنة ببيانات حقيقية
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-4 h-4 ml-1" />
            <span>عرض الخلاف الفقهي دون الترجيح الفردي أو الإلزام</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-500 font-bold">جاري تحميل المسائل الفقهية...</p>
        </div>
      ) : (
        <>
          {/* Topic Filters - sticky chip row on mobile */}
          <div className="sticky top-14 lg:static z-30 flex items-center space-x-3 space-x-reverse mb-4 sm:mb-6 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 bg-[#FDFBF7]/95 dark:bg-[#0D1412]/95 backdrop-blur-md">
            <div className="hidden sm:flex items-center text-sm font-bold text-gray-500 ml-2 whitespace-nowrap">
              <ListFilter className="w-4 h-4 ml-1" />
              تصنيف المسائل:
            </div>
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  // Optionally reset selected issue when changing topic if old issue is hidden
                  const firstInTopic = (topic === 'الكل' ? issues : issues.filter(i => i.topic === topic))[0];
                  if (firstInTopic) setSelectedIssueId(firstInTopic.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTopic === topic
                    ? 'bg-[#0F382C] text-white shadow-md'
                    : 'bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#C5A059]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Issues Selector */}
          <div className="bg-white dark:bg-[#162621] p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar mb-4 sm:mb-8">
            <span className="text-xs font-bold text-gray-400 px-3 whitespace-nowrap">اختر المسألة:</span>
            {filteredIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  selectedIssueId === issue.id
                    ? 'bg-[#0F382C] text-white shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#C5A059]/50'
                }`}
              >
                {issue.title}
              </button>
            ))}
          </div>

          {/* Comparative Views */}
          {selectedIssue && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Hanafi */}
              <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border-t-4 border-t-[#1E4D40] border-gray-200/80 dark:border-gray-800 p-4 sm:p-6 flex flex-col h-full hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#1E4D40] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    المذهب الحنفي
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold max-w-[100px] text-left">
                    {selectedIssue.opinions.hanafi.scholar}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-3">خلاصة الحكم:</h4>
                  <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
                      "{selectedIssue.opinions.hanafi.ruling}"
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                    الدليل والتعليل:
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                    {selectedIssue.opinions.hanafi.evidence}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-[10px] font-bold text-gray-400">
                  <ShieldAlert className="w-3 h-3 ml-1 text-[#C5A059]" />
                  المصدر: {selectedIssue.opinions.hanafi.source}
                </div>
              </div>

              {/* Maliki */}
              <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border-t-4 border-t-[#2E6B5E] border-gray-200/80 dark:border-gray-800 p-4 sm:p-6 flex flex-col h-full hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#2E6B5E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    المذهب المالكي
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold max-w-[100px] text-left">
                    {selectedIssue.opinions.maliki.scholar}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-3">خلاصة الحكم:</h4>
                  <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
                      "{selectedIssue.opinions.maliki.ruling}"
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                    الدليل والتعليل:
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                    {selectedIssue.opinions.maliki.evidence}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-[10px] font-bold text-gray-400">
                  <ShieldAlert className="w-3 h-3 ml-1 text-[#C5A059]" />
                  المصدر: {selectedIssue.opinions.maliki.source}
                </div>
              </div>

              {/* Shafii */}
              <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border-t-4 border-t-[#0F382C] border-gray-200/80 dark:border-gray-800 p-4 sm:p-6 flex flex-col h-full hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#0F382C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    المذهب الشافعي
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold max-w-[100px] text-left">
                    {selectedIssue.opinions.shafii.scholar}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-3">خلاصة الحكم:</h4>
                  <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
                      "{selectedIssue.opinions.shafii.ruling}"
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                    الدليل والتعليل:
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                    {selectedIssue.opinions.shafii.evidence}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-[10px] font-bold text-gray-400">
                  <ShieldAlert className="w-3 h-3 ml-1 text-[#C5A059]" />
                  المصدر: {selectedIssue.opinions.shafii.source}
                </div>
              </div>

              {/* Hanbali */}
              <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border-t-4 border-t-[#082019] border-gray-200/80 dark:border-gray-800 p-4 sm:p-6 flex flex-col h-full hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#082019] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    المذهب الحنبلي
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold max-w-[100px] text-left">
                    {selectedIssue.opinions.hanbali.scholar}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-3">خلاصة الحكم:</h4>
                  <div className="bg-gray-50 dark:bg-[#0D1412] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
                      "{selectedIssue.opinions.hanbali.ruling}"
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                    الدليل والتعليل:
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                    {selectedIssue.opinions.hanbali.evidence}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-[10px] font-bold text-gray-400">
                  <ShieldAlert className="w-3 h-3 ml-1 text-[#C5A059]" />
                  المصدر: {selectedIssue.opinions.hanbali.source}
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
};
