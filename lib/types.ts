/**
 * Core Data Models & TypeScript Interfaces for Sanad
 */

export type VerificationStatus = 'DRAFT' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface SourceReference {
  id: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  bookTitle?: string;
  authorName?: string;
  publisher?: string;
  edition?: string;
  license: string;
  verificationStatus: VerificationStatus;
}

export interface Surah {
  id: number;
  nameArabic: string;
  nameComplex: string;
  nameEnglish: string;
  revelationPlace: 'Makkah' | 'Madinah';
  versesCount: number;
  revelationOrder: number;
  bismillahPre: boolean;
  pages: [number, number];
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  textUthmanic: string;
  textSimple: string;
  juzNumber: number;
  hizbNumber: number;
  rubNumber: number;
  pageNumber: number;
  translations?: Record<string, string>;
  tafsirCount?: number;
}

export interface Qiraah {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  imamName: string;
  description?: string;
}

export interface Riwayah {
  id: string;
  qiraahId: string;
  nameArabic: string;
  nameEnglish: string;
  rawiName: string;
  description?: string;
}

export interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  bio?: string;
  riwayahId: string;
  profileImage?: string;
  hasGaplessAudio: boolean;
}

export interface TafsirBook {
  id: string;
  slug: string;
  nameArabic: string;
  nameEnglish: string;
  authorName: string;
  authorDeathYear?: number;
  language: string;
  sourceRef: SourceReference;
}

export interface TafsirEntry {
  id: string;
  tafsirBookId: string;
  surahId: number;
  ayahNumber: number;
  text: string;
  sourceRef?: SourceReference;
}

export interface HadithCollection {
  id: string;
  slug: string;
  nameArabic: string;
  nameEnglish: string;
  authorName: string;
  totalHadiths: number;
  hasGrading: boolean;
  sourceRef: SourceReference;
}

export interface Hadith {
  id: string;
  collectionId: string;
  bookNumber: number;
  chapterNumber: number;
  hadithNumber: number;
  narratorChain?: string;
  textArabic: string;
  textEnglish?: string;
  grade?: 'Sahih' | 'Hasan' | 'Da\'if' | 'Mawdu\'' | 'SAHIH' | 'HASAN' | 'DAIF' | 'MAWDU';
  gradeArabic?: 'صحيح' | 'حسن' | 'ضعيف' | 'موضوع';
  sourceRef: SourceReference;
  relatedAyahs?: { surahId: number; ayahNumber: number }[];
}

export interface FiqhRuling {
  id: string;
  topicArabic: string;
  topicEnglish?: string;
  madhhab: 'Hanafi' | 'Maliki' | 'Shafi\'i' | 'Hanbali';
  madhhabArabic: 'الحنفي' | 'المالكي' | 'الشافعي' | 'الحنبلي';
  rulingSummary: string;
  evidence: string;
  sourceBook: string;
  scholarName?: string;
  sourceRef: SourceReference;
}

export interface SeerahEvent {
  id: string;
  titleArabic: string;
  titleEnglish?: string;
  era: string;
  yearHijri?: number;
  yearAH?: number;
  description: string;
  keyLessons?: string[];
  location?: string;
  relatedAyahs?: { surahId: number; ayahNumber: number }[];
  relatedHadithIds?: string[];
}

export interface Scholar {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  title?: string;
  birthYearAH?: number;
  deathYearAH?: number;
  era: string;
  biography: string;
  famousWorks: string[];
  teachers?: string[];
  students?: string[];
  fieldOfExpertise: string[];
}

export interface Book {
  id: string;
  titleArabic: string;
  titleEnglish?: string;
  authorName: string;
  category: string;
  description: string;
  coverImage?: string;
  pageCount?: number;
  downloadUrl?: string;
  license: string;
  sourceRef: SourceReference;
}

export interface Dhikr {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'sleep' | 'wake' | 'general';
  categoryArabic: string;
  textArabic: string;
  translation?: string;
  transliteration?: string;
  count: number;
  benefit?: string;
  sourceRef: SourceReference;
  audioUrl?: string;
}

export interface UnifiedSearchResult {
  id: string;
  type: 'quran' | 'tafsir' | 'hadith' | 'book' | 'adhkar' | 'fiqh' | 'seerah' | 'scholar';
  typeArabic: string;
  title: string;
  subtitle?: string;
  snippet: string;
  fullText?: string;
  sourceName: string;
  url: string;
  badgeColor?: string;
  relevanceScore?: number;
  metadata?: Record<string, any>;
}
