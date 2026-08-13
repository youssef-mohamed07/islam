import { NextRequest, NextResponse } from 'next/server';
import { SanadSearchEngine } from '@/lib/searchEngine';
import { normalizeArabicText } from '@/lib/arabic';

const searchEngine = new SanadSearchEngine([
  {
    id: 'quran-2-153',
    type: 'quran',
    typeArabic: 'القرآن الكريم',
    title: 'سورة البقرة - الآية 153',
    textToSearch: 'يا ايها الذين امنوا استعينوا بالصبر والصلاة ان الله مع الصابرين',
    snippet: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ',
    sourceName: 'المصحف الشريف',
    url: '/quran/2/153'
  },
  {
    id: 'hadith-bukhari-1',
    type: 'hadith',
    typeArabic: 'الحديث الشريف',
    title: 'صحيح البخاري - حديث 1',
    textToSearch: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى',
    snippet: 'إنَّما الأَعْمالُ بالنِّيّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى',
    sourceName: 'صحيح البخاري',
    url: '/hadith/bukhari/1'
  }
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';

  const results = searchEngine.search(query, category);

  return NextResponse.json({
    query,
    normalizedQuery: normalizeArabicText(query),
    totalCount: results.length,
    results
  });
}
