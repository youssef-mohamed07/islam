'use client';

import React, { useState } from 'react';
import { Trophy, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "في أي سنة هجرية كانت غزوة بدر الكبرى؟",
    options: ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "ما هي أطول سورة في القرآن الكريم؟",
    options: ["سورة النساء", "سورة آل عمران", "سورة المائدة", "سورة البقرة"],
    correctAnswer: 3,
  },
  {
    id: 3,
    question: "من هو الصحابي الجليل الملقب بـ (أمين هذه الأمة)؟",
    options: ["أبو بكر الصديق", "عمر بن الخطاب", "أبو عبيدة بن الجراح", "علي بن أبي طالب"],
    correctAnswer: 2,
  }
];

export const QuizHub: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === MOCK_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizFinished(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-[#C5A059]/20 text-emerald-600 dark:text-[#C5A059] rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#0F382C] dark:text-white mb-4">
          تحديات سند المعرفية
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          اختبر معلوماتك في القرآن، الحديث، السيرة، والفقه.
        </p>
      </div>

      {quizFinished ? (
        <div className="bg-white dark:bg-[#162621] p-12 rounded-3xl shadow-card text-center border border-gray-200/80 dark:border-gray-800">
          <h2 className="text-3xl font-bold text-[#0F382C] dark:text-white mb-4">النتيجة النهائية</h2>
          <div className="text-6xl font-extrabold text-[#C5A059] mb-6">
            {score} / {MOCK_QUESTIONS.length}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">
            {score === MOCK_QUESTIONS.length 
              ? 'ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح.' 
              : 'عمل رائع! يمكنك المحاولة مرة أخرى لتحسين نتيجتك.'}
          </p>
          <button 
            onClick={resetQuiz}
            className="bg-[#0F382C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#164E3D] transition-colors"
          >
            إعادة التحدي
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#162621] p-8 md:p-12 rounded-3xl shadow-soft border border-gray-200/80 dark:border-gray-800">
          
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-gray-400">
              السؤال {currentQuestion + 1} من {MOCK_QUESTIONS.length}
            </span>
            <span className="text-sm font-bold bg-[#C5A059]/10 text-[#C5A059] px-4 py-1.5 rounded-full">
              النقاط: {score}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#0F382C] dark:text-white mb-10 leading-relaxed flex items-start space-x-3 space-x-reverse">
            <HelpCircle className="w-8 h-8 text-[#C5A059] shrink-0 mt-1" />
            <span>{MOCK_QUESTIONS[currentQuestion].question}</span>
          </h2>

          <div className="space-y-4">
            {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === MOCK_QUESTIONS[currentQuestion].correctAnswer;
              
              let btnClass = "bg-gray-50 dark:bg-[#0D1412] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#0F382C]/30";
              
              if (showResult) {
                if (isCorrect) {
                  btnClass = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400";
                } else if (isSelected) {
                  btnClass = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
                }
              } else if (isSelected) {
                btnClass = "border-[#0F382C] bg-[#0F382C]/5 text-[#0F382C]";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-right font-bold transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span className="text-lg">{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
