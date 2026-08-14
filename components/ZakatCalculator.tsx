'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator, Coins, Landmark, TrendingUp, Info, Wheat, Users,
  HeartHandshake, Droplets, GraduationCap, Baby, Utensils, BookOpen,
  HandCoins, Sparkles, Heart, MessageCircleHeart,
} from 'lucide-react';
import { Header } from '@/components/Header';

type ZakatTab = 'maal' | 'fitr' | 'sadaqah';

export const ZakatCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ZakatTab>('maal');

  const tabs: { id: ZakatTab; label: string; icon: React.ReactNode }[] = [
    { id: 'maal', label: 'زكاة المال', icon: <Coins className="w-4 h-4" /> },
    { id: 'fitr', label: 'زكاة الفطر', icon: <Wheat className="w-4 h-4" /> },
    { id: 'sadaqah', label: 'الصدقة وأنواعها', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1412] pb-24">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C5A059]/20 text-[#C5A059] mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A2421] dark:text-[#F5F7F6] mb-2 font-arabic">
            الزكاة والصدقة
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            احسب زكاة مالك وزكاة فطرك، وتعرّف على أنواع الصدقة وفضلها
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center gap-1 bg-white dark:bg-[#151F1C] border border-[#C5A059]/20 rounded-2xl p-1.5 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#153B2F] text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'maal' && <ZakatAlmaalSection />}
        {activeTab === 'fitr' && <ZakatAlfitrSection />}
        {activeTab === 'sadaqah' && <SadaqahSection />}
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* زكاة المال                                                          */
/* ------------------------------------------------------------------ */

const ZakatAlmaalSection: React.FC = () => {
  const [goldPrice, setGoldPrice] = useState<number>(0); // Price per gram
  const [currency, setCurrency] = useState('USD');

  const [cash, setCash] = useState<number>(0);
  const [goldValue, setGoldValue] = useState<number>(0);
  const [silverValue, setSilverValue] = useState<number>(0);
  const [stocksValue, setStocksValue] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0); // الديون المستحقة على المزكي

  const [isLoading, setIsLoading] = useState(true);

  // Nisab is roughly 85 grams of 24k gold
  const nisabThreshold = goldPrice * 85;

  const totalWealth = Math.max(cash + goldValue + silverValue + stocksValue - debts, 0);
  const isEligible = totalWealth >= nisabThreshold && nisabThreshold > 0;
  const zakatAmount = isEligible ? totalWealth * 0.025 : 0;

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        // Mock price fallback; replace with live API when available
        setTimeout(() => {
          setGoldPrice(75);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setGoldPrice(75);
        setIsLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  const recipients = [
    { name: 'الفقراء', desc: 'من لا يجدون كفايتهم الأساسية' },
    { name: 'المساكين', desc: 'من لا يكاد مالهم يكفي حاجتهم' },
    { name: 'العاملون عليها', desc: 'الذين يجمعون الزكاة ويوزعونها' },
    { name: 'المؤلفة قلوبهم', desc: 'من يُرجى إسلامهم أو تثبيتهم' },
    { name: 'في الرقاب', desc: 'عتق الرقيق وفك الأسرى' },
    { name: 'الغارمون', desc: 'المدينون العاجزون عن السداد' },
    { name: 'في سبيل الله', desc: 'الإنفاق على الجهاد والدعوة' },
    { name: 'ابن السبيل', desc: 'المسافر المنقطع عن ماله' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#151F1C] rounded-2xl p-6 border border-[#C5A059]/20 shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">الأصول النقدية والمالية</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">النقد المدخر (في البنك أو المنزل)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Coins className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={cash || ''}
                    onChange={(e) => setCash(Number(e.target.value))}
                    className="block w-full pr-10 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">قيمة الذهب المدخر (غير الحلي للاستخدام)</label>
                <input
                  type="number"
                  min="0"
                  value={goldValue || ''}
                  onChange={(e) => setGoldValue(Number(e.target.value))}
                  className="block w-full border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">قيمة الفضة المدخرة</label>
                <input
                  type="number"
                  min="0"
                  value={silverValue || ''}
                  onChange={(e) => setSilverValue(Number(e.target.value))}
                  className="block w-full border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الأسهم والصناديق الاستثمارية</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={stocksValue || ''}
                    onChange={(e) => setStocksValue(Number(e.target.value))}
                    className="block w-full pr-10 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الديون المستحقة عليك (تُخصم من الوعاء)</label>
                <input
                  type="number"
                  min="0"
                  value={debts || ''}
                  onChange={(e) => setDebts(Number(e.target.value))}
                  className="block w-full border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#151F1C] rounded-2xl p-6 border border-[#C5A059]/20 shadow-sm">
            <h2 className="text-xl font-bold mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">مصارف الزكاة الثمانية</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              قال تعالى: ﴿إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ﴾ [التوبة: 60]
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipients.map((r, i) => (
                <div key={r.name} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#153B2F] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
              <Landmark className="w-32 h-32" />
            </div>

            <h2 className="text-lg font-bold mb-6 text-emerald-100">ملخص الحساب</h2>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-3 border-b border-emerald-800">
                <span className="text-emerald-200">إجمالي الأصول (بعد خصم الديون)</span>
                <span className="font-mono font-bold">{totalWealth.toLocaleString()} {currency}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-emerald-800">
                <span className="text-emerald-200">حد النصاب الحالي</span>
                {isLoading ? (
                  <span className="animate-pulse bg-emerald-800 h-5 w-20 rounded"></span>
                ) : (
                  <span className="font-mono">{nisabThreshold.toLocaleString()} {currency}</span>
                )}
              </div>

              <div className="pt-4">
                <div className="text-sm text-emerald-200 mb-1">الزكاة المستحقة (2.5%)</div>
                {isEligible ? (
                  <div className="text-4xl font-bold text-[#C5A059] font-mono">
                    {zakatAmount.toLocaleString()} <span className="text-lg">{currency}</span>
                  </div>
                ) : (
                  <div className="text-lg text-emerald-300">
                    لم تبلغ النصاب
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              يُشترط لوجوب زكاة المال بلوغ النصاب (قيمة 85 جراماً من الذهب عيار 24، والسعر المعتمد حالياً للجرام هو {goldPrice} {currency}) ومرور حولٍ كامل (عام هجري) على المال. نسبة الزكاة 2.5% من إجمالي الوعاء الزكوي.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* زكاة الفطر                                                          */
/* ------------------------------------------------------------------ */

const ZakatAlfitrSection: React.FC = () => {
  const [people, setPeople] = useState<number>(1);
  const [perPerson, setPerPerson] = useState<number>(10); // قيمة الصاع بالفرد بالنقد
  const [currency, setCurrency] = useState('USD');

  const totalAmount = people * perPerson;
  const totalKg = people * 2.5; // الصاع النبوي ≈ 2.5 – 3 كجم من القوت

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#151F1C] rounded-2xl p-6 border border-[#C5A059]/20 shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">حاسبة زكاة الفطر</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">عدد الأفراد (أنت ومن تعول)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={people || ''}
                  onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                  className="block w-full pr-10 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                قيمة الصاع للفرد الواحد بالنقد ({currency})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <HandCoins className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={perPerson || ''}
                  onChange={(e) => setPerPerson(Number(e.target.value))}
                  className="block w-full pr-10 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-[#C5A059] focus:border-[#C5A059] bg-gray-50 dark:bg-gray-800 p-3"
                  placeholder="10"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                الصاع النبوي ≈ 2.5 كجم من قوت البلد (قمح، أرز، تمر...)؛ أدخل قيمته النقدية حسب سعر بلدك أو ما تُعلنه دار الإفتاء.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151F1C] rounded-2xl p-6 border border-[#C5A059]/20 shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">أحكام زكاة الفطر</h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
              <span><strong className="font-semibold">حكمها:</strong> فريضةٌ على كل مسلم يملك ما يزيد عن قوته وقوت عياله يوم العيد وليلته؛ قال ابن عمر رضي الله عنهما: «فرض رسول الله ﷺ زكاة الفطر صاعاً من تمر أو صاعاً من شعير، على العبد والحر، والذكر والأنثى، والصغير والكبير من المسلمين» (متفق عليه).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
              <span><strong className="font-semibold">وقتها:</strong> تُخرج قبل صلاة العيد، وأفضل وقتٍ لها يوم العيد قبل الصلاة، ويجوز تقديمها بيوم أو يومين، ومن أخّرها عن الصلاة فهي صدقةٌ من الصدقات.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
              <span><strong className="font-semibold">مقدارها:</strong> صاعٌ من قوت البلد عن كل فرد (≈ 2.5 – 3 كجم). أجاز الحنفية إخراج القيمة نقداً إذا كانت أنفع للفقير، وهو ما تُفتي به كثيرٌ من دور الإفتاء اليوم.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
              <span><strong className="font-semibold">حكمتها:</strong> طُهرةٌ للصائم من اللغو والرفث، وطُعمةٌ للمساكين؛ قال ﷺ: «أغنوهم عن الطواف في هذا اليوم» (الدارقطني).</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#153B2F] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Wheat className="w-32 h-32" />
          </div>

          <h2 className="text-lg font-bold mb-6 text-emerald-100">ملخص زكاة الفطر</h2>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center pb-3 border-b border-emerald-800">
              <span className="text-emerald-200">عدد الأفراد</span>
              <span className="font-mono font-bold">{people}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-emerald-800">
              <span className="text-emerald-200">ما يعادلها طعاماً</span>
              <span className="font-mono">{totalKg.toLocaleString()} كجم</span>
            </div>

            <div className="pt-4">
              <div className="text-sm text-emerald-200 mb-1">إجمالي زكاة الفطر</div>
              <div className="text-4xl font-bold text-[#C5A059] font-mono">
                {totalAmount.toLocaleString()} <span className="text-lg">{currency}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            القيمة النقدية تختلف من بلدٍ لآخر بحسب سعر قوت البلد؛ يُستحسن اعتماد القيمة التي تُعلنها الجهات الشرعية الرسمية في بلدك.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* الصدقة وأنواعها                                                     */
/* ------------------------------------------------------------------ */

const SadaqahSection: React.FC = () => {
  const sadaqahTypes = [
    {
      icon: <Landmark className="w-6 h-6" />,
      title: 'الصدقة الجارية',
      desc: 'ما يستمر ثوابه بعد الموت: بناء مسجد، حفر بئر، وقف عقار، زراعة شجرة.',
      daleel: 'قال ﷺ: «إذا مات ابن آدم انقطع عمله إلا من ثلاث: صدقة جارية، أو علم يُنتفع به، أو ولد صالح يدعو له» (رواه مسلم)',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: <HandCoins className="w-6 h-6" />,
      title: 'صدقة المال',
      desc: 'بذل المال للمحتاجين والفقراء، سواء كانت زكاة واجبة أو تطوعاً.',
      daleel: 'قال ﷺ: «ما نقصت صدقة من مال» (رواه مسلم)',
      color: 'text-[#C5A059] bg-[#C5A059]/10',
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: 'إطعام الطعام',
      desc: 'إطعام الجائع، وتفطير الصائمين، وولائم الخير، وتوزيع وجبات على المحتاجين.',
      daleel: 'قال تعالى: ﴿وَيُطْعِمُونَ الطَّعَامَ عَلَى حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا﴾ [الإنسان: 8]',
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: 'سُقيا الماء',
      desc: 'حفر الآبار، وتوفير مياه الشرب، وسبل الماء في المساجد والطرقات.',
      daleel: 'قال ﷺ لسعد بن عبادة حين سأله عن أفضل الصدقة: «سقي الماء» (رواه أبو داود)',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: <Baby className="w-6 h-6" />,
      title: 'كفالة اليتيم',
      desc: 'رعاية الأيتام وكفالتهم مالياً وتعليمياً ونفسياً.',
      daleel: 'قال ﷺ: «أنا وكافل اليتيم في الجنة هكذا» وأشار بإصبعيه السبابة والوسطى (رواه البخاري)',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'العلم النافع',
      desc: 'تعليم الناس، ونشر الكتب، ودعم طلاب العلم، والمحتوى النافع.',
      daleel: 'قال ﷺ: «من سلك طريقاً يلتمس فيه علماً سهّل الله له به طريقاً إلى الجنة» (رواه مسلم)',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: <MessageCircleHeart className="w-6 h-6" />,
      title: 'الكلمة الطيبة والجاه',
      desc: 'الكلمة الحسنة، والشفاعة الحسنة، وقضاء حوائج الناس بجاهك ووقتك.',
      daleel: 'قال ﷺ: «والكلمة الطيبة صدقة» (متفق عليه)',
      color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'صدقة البدن',
      desc: 'إماطة الأذى عن الطريق، ومساعدة الضعيف، والتبسم في وجه أخيك.',
      daleel: 'قال ﷺ: «وإماطة الأذى عن الطريق صدقة» (متفق عليه)، وقال: «تبسمك في وجه أخيك صدقة» (رواه الترمذي)',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20',
    },
  ];

  const virtues = [
    'تُطفئ الخطايا: «الصدقة تُطفئ الخطيئة كما يُطفئ الماء النار» (رواه الترمذي)',
    'تُظل صاحبها يوم القيامة: «كل امرئ في ظل صدقته حتى يُفصل بين الناس» (رواه أحمد)',
    'تُبارك المال وتُنمّيه: «ما نقصت صدقة من مال» (رواه مسلم)',
    'تدفع البلاء: «صنائع المعروف تقي مصارع السوء» (رواه الطبراني)',
    'أحبها إلى الله أدومها وإن قلّت: «أحب الأعمال إلى الله أدومها وإن قلّ» (متفق عليه)',
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {sadaqahTypes.map((s) => (
          <div key={s.title} className="bg-white dark:bg-[#151F1C] rounded-2xl p-5 border border-[#C5A059]/20 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${s.color}`}>
                {s.icon}
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{s.desc}</p>
            <p className="text-xs text-[#153B2F] dark:text-[#C5A059] bg-[#FDFBF7] dark:bg-black/20 border border-[#C5A059]/15 rounded-xl p-3 leading-relaxed font-arabic mt-auto">
              {s.daleel}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#153B2F] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Heart className="w-32 h-32" />
        </div>
        <h2 className="text-xl font-bold mb-5 text-emerald-100 relative z-10">من فضائل الصدقة</h2>
        <ul className="space-y-3 relative z-10">
          {virtues.map((v) => (
            <li key={v} className="flex items-start gap-3 text-sm leading-relaxed text-emerald-50">
              <HeartHandshake className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span className="font-arabic">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
