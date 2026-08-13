import { Surah, Hadith, TafsirBook, FiqhRuling, SeerahEvent, Scholar, Book, Dhikr, Qiraah, Reciter } from '@/lib/types';

export const MOCK_SURAHS: Surah[] = [
  {
    id: 1,
    nameArabic: "الفاتحة",
    nameComplex: "Al-Fātihah",
    nameEnglish: "The Opening",
    revelationPlace: "Makkah",
    versesCount: 7,
    revelationOrder: 5,
    bismillahPre: false,
    pages: [1, 1]
  },
  {
    id: 2,
    nameArabic: "البقرة",
    nameComplex: "Al-Baqarah",
    nameEnglish: "The Cow",
    revelationPlace: "Madinah",
    versesCount: 286,
    revelationOrder: 87,
    bismillahPre: true,
    pages: [2, 49]
  },
  {
    id: 36,
    nameArabic: "يس",
    nameComplex: "Yā-Sīn",
    nameEnglish: "Ya Sin",
    revelationPlace: "Makkah",
    versesCount: 83,
    revelationOrder: 41,
    bismillahPre: true,
    pages: [440, 445]
  },
  {
    id: 67,
    nameArabic: "الملك",
    nameComplex: "Al-Mulk",
    nameEnglish: "The Sovereignty",
    revelationPlace: "Makkah",
    versesCount: 30,
    revelationOrder: 77,
    bismillahPre: true,
    pages: [562, 564]
  },
  {
    id: 112,
    nameArabic: "الإخلاص",
    nameComplex: "Al-Ikhlāṣ",
    nameEnglish: "The Sincerity",
    revelationPlace: "Makkah",
    versesCount: 4,
    revelationOrder: 22,
    bismillahPre: true,
    pages: [604, 604]
  }
];

export const MOCK_AYAH_SAMPLE = [
  {
    surahId: 1,
    ayahNumber: 1,
    textUthmanic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    textSimple: "بسم الله الرحمن الرحيم",
    translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    tafsirSaadi: "افتتاح لكتاب الله، وتبرك باسمه سبحانه وتصريح برحمته الواسعة.",
    tafsirIbnKathir: "البسملة آية من كتاب الله، يفتتح بها القارئ تبركاً واستعانة بالله تعالى."
  },
  {
    surahId: 1,
    ayahNumber: 2,
    textUthmanic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    textSimple: "الحمد لله رب العالمين",
    translationEn: "[All] praise is [due] to Allah, Lord of the worlds -",
    tafsirSaadi: "الثناء على الله بصفات كماله ونعمه الظاهرة والباطنة على خلقه.",
    tafsirIbnKathir: "الحمد لله هو الشكر لله خالصاً دون سائر ما يُعبد من دونه."
  },
  {
    surahId: 2,
    ayahNumber: 153,
    textUthmanic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
    textSimple: "يا ايها الذين امنوا استعينوا بالصبر والصلاة ان الله مع الصابرين",
    translationEn: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    tafsirSaadi: "أمر الله المؤمنين بالاستعانة على أمور دينهم ودنياهم بالصبر والصلاة، فإن الصبر يحبس النفس عن المكاره والصلاة تنهى عن الفحشاء والمنكر.",
    tafsirIbnKathir: "بين تعالى أن أجود ما يُستعان به على تحمّل المصائب والقيام بالعبادات هو الصبر والصلاة."
  }
];

