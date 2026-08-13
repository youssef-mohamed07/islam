import { PrismaClient } from '@prisma/client';
import { MOCK_SURAHS, MOCK_HADITHS } from '../components/MockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Surahs
  console.log('📖 Seeding Surahs...');
  for (const surah of MOCK_SURAHS) {
    await prisma.surah.upsert({
      where: { id: surah.id },
      update: {
        nameArabic: surah.nameArabic,
        nameComplex: surah.nameComplex,
        nameEnglish: surah.nameEnglish,
        revelationPlace: surah.revelationPlace,
        versesCount: surah.versesCount,
        revelationOrder: surah.revelationOrder,
        bismillahPre: surah.bismillahPre,
        pageStart: surah.pages[0],
        pageEnd: surah.pages[1],
      },
      create: {
        id: surah.id,
        nameArabic: surah.nameArabic,
        nameComplex: surah.nameComplex,
        nameEnglish: surah.nameEnglish,
        revelationPlace: surah.revelationPlace,
        versesCount: surah.versesCount,
        revelationOrder: surah.revelationOrder,
        bismillahPre: surah.bismillahPre,
        pageStart: surah.pages[0],
        pageEnd: surah.pages[1],
      },
    });
  }

  // 2. Seed Hadith Collection & Hadiths
  console.log('📜 Seeding Hadiths...');
  await prisma.hadithCollection.upsert({
    where: { slug: 'bukhari' },
    update: {},
    create: {
      id: 'bukhari',
      slug: 'bukhari',
      nameArabic: 'صحيح البخاري',
      nameEnglish: 'Sahih al-Bukhari',
      authorName: 'الإمام محمد بن إسماعيل البخاري',
      totalHadiths: MOCK_HADITHS.length,
      hasGrading: true,
    },
  });

  for (const h of MOCK_HADITHS) {
    await prisma.hadith.upsert({
      where: { id: h.id },
      update: {
        textArabic: h.textArabic,
      },
      create: {
        id: h.id,
        collectionId: 'bukhari',
        bookNumber: h.bookNumber,
        chapterNumber: h.chapterNumber,
        hadithNumber: h.hadithNumber,
        narratorChain: h.narratorChain,
        textArabic: h.textArabic,
        gradeArabic: h.gradeArabic,
      },
    });
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
