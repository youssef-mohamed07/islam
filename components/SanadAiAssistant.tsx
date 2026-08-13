'use client';

import React, { useState } from 'react';
import { Sparkles, Send, AlertCircle } from 'lucide-react';

export const SanadAiAssistant: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('ما هي الآيات والأحاديث المتعلقة بالصبر ومكانته في الإسلام؟');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'أهلاً بك في مساعد "سَنَد" المعرفي. أنا محرك بحث واستخراج معرفي يعتمد حصرًا على المصادر الشرعية المحققة والموثوقة (القرآن الكريم، التفسير بالمأثور، أمهات كتب الحديث، والمذاهب الأربعة).',
      citations: []
    },
    {
      sender: 'user',
      text: 'ما هي الآيات والأحاديث المتعلقة بالصبر ومكانته في الإسلام؟',
      citations: []
    },
    {
      sender: 'ai',
      text: 'بناءً على المصادر المحققة في قاعدة معرفة "سَنَد":\n\n1. القرآن الكريم:\nورد الصبر في القرآن الكريم في أكثر من تسعين موضعاً، منها قوله تعالى: ﴿يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ﴾ [1]، وقد بين الإمام السعدي في تفسيره أن الصبر يحبس النفس عن المكاره ويُعين على طاعة الله [2].\n\n2. السنة النبوية الشريفة:\nعن النبي صلى الله عليه وسلم قال: "وما أُعطي أحدٌ عطاءً خيراً وأوسعَ من الصبر" (متفق عليه) [3].',
      citations: [
        { id: '1', title: 'سورة البقرة - الآية 153', source: 'المصحف الشريف' },
        { id: '2', title: 'تفسير السعدي', source: 'تيسير الكريم الرحمن' },
        { id: '3', title: 'صحيح البخاري ومسلم', source: 'باب الصبر' }
      ]
    }
  ]);

  const handleSend = () => {
    if (!inputQuery.trim()) return;

    const newMessages = [
      ...messages,
      { sender: 'user', text: inputQuery, citations: [] },
      {
        sender: 'ai',
        text: `بناءً على التفتيش في قاعدة "سَنَد" للمصادر المحققة المتعلقة بـ "${inputQuery}":\n\nوردت نصوص شرعية محققة توضح هذه المسألة، حيث نصت الأدلة من الكتاب والسنة على أصل العبادة والالتزام بالضوابط الشرعية المعتمدة لدى جمهور العلماء.`,
        citations: [
          { id: '1', title: 'صحيح مسلم', source: 'كتاب الإيمان' },
          { id: '2', title: 'تفسير ابن كثير', source: 'تفسير القرآن العظيم' }
        ]
      }
    ];

    setMessages(newMessages);
    setInputQuery('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-[#C5A059] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F382C] dark:text-white">
                مساعد سَنَد المعرفي (AI)
              </h1>
              <p className="text-xs text-gray-500">
                محرك استخلاص واسترجاع معرفي مدعم بالمصادر والتخريج
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 space-x-reverse bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-lg text-xs border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 ml-1 text-[#C5A059]" />
            <span>ملاحظة: هذا مساعد معرفي للاستخراج وليس مفتياً شرعياً</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-5 ${
                  m.sender === 'user'
                    ? 'bg-[#0F382C] text-white rounded-br-none'
                    : 'bg-gray-50 dark:bg-[#0D1412] text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-800 rounded-bl-none'
                }`}
              >
                <div className="text-sm font-quran leading-relaxed whitespace-pre-line">
                  {m.text}
                </div>

                {/* Citations Footnote Box */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-xs">
                    <span className="font-bold text-[#C5A059] block mb-1">المصادر والإحالات الموثقة:</span>
                    <div className="space-y-1">
                      {m.citations.map((c) => (
                        <div key={c.id} className="flex items-center space-x-2 space-x-reverse text-gray-500 dark:text-gray-400">
                          <span className="font-mono text-[10px] bg-[#C5A059]/20 text-amber-900 dark:text-[#C5A059] px-1.5 py-0.5 rounded">
                            [{c.id}]
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{c.title}</span>
                          <span>•</span>
                          <span>{c.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1412]">
          <div className="flex items-center space-x-3 space-x-reverse">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اطرح سؤالاً معرفياً لاستخراجه من المصادر..."
              className="flex-1 bg-white dark:bg-[#162621] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#0F382C]"
            />
            <button
              onClick={handleSend}
              className="bg-[#0F382C] text-[#C5A059] p-3 rounded-xl hover:bg-[#164E3D] transition-colors shadow-md"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
