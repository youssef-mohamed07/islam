"use client";

import React, { useState, useMemo } from 'react';
import { 
  Book, Search, Filter, BookOpen, ChevronLeft, ChevronRight, 
  ArrowRight, Download, CheckCircle, Clock, List, Type, ZoomIn, ZoomOut, User
} from 'lucide-react';
import { ISLAMIC_BOOKS_DATA, BookEntry, BookChapter } from './BooksData';

export function IslamicLibrary() {
  const [view, setView] = useState<'grid' | 'reader'>('grid');
  const [selectedBook, setSelectedBook] = useState<BookEntry | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [fontSize, setFontSize] = useState(20);

  // Categories
  const categories = [
    'الكل',
    'التفسير',
    'الحديث وعلومه',
    'العقيدة',
    'الفقه',
    'أصول الفقه',
    'السيرة والتاريخ',
    'التزكية والرقائق',
    'اللغة والأدب'
  ];

  // Filter books
  const filteredBooks = useMemo(() => {
    // If ISLAMIC_BOOKS_DATA is not defined yet, return empty array to prevent crash
    if (!ISLAMIC_BOOKS_DATA) return [];
    
    return ISLAMIC_BOOKS_DATA.filter((book) => {
      const matchesSearch = 
        book.titleArabic.includes(searchQuery) || 
        book.authorName.includes(searchQuery);
      const matchesCategory = 
        selectedCategory === 'الكل' || 
        book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenBook = (book: BookEntry) => {
    setSelectedBook(book);
    setSelectedChapterIndex(0);
    setView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
    setView('grid');
  };

  const handleNextChapter = () => {
    if (selectedBook && selectedChapterIndex < selectedBook.chapters.length - 1) {
      setSelectedChapterIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapterIndex > 0) {
      setSelectedChapterIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (view === 'reader' && selectedBook) {
    const currentChapter = selectedBook.chapters[selectedChapterIndex];
    return (
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] text-[#2D2D2D] dark:text-gray-200 font-arabic" dir="rtl">
        {/* Reader Header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-[#162621] shadow-sm border-b border-gray-200 dark:border-[#1F332C]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCloseBook}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0F382C] dark:hover:text-[#C5A059] transition-colors"
              >
                <ArrowRight size={20} />
                <span className="font-semibold">العودة للمكتبة</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              <h1 className="text-lg font-bold text-[#0F382C] dark:text-[#C5A059] truncate max-w-[200px] sm:max-w-md">
                {selectedBook.titleArabic}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#1F332C] rounded-full px-2 py-1">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-[#2C4A40] text-gray-600 dark:text-gray-300 shadow-sm transition-all"
                title="تصغير الخط"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm font-medium w-8 text-center text-gray-700 dark:text-gray-200" dir="ltr">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(48, prev + 2))}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-[#2C4A40] text-gray-600 dark:text-gray-300 shadow-sm transition-all"
                title="تكبير الخط"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative">
          {/* Sidebar / TOC */}
          <div className="w-full md:w-80 border-l border-gray-200 dark:border-[#1F332C] bg-white dark:bg-[#162621] md:h-[calc(100vh-65px)] md:sticky md:top-[65px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-[#1F332C] flex items-center gap-2 shrink-0">
              <List size={20} className="text-[#C5A059]" />
              <h2 className="font-bold text-lg text-[#0F382C] dark:text-white">فهرس الكتاب</h2>
            </div>
            <div className="p-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 max-h-[40vh] md:max-h-full">
              {selectedBook.chapters.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setSelectedChapterIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-right p-3 rounded-xl mb-2 transition-all flex items-start gap-3 ${
                    idx === selectedChapterIndex
                      ? 'bg-[#0F382C]/10 dark:bg-[#C5A059]/10 text-[#0F382C] dark:text-[#C5A059] font-bold ring-1 ring-[#0F382C]/20 dark:ring-[#C5A059]/20'
                      : 'hover:bg-gray-50 dark:hover:bg-[#1F332C] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                    idx === selectedChapterIndex 
                      ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-[#162621]' 
                      : 'bg-gray-200 text-gray-600 dark:bg-[#1F332C] dark:text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{chapter.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reader Main Content */}
          <div className="flex-1 p-6 md:p-12 pb-24 md:min-h-[calc(100vh-65px)]">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 text-center">
                {/* Decorative Elements */}
                <div className="flex items-center justify-center mb-6 opacity-60">
                  <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
                  <div className="mx-4 text-[#C5A059]">✦</div>
                  <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-[#0F382C] dark:text-[#C5A059] mb-6 leading-tight">
                  {currentChapter.title}
                </h2>
                
                <div className="flex items-center justify-center opacity-60">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
                  <BookOpen size={16} className="text-[#C5A059] mx-3" />
                  <div className="h-px w-24 bg-gradient-to-l from-transparent via-[#C5A059] to-transparent"></div>
                </div>
              </div>

              {/* Book Content */}
              <div 
                className="whitespace-pre-wrap text-justify"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: fontSize > 24 ? 2 : 2.2 
                }}
              >
                {currentChapter.content}
              </div>

              {/* Navigation */}
              <div className="mt-20 pt-8 border-t border-gray-200 dark:border-[#1F332C] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleNextChapter}
                  disabled={selectedChapterIndex === selectedBook.chapters.length - 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-100 dark:bg-[#1F332C] text-gray-800 dark:text-gray-200 hover:bg-[#0F382C] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-[#162621] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                >
                  <ChevronRight size={20} />
                  <span>الفصل التالي</span>
                </button>

                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1F332C] px-4 py-2 rounded-full">
                  الفصل {selectedChapterIndex + 1} من {selectedBook.chapters.length}
                </div>

                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapterIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-100 dark:bg-[#1F332C] text-gray-800 dark:text-gray-200 hover:bg-[#0F382C] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-[#162621] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                >
                  <span>الفصل السابق</span>
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] font-arabic" dir="rtl">
      {/* Header */}
      <div className="bg-[#0F382C] text-white pt-20 pb-28 px-4 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-54.627 54.627-.83-.83L54.627 0zM0 54.627l.83-.83 54.627-54.627.83.83L1.66 55.457 0 54.627z\' fill=\'%23C5A059\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-[#C5A059]/20 rounded-full mb-6 text-[#C5A059]">
            <Book size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-md tracking-tight">المكتبة الإسلامية</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            مكتبة شاملة تضم أمهات الكتب الإسلامية في العقيدة والفقه والتفسير والحديث، بصيغة رقمية ميسرة للقراءة والتصفح
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059] to-[#0F382C] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <Search className="absolute right-6 text-gray-400" size={24} />
              <input 
                type="text"
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#162621] text-gray-900 dark:text-white rounded-full py-5 pr-16 pl-6 focus:outline-none focus:ring-2 focus:ring-[#C5A059] shadow-xl transition-shadow text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 mb-20">
        {/* Categories */}
        <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-lg p-5 mb-10 border border-gray-100 dark:border-[#1F332C]">
          <div className="flex items-center gap-2 mb-4 text-[#0F382C] dark:text-[#C5A059]">
            <Filter size={20} />
            <span className="font-bold text-lg">التصنيفات</span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-[#111] shadow-md transform scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-[#1F332C] dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {selectedCategory === 'الكل' ? 'جميع الكتب' : `كتب ${selectedCategory}`}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">استكشف وتصفح الكتب المتاحة</p>
          </div>
          <div className="bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 rounded-xl text-sm font-bold border border-[#C5A059]/20 flex items-center gap-2">
            <Book size={16} />
            <span>{filteredBooks.length} كتاب</span>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="bg-white dark:bg-[#162621] rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-[#1F332C] flex flex-col group transform hover:-translate-y-2"
              >
                {/* Book Header / Cover Area */}
                <div className="h-32 bg-gradient-to-br from-[#0F382C] to-[#164a3b] dark:from-[#162621] dark:to-[#1F332C] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  <BookOpen size={48} className="text-white/20 absolute transform rotate-12 scale-150 right-4 top-4" />
                  <div className="z-10 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
                    <span className="text-white font-bold tracking-wide">{book.category}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col relative">
                  {/* Verified Badge */}
                  {book.isVerified && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-white dark:bg-[#162621] p-1 rounded-full shadow-sm">
                      <div className="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100 dark:border-green-800">
                        <CheckCircle size={12} />
                        <span>نسخة محققة</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Title & Author */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-2 leading-tight group-hover:text-[#0F382C] dark:group-hover:text-[#C5A059] transition-colors">
                    {book.titleArabic}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[#C5A059] mb-4 bg-[#C5A059]/5 p-2 rounded-lg w-fit">
                    <User size={16} />
                    <span className="text-sm font-semibold">تأليف: {book.authorName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {book.description}
                  </p>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-[#1F332C] p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Book size={14} className="text-[#0F382C] dark:text-[#C5A059]" />
                      <span className="font-medium">{book.volumes} أجزاء</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#0F382C] dark:text-[#C5A059]" />
                      <span className="font-medium">ت: {book.deathYear} هـ</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => handleOpenBook(book)}
                      className="bg-[#0F382C] hover:bg-[#164a3b] dark:bg-[#C5A059] dark:hover:bg-[#b08e4e] text-white dark:text-[#111] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      <BookOpen size={18} />
                      <span>تصفح الكتاب</span>
                    </button>
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-[#1F332C] dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm border border-gray-200 dark:border-gray-700"
                      title="تحميل PDF (قريباً)"
                    >
                      <Download size={18} />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-[#162621] rounded-3xl shadow-sm border border-gray-100 dark:border-[#1F332C]">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 dark:bg-[#1F332C] mb-6">
              <Search size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">لم نجد أي كتب تطابق بحثك</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">جرب البحث بكلمات مختلفة أو قم بتغيير التصنيف المختار لتظهر لك نتائج أخرى</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
              }}
              className="mt-8 bg-[#0F382C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#164a3b] transition-colors"
            >
              عرض جميع الكتب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
