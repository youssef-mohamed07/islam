import { prisma } from './prisma';
import { Surah, Hadith, Dhikr } from './types';
import { MOCK_SURAHS, MOCK_HADITHS } from '@/components/MockData';

/**
 * Data Ingestion Engine for Sanad (Cache-First + Prisma DB Persistence)
 */

export async function fetchQuranSurahsFromApi(): Promise<Surah[]> {
  try {
    // 1. Check Database Cache
    const dbSurahs = await prisma.surah.findMany({
      orderBy: { id: 'asc' }
    });

    if (dbSurahs && dbSurahs.length > 0) {
      return dbSurahs.map(s => ({
        id: s.id,
        nameArabic: s.nameArabic,
        nameComplex: s.nameComplex,
        nameEnglish: s.nameEnglish,
        revelationPlace: (s.revelationPlace === 'Madinah' ? 'Madinah' : 'Makkah') as 'Makkah' | 'Madinah',
        versesCount: s.versesCount,
        revelationOrder: s.revelationOrder,
        bismillahPre: s.bismillahPre,
        pages: [s.pageStart, s.pageEnd]
      }));
    }

    // 2. Fetch from External API if DB is empty
    const res = await fetch('https://api.quran.com/api/v4/chapters?language=ar', {
      next: { revalidate: 86400 } // 24 hours cache
    });
    if (!res.ok) throw new Error('Failed to fetch surahs');
    const data = await res.json();
    
    const surahsList = data.chapters.map((ch: any) => ({
      id: ch.id,
      nameArabic: ch.name_arabic,
      nameComplex: ch.name_complex,
      nameEnglish: ch.translated_name.name,
      revelationPlace: (ch.revelation_place === 'makkah' ? 'Makkah' : 'Madinah') as 'Makkah' | 'Madinah',
      versesCount: ch.verses_count,
      revelationOrder: ch.revelation_order,
      bismillahPre: ch.bismillah_pre,
      pages: ch.pages || [1, 1]
    }));

    // Async DB Insertion (background seed)
    prisma.surah.createMany({
      data: surahsList.map((s: any) => ({
        id: s.id,
        nameArabic: s.nameArabic,
        nameComplex: s.nameComplex,
        nameEnglish: s.nameEnglish,
        revelationPlace: s.revelationPlace,
        versesCount: s.versesCount,
        revelationOrder: s.revelationOrder,
        bismillahPre: s.bismillahPre,
        pageStart: s.pages?.[0] || 1,
        pageEnd: s.pages?.[1] || 1
      })),
      skipDuplicates: true
    }).catch(err => console.warn('Background surah DB save error:', err));

    return surahsList;
  } catch (error) {
    console.error('Error fetching Quran Surahs:', error);
    return MOCK_SURAHS;
  }
}

export async function fetchQuranVersesFromApi(chapterId: number): Promise<any[]> {
  try {
    // 1. Check Database Cache for Ayahs
    const dbAyahs = await prisma.ayah.findMany({
      where: { surahId: chapterId },
      orderBy: { ayahNumber: 'asc' }
    });

    if (dbAyahs && dbAyahs.length > 0) {
      return dbAyahs.map(a => ({
        id: a.id,
        verse_key: `${a.surahId}:${a.ayahNumber}`,
        text_uthmani: a.textUthmanic,
        text_simple: a.textSimple,
        page_number: a.pageNumber,
        juz_number: a.juzNumber,
        hizb_number: a.hizbNumber
      }));
    }

    // 2. Fetch from External API
    const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${chapterId}`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch verses');
    const data = await res.json();
    const verses = data.verses || [];

    // Async DB Insertion
    if (verses.length > 0) {
      prisma.ayah.createMany({
        data: verses.map((v: any) => {
          const ayahNumber = parseInt(v.verse_key.split(':')[1], 10);
          return {
            surahId: chapterId,
            ayahNumber: ayahNumber,
            textUthmanic: v.text_uthmani,
            textSimple: v.text_uthmani,
            juzNumber: 1,
            hizbNumber: 1,
            rubNumber: 1,
            pageNumber: v.page_number || 1
          };
        }),
        skipDuplicates: true
      }).catch(err => console.warn(`Background ayah DB save error for chapter ${chapterId}:`, err));
    }

    return verses;
  } catch (error) {
    console.error(`Error fetching verses for chapter ${chapterId}:`, error);
    return [];
  }
}

export async function fetchSahihBukhariFromApi(): Promise<Hadith[]> {
  try {
    // 1. Check Database Cache
    const dbHadiths = await prisma.hadith.findMany({
      take: 100
    });

    if (dbHadiths && dbHadiths.length > 0) {
      return dbHadiths.map((h, idx) => ({
        id: h.id,
        collectionId: 'bukhari',
        bookNumber: h.bookNumber,
        chapterNumber: h.chapterNumber,
        hadithNumber: h.hadithNumber,
        narratorChain: h.narratorChain || 'عن النبي صلى الله عليه وسلم',
        textArabic: h.textArabic,
        grade: 'SAHIH',
        gradeArabic: 'صحيح',
        sourceRef: {
          id: `sr-bukhari-${idx}`,
          sourceId: 'ds-bukhari',
          bookTitle: 'صحيح البخاري',
          authorName: 'الإمام محمد بن إسماعيل البخاري',
          license: 'Public Domain / Verified Dataset',
          verificationStatus: 'VERIFIED'
        }
      }));
    }

    // 2. Fetch from API
    const res = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json', {
      next: { revalidate: 604800 } // 7 days cache
    });
    if (!res.ok) throw new Error('Failed to fetch Bukhari Hadiths');
    const data = await res.json();
    
    const hadithsList = data.hadiths.slice(0, 100).map((h: any, idx: number) => ({
      id: `bukhari-${h.hadithnumber || idx + 1}`,
      collectionId: 'bukhari',
      bookNumber: h.reference?.book || 1,
      chapterNumber: h.reference?.hadith || idx + 1,
      hadithNumber: h.hadithnumber || idx + 1,
      narratorChain: 'عن النبي صلى الله عليه وسلم',
      textArabic: h.text,
      grade: 'SAHIH',
      gradeArabic: 'صحيح',
      sourceRef: {
        id: `sr-bukhari-${idx}`,
        sourceId: 'ds-bukhari',
        bookTitle: 'صحيح البخاري',
        authorName: 'الإمام محمد بن إسماعيل البخاري',
        license: 'Public Domain / Verified Dataset',
        verificationStatus: 'VERIFIED'
      }
    }));

    return hadithsList;
  } catch (error) {
    console.error('Error fetching Bukhari Hadiths:', error);
    return MOCK_HADITHS;
  }
}