export const MOCK_HADITHS: Hadith[] = [
  {
    id: "h-bukhari-1",
    collectionId: "bukhari",
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 1,
    narratorChain: "عن أمير المؤمنين عمر بن الخطاب رضي الله عنه",
    textArabic: "إنَّما الأَعْمالُ بالنِّيّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى، فمَن كانَتْ هِجْرَتُهُ إلى دُنْيا يُصِيبُها، أوْ إلى امْرَأَةٍ يَنْكِحُها، فَهِجْرَتُهُ إلى ما هاجَرَ إلَيْهِ.",
    textEnglish: "Actions are but by intentions, and every person shall have only that which he intended...",
    grade: "SAHIH",
    gradeArabic: "صحيح",
    sourceRef: {
      id: "sr-bukhari",
      sourceId: "ds-bukhari",
      bookTitle: "صحيح البخاري",
      authorName: "الإمام محمد بن إسماعيل البخاري",
      license: "Public Domain / verified dataset",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "h-muslim-45",
    collectionId: "muslim",
    bookNumber: 1,
    chapterNumber: 8,
    hadithNumber: 45,
    narratorChain: "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم:",
    textArabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ.",
    textEnglish: "He who believes in Allah and the Last Day, let him speak good or remain silent...",
    grade: "SAHIH",
    gradeArabic: "صحيح",
    sourceRef: {
      id: "sr-muslim",
      sourceId: "ds-muslim",
      bookTitle: "صحيح مسلم",
      authorName: "الإمام مسلم بن الحجاج النيسابوري",
      license: "Public Domain / verified dataset",
      verificationStatus: "VERIFIED"
    }
  }
];

export const MOCK_FIQH_RULINGS: FiqhRuling[] = [
  {
    id: "fiqh-1",
    topicArabic: "حكم المسح على الخفين في الوضوء",
    topicEnglish: "Wiping over leather socks during Wudu",
    madhhab: "Hanafi",
    madhhabArabic: "الحنفي",
    rulingSummary: "جائز للمقيم يوماً وليلة وللمسافر ثلاثة أيام ولياليها بشرط لبسهما على طهارة كاملة.",
    evidence: "حديث المغيرة بن شعبة رضي الله عنه: 'توضأ النبي صلى الله عليه وسلم ومسح على الخفين'.",
    sourceBook: "مبسط الفقه الحنفي / الهداية للمرغيناني",
    scholarName: "الإمام أبو حنيفة النعمان",
    sourceRef: {
      id: "sr-fiqh-1",
      sourceId: "ds-fiqh",
      bookTitle: "المبسوط للإمام السرخسي",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "fiqh-2",
    topicArabic: "حكم المسح على الخفين في الوضوء",
    topicEnglish: "Wiping over leather socks during Wudu",
    madhhab: "Maliki",
    madhhabArabic: "المالكي",
    rulingSummary: "جائز بلا توقيت محدد للمقيم والمسافر ما لم ينزعهما أو تجنب الغسل.",
    evidence: "عموم الأحاديث الصحيحة الواردة في المسح دون تحديد المدة في بعض الروايات.",
    sourceBook: "المدونة / بداية المجتهد لابن رشد",
    scholarName: "الإمام مالك بن أَنَس",
    sourceRef: {
      id: "sr-fiqh-2",
      sourceId: "ds-fiqh",
      bookTitle: "المدونة الكبرى",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "fiqh-3",
    topicArabic: "حكم المسح على الخفين في الوضوء",
    topicEnglish: "Wiping over leather socks during Wudu",
    madhhab: "Shafi'i",
    madhhabArabic: "الشافعي",
    rulingSummary: "يشترط أن يكون الخف ساتراً لمحل الفرض وقوياً يمكن متابعة المشي عليه.",
    evidence: "حديث علي بن أبي طالب رضي الله عنه: 'جعل رسول الله ثلاثة أيام ولياليهن للمسافر ويوماً وليلة للمقيم'.",
    sourceBook: "الأم للإمام الشافعي / المجموع للنواوي",
    scholarName: "الإمام محمد بن إدريس الشافعي",
    sourceRef: {
      id: "sr-fiqh-3",
      sourceId: "ds-fiqh",
      bookTitle: "الأم للشافعي",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "fiqh-4",
    topicArabic: "حكم المسح على الخفين في الوضوء",
    topicEnglish: "Wiping over leather socks during Wudu",
    madhhab: "Hanbali",
    madhhabArabic: "الحنبلي",
    rulingSummary: "يجوز المسح على الخفين والجوربين الصفيقين (الشراب الثخين) إذا ثبت بنفسه.",
    evidence: "حديث ثوبان رضي الله عنه أن النبي صلى الله عليه وسلم أمره بالمسح على العصائب والتساخين.",
    sourceBook: "المغني لابن قدامة المقدسي",
    scholarName: "الإمام أحمد بن حنبل",
    sourceRef: {
      id: "sr-fiqh-4",
      sourceId: "ds-fiqh",
      bookTitle: "المغني لابن قدامة",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  }
];

export const MOCK_SEERAH_EVENTS: SeerahEvent[] = [
  {
    id: "seerah-1",
    titleArabic: "نزول الوحي في غار حراء",
    titleEnglish: "First Revelation at Cave Hira",
    era: "العهد المكي المبكر",
    yearHijri: -13,
    yearAH: 610,
    description: "في رمضان من العام الأربعين من عمر النبي صلى الله عليه وسلم نزل عليه الملك جبريل عليه السلام بقوله تعالى: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾.",
    location: "جبل النور - مكة المكرمة"
  },
  {
    id: "seerah-2",
    titleArabic: "الهجرة النبوية إلى المدينة المنورة",
    titleEnglish: "The Prophet's Migration (Hijrah) to Madinah",
    era: "الهجرة",
    yearHijri: 1,
    yearAH: 622,
    description: "خروج النبي صلى الله عليه وسلم مع صاحبه أبي بكر الصديق من مكة ووصولهما بسلام إلى قباء والمدينة المنورة وتأسيس أول دولة إسلامية.",
    location: "مكة المكرمة ← المدينة المنورة"
  },
  {
    id: "seerah-3",
    titleArabic: "غزوة بدر الكبرى",
    titleEnglish: "The Great Battle of Badr",
    era: "العهد المدني",
    yearHijri: 2,
    yearAH: 624,
    description: "أول معركة فاصلة بين المسلمين وقريش في 17 رمضان، وانتصار المسلمين المؤزر ونزول الملائكة لتثبيتهم.",
    location: "بدر (جنوب غرب المدينة المنورة)"
  }
];

export const MOCK_SCHOLARS: Scholar[] = [
  {
    id: "scholar-bukhari",
    nameArabic: "الإمام محمد بن إسماعيل البخاري",
    nameEnglish: "Imam Muhammad al-Bukhari",
    title: "أمير المؤمنين في الحديث",
    birthYearAH: 194,
    deathYearAH: 256,
    era: "العصر العباسي Golden Age",
    biography: "إمام الحفاظ وأحد كبار علماء الحديث في التاريخ الإسلامي. صنف كتاب الجامع الصحيح الذي يعد أصح كتاب بعد كتاب الله تعالى.",
    famousWorks: ["صحيح البخاري", "التاريخ الكبير", "الأدب المفرد"],
    fieldOfExpertise: ["علم الحديث", "الجرح والتعديل", "الفقه"]
  },
  {
    id: "scholar-ibn-kathir",
    nameArabic: "الحافظ ابن كثير الدمشقي",
    nameEnglish: "Ibn Kathir",
    title: "عماد الدين أبو الفداء",
    birthYearAH: 701,
    deathYearAH: 774,
    era: "العصر المملوكي",
    biography: "محدث ومؤرخ ومفسر شامي شهير، تلميذ شيخ الإسلام ابن تيمية. صاحب تفسير القرآن العظيم وكتاب البداية والنهاية.",
    famousWorks: ["تفسير ابن كثير", "البداية والنهاية", "جامع المسانيد والسنن"],
    fieldOfExpertise: ["التفسير", "التاريخ", "الحديث"]
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: "book-1",
    titleArabic: "تفسير القرآن العظيم (تفسير ابن كثير)",
    authorName: "الحافظ ابن كثير",
    category: "التفسير",
    description: "أشهر ما دون في التفسير بالمأثور، يعتمد على تفسير القرآن بالقرآن ثم بالسنة النبوية وآثار الصحابة.",
    license: "Public Domain / ملك عام",
    sourceRef: {
      id: "sr-b-1",
      sourceId: "ds-books",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "book-2",
    titleArabic: "زاد المعاد في هدي خير العباد",
    authorName: "الإمام ابن قيم الجوزية",
    category: "السيرة والفقه",
    description: "كتاب حافل يجمع بين سيرة النبي صلى الله عليه وسلم وهديه في عباداته وأخلاقه وطبه ومعاملاته.",
    license: "Public Domain / ملك عام",
    sourceRef: {
      id: "sr-b-2",
      sourceId: "ds-books",
      license: "Public Domain",
      verificationStatus: "VERIFIED"
    }
  }
];

export const MOCK_ADHKAR: Dhikr[] = [
  {
    id: "adhkar-1",
    category: "morning",
    categoryArabic: "أذكار الصباح",
    textArabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    translation: "We have entered upon the morning and the Kingdom belongs to Allah...",
    count: 1,
    benefit: "من قالها حين يصبح حُفظ في يومه وشُكرت نعمة صباحه.",
    sourceRef: {
      id: "sr-adh-1",
      sourceId: "ds-adhkar",
      bookTitle: "صحيح مسلم",
      license: "Verified",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "adhkar-2",
    category: "morning",
    categoryArabic: "أذكار الصباح",
    textArabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.",
    translation: "O Allah, by You we enter the morning and by You we enter the evening...",
    count: 1,
    benefit: "سنة نبوية جليلة تجدد العهد مع الله تعالى كل صباح.",
    sourceRef: {
      id: "sr-adh-2",
      sourceId: "ds-adhkar",
      bookTitle: "سنن أبي داود والترمذي",
      license: "Verified",
      verificationStatus: "VERIFIED"
    }
  },
  {
    id: "adhkar-3",
    category: "sleep",
    categoryArabic: "أذكار النوم",
    textArabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
    translation: "In Your name, my Lord, I lay down my side and by Your grace I raise it...",
    count: 1,
    benefit: "حفظ النفس والروح عند النوم.",
    sourceRef: {
      id: "sr-adh-3",
      sourceId: "ds-adhkar",
      bookTitle: "متفق عليه (البخاري ومسلم)",
      license: "Verified",
      verificationStatus: "VERIFIED"
    }
  }
];

export const MOCK_RECITERS: Reciter[] = [
  {
    id: "reciter-minshawi",
    nameArabic: "الشيخ محمد صديق المنشاوي",
    nameEnglish: "Mohamed Siddiq El-Minshawi",
    bio: "من أعلام القراء المصريين، تميز بأسلوبه الخاشع والباكي في تلاوة القرآن الكريم.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-husary",
    nameArabic: "الشيخ محمود خليل الحصري",
    nameEnglish: "Mahmoud Khalil Al-Husary",
    bio: "شيخ عموم المقارئ المصرية الأسبق، رائد التلاوة المرتلة المنضبطة بأحكام التجويد.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-abdulbasit",
    nameArabic: "الشيخ عبد الباسط عبد الصمد",
    nameEnglish: "Abdul Basit Abdul Samad",
    bio: "صاحب الصوت الذهبي والحنجرة الماسية، أحد أشهر قراء القرآن الكريم في العالم الإسلامي.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-alafasy",
    nameArabic: "الشيخ مشاري راشد العفاسي",
    nameEnglish: "Mishary Rashid Alafasy",
    bio: "قارئ كويتي شهير، يتميز بصوته العذب وأدائه المتقن، وله تسجيلات منتشرة في أنحاء العالم.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-sudais",
    nameArabic: "الشيخ عبد الرحمن السديس",
    nameEnglish: "Abdurrahman As-Sudais",
    bio: "إمام وخطيب المسجد الحرام بمكة المكرمة، من أشهر أئمة الحرمين الشريفين.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-shuraim",
    nameArabic: "الشيخ سعود الشريم",
    nameEnglish: "Saud Ash-Shuraim",
    bio: "إمام المسجد الحرام، يتميز بتلاوته الخاشعة المؤثرة وصوته الجهوري.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-shatri",
    nameArabic: "الشيخ أبو بكر الشاطري",
    nameEnglish: "Abu Bakr Ash-Shatri",
    bio: "قارئ سعودي من أهل مكة، يتميز بصوته الندي وأدائه العذب في التلاوة.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-hudhaify",
    nameArabic: "الشيخ علي الحذيفي",
    nameEnglish: "Ali Al-Hudhaify",
    bio: "إمام المسجد النبوي الشريف بالمدينة المنورة، من أعلام القراء في الحرمين.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-ajamy",
    nameArabic: "الشيخ أحمد العجمي",
    nameEnglish: "Ahmed Al-Ajamy",
    bio: "قارئ سعودي مشهور بصوته الخاشع المميز وتلاوته المؤثرة للقرآن الكريم.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-abdulbasit-mujawwad",
    nameArabic: "الشيخ عبد الباسط عبد الصمد (مجوّد)",
    nameEnglish: "Abdul Basit Abdul Samad (Mujawwad)",
    bio: "التلاوة المجوّدة للشيخ عبد الباسط، تتميز بالتأني والترتيل والمقامات الموسيقية.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-ghamdi",
    nameArabic: "الشيخ سعد الغامدي",
    nameEnglish: "Saad Al-Ghamdi",
    bio: "قارئ سعودي يتميز بصوته الجميل وأسلوبه في التلاوة، من أشهر القراء المعاصرين.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-juhayny",
    nameArabic: "الشيخ عبد الله عواد الجهني",
    nameEnglish: "Abdullah Awad Al-Juhany",
    bio: "إمام المسجد الحرام بمكة المكرمة، يتميز بصوته القوي وتلاوته المتقنة.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-maher",
    nameArabic: "الشيخ ماهر المعيقلي",
    nameEnglish: "Maher Al-Muaiqly",
    bio: "إمام المسجد الحرام، يتميز بصوته الرخيم وأدائه المؤثر في صلاة التراويح.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-banna",
    nameArabic: "الشيخ محمود علي البنا",
    nameEnglish: "Mahmoud Ali Al-Banna",
    bio: "من كبار قراء مصر، تميز بصوته الرائع وإتقانه لأحكام التجويد.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-tablawi",
    nameArabic: "الشيخ محمد الطبلاوي",
    nameEnglish: "Mohamed Al-Tablawi",
    bio: "نقيب قراء مصر الأسبق، من أعلام التلاوة المصرية ذو الصوت القوي المميز.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  },
  {
    id: "reciter-dosari",
    nameArabic: "الشيخ ياسر الدوسري",
    nameEnglish: "Yasser Ad-Dosari",
    bio: "إمام المسجد الحرام، من القراء الشباب المتميزين بصوتهم الخاشع والمؤثر.",
    riwayahId: "hafs",
    hasGaplessAudio: true
  }
];
