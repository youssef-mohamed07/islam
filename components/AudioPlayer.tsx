'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  X,
  Music,
  Volume2,
  VolumeX,
  Brain,
  Loader2,
  Moon,
  Sparkles,
  Plane,
  Smartphone,
  ShieldCheck,
  Download,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  Radio,
  BellOff,
  PhoneOff,
  HelpCircle,
} from 'lucide-react';
import { MOCK_RECITERS } from './MockData';

interface AudioPlayerProps {
  currentTrack: {
    surahId?: number;
    surahName: string;
    ayahNumber: number;
    reciterName: string;
    playMode?: 'verse' | 'surah';
    totalVerses?: number;
    audioUrl?: string;
  } | null;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentTrack, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [selectedReciterKey, setSelectedReciterKey] = useState('Minshawy_Murattal_128kbps');
  const [isMuted, setIsMuted] = useState(false);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number>(1);

  // Khushu' & Uninterrupted Mode State (وضع الخشوع)
  const [isKhushuMode, setIsKhushuMode] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [showKhushuGuide, setShowKhushuGuide] = useState(false);
  const [showKhushuToast, setShowKhushuToast] = useState<string | null>(null);
  const [isFullScreenKhushu, setIsFullScreenKhushu] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'airplane' | 'dnd' | 'autoResume'>('airplane');

  // Offline Caching State
  const [isOfflineDownloading, setIsOfflineDownloading] = useState(false);
  const [offlineDownloadProgress, setOfflineDownloadProgress] = useState(0);
  const [isSurahCached, setIsSurahCached] = useState(false);

  // Memorization Mode State
  const [isMemMode, setIsMemMode] = useState(false);
  const [memStartAyah, setMemStartAyah] = useState<number>(1);
  const [memEndAyah, setMemEndAyah] = useState<number>(1);
  const [ayahRepeatCount, setAyahRepeatCount] = useState<number>(1);
  const [currentAyahRepeat, setCurrentAyahRepeat] = useState<number>(0);
  const [blockRepeatCount, setBlockRepeatCount] = useState<number>(1);
  const [currentBlockRepeat, setCurrentBlockRepeat] = useState<number>(0);
  const [showMemSettings, setShowMemSettings] = useState(false);

  // Drag State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartElementPos = useRef({ x: 0, y: 0 });

  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const activePlayerIdRef = useRef<1 | 2>(1);
  const autoAdvanceInProgress = useRef(false);
  const interruptedDuringPlaybackRef = useRef(false);
  const wakeLockSentinelRef = useRef<any>(null);

  const getPlayers = () => {
    const active = activePlayerIdRef.current === 1 ? audio1Ref.current : audio2Ref.current;
    const inactive = activePlayerIdRef.current === 1 ? audio2Ref.current : audio1Ref.current;
    return { active, inactive };
  };

  const reciterFolders: Record<string, string> = {
    'reciter-minshawi': 'Minshawy_Murattal_128kbps',
    'reciter-husary': 'Husary_128kbps',
    'reciter-abdulbasit': 'Abdul_Basit_Murattal_192kbps',
    'reciter-alafasy': 'Alafasy_128kbps',
    'reciter-sudais': 'Abdurrahmaan_As-Sudais_192kbps',
    'reciter-shuraim': 'Saood_ash-Shuraym_128kbps',
    'reciter-shatri': 'Abu_Bakr_Ash-Shaatree_128kbps',
    'reciter-hudhaify': 'Hudhaify_128kbps',
    'reciter-ajamy': 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net',
    'reciter-abdulbasit-mujawwad': 'Abdul_Basit_Mujawwad_128kbps',
    'reciter-ghamdi': 'Saad_Al_Ghamdi_128kbps',
    'reciter-juhayny': 'Abdullaah_3awwaad_Al-Juhaynee_128kbps',
    'reciter-maher': 'MauroAl_Muaiqly128kbps',
    'reciter-banna': 'mahmoud_ali_al_banna_32kbps',
    'reciter-tablawi': 'Mohammad_al_Tablaway_128kbps',
    'reciter-dosari': 'Yasser_Ad-Dussary_128kbps',
  };

  const pad3 = (num: number) => String(num).padStart(3, '0');

  const buildAyahUrl = (surahNum: number, ayahNum: number, folder: string) => {
    return `https://everyayah.com/data/${folder}/${pad3(surahNum)}${pad3(ayahNum)}.mp3`;
  };

  const fullSurahServers: Record<string, string> = {
    'Minshawy_Murattal_128kbps': 'https://server10.mp3quran.net/minsh/',
    'Husary_128kbps': 'https://server13.mp3quran.net/husr/',
    'Abdul_Basit_Murattal_192kbps': 'https://server7.mp3quran.net/basit/',
    'Alafasy_128kbps': 'https://server8.mp3quran.net/afs/',
    'Abdurrahmaan_As-Sudais_192kbps': 'https://server11.mp3quran.net/sds/',
    'Saood_ash-Shuraym_128kbps': 'https://server7.mp3quran.net/shur/',
    'Abu_Bakr_Ash-Shaatree_128kbps': 'https://server11.mp3quran.net/shatri/',
    'Hudhaify_128kbps': 'https://server9.mp3quran.net/hthfi/',
    'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net': 'https://server10.mp3quran.net/ajm/',
    'Abdul_Basit_Mujawwad_128kbps': 'https://server7.mp3quran.net/basit_mjwd/',
    'Saad_Al_Ghamdi_128kbps': 'https://server10.mp3quran.net/s_gmd/',
    'Abdullaah_3awwaad_Al-Juhaynee_128kbps': 'https://server13.mp3quran.net/jhn/',
    'MauroAl_Muaiqly128kbps': 'https://server12.mp3quran.net/maher/',
    'mahmoud_ali_al_banna_32kbps': 'https://server8.mp3quran.net/banna/',
    'Mohammad_al_Tablaway_128kbps': 'https://server12.mp3quran.net/tblawi/',
    'Yasser_Ad-Dussary_128kbps': 'https://server11.mp3quran.net/yasser/',
  };

  // Check offline cache status
  useEffect(() => {
    if (!currentTrack || typeof window === 'undefined' || !('caches' in window)) return;
    const checkCache = async () => {
      try {
        const cache = await caches.open('sanad-quran-audio-v1');
        const surahNum = currentTrack.surahId || 1;
        const testUrl = fullSurahServers[selectedReciterKey]
          ? `${fullSurahServers[selectedReciterKey]}${pad3(surahNum)}.mp3`
          : buildAyahUrl(surahNum, 1, selectedReciterKey);
        const match = await cache.match(testUrl);
        setIsSurahCached(!!match);
      } catch {
        setIsSurahCached(false);
      }
    };
    checkCache();
  }, [currentTrack, selectedReciterKey]);

  // Request & Release Screen WakeLock
  const requestWakeLock = async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
        setIsWakeLockActive(true);
        wakeLockSentinelRef.current.addEventListener('release', () => {
          setIsWakeLockActive(false);
        });
      } catch (err) {
        console.warn('WakeLock error:', err);
        setIsWakeLockActive(false);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch {
        // ignore
      }
      wakeLockSentinelRef.current = null;
      setIsWakeLockActive(false);
    }
  };

  const triggerToast = (msg: string) => {
    setShowKhushuToast(msg);
    setTimeout(() => setShowKhushuToast(null), 4500);
  };

  const toggleKhushuMode = () => {
    const nextState = !isKhushuMode;
    setIsKhushuMode(nextState);
    if (nextState) {
      requestWakeLock();
      triggerToast('🌙 تم تفعيل وضع الخشوع: لن تنطفئ الشاشة وسيتم استئناف التلاوة تلقائياً عند أي مقاطعة.');
    } else {
      releaseWakeLock();
      triggerToast('تم إيقاف وضع الخشوع.');
    }
  };

  // Handle Offline Caching of current Surah
  const handleCacheSurahOffline = async () => {
    if (!currentTrack) return;
    if (typeof window === 'undefined' || !('caches' in window)) {
      alert('المتصفح لا يدعم التخزين المؤقت المباشر.');
      return;
    }

    setIsOfflineDownloading(true);
    setOfflineDownloadProgress(10);

    try {
      const cache = await caches.open('sanad-quran-audio-v1');
      const surahNum = currentTrack.surahId || 1;

      if (fullSurahServers[selectedReciterKey]) {
        const url = `${fullSurahServers[selectedReciterKey]}${pad3(surahNum)}.mp3`;
        setOfflineDownloadProgress(40);
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          setIsSurahCached(true);
          setOfflineDownloadProgress(100);
          triggerToast('✈️ تم حفظ السورة كاملة أوفلاين! يمكنك الآن تشغيل وضع الطيران للاستماع دون أي رنة أو إشعار.');
        }
      } else {
        const total = currentTrack.totalVerses || 7;
        for (let i = 1; i <= total; i++) {
          const url = buildAyahUrl(surahNum, i, selectedReciterKey);
          try {
            const res = await fetch(url);
            if (res.ok) await cache.put(url, res);
          } catch (err) {
            console.warn(`Failed caching verse ${i}`, err);
          }
          setOfflineDownloadProgress(Math.round((i / total) * 100));
        }
        setIsSurahCached(true);
        triggerToast('✈️ تم حفظ آيات السورة أوفلاين بنجاح!');
      }
    } catch (error) {
      console.error('Offline caching failed:', error);
      triggerToast('حدث خطأ أثناء تحميل السورة، يرجى المحاولة لاحقاً.');
    } finally {
      setIsOfflineDownloading(false);
    }
  };

  // Auto-Resume Interruption Recovery
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (isKhushuMode) {
          requestWakeLock();
        }
        if (isKhushuMode && interruptedDuringPlaybackRef.current) {
          interruptedDuringPlaybackRef.current = false;
          const { active } = getPlayers();
          if (active && active.paused) {
            active.play().then(() => {
              setIsPlaying(true);
              triggerToast('🕊️ تم استئناف التلاوة تلقائياً بعد انتهاء المقاطعة.');
            }).catch(console.error);
          }
        }
      }
    };

    const handleWindowFocus = () => {
      if (isKhushuMode && interruptedDuringPlaybackRef.current) {
        interruptedDuringPlaybackRef.current = false;
        const { active } = getPlayers();
        if (active && active.paused) {
          active.play().then(() => {
            setIsPlaying(true);
            triggerToast('🕊️ تم استئناف التلاوة تلقائياً بعد انتهاء المقاطعة.');
          }).catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isKhushuMode]);

  useEffect(() => {
    if (currentTrack) {
      setCurrentAyahNumber(currentTrack.ayahNumber);
      setMemStartAyah(currentTrack.ayahNumber);
      setMemEndAyah(Math.min(currentTrack.ayahNumber + 4, currentTrack.totalVerses || 286));
    }
  }, [currentTrack]);

  // Drag functionality
  const handleDragMove = React.useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;
    setPosition({
      x: dragStartElementPos.current.x + deltaX,
      y: dragStartElementPos.current.y + deltaY,
    });
  }, [isDragging]);

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select') || target.closest('input')) {
      return;
    }
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartElementPos.current = { ...position };
  };

  // Dual-Audio Engine Logic
  useEffect(() => {
    if (!currentTrack) return;
    const surahNum = currentTrack.surahId || 1;
    const total = currentTrack.totalVerses || 286;
    const { active, inactive } = getPlayers();

    if (!active || !inactive) return;

    if (currentTrack.playMode === 'surah' && fullSurahServers[selectedReciterKey]) {
      setIsAudioLoading(true);
      active.src = `${fullSurahServers[selectedReciterKey]}${pad3(surahNum)}.mp3`;
      active.playbackRate = playbackSpeed;
      active.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
        if (isKhushuMode) requestWakeLock();
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
        setIsAudioLoading(false);
      });
      return;
    }

    if (autoAdvanceInProgress.current) {
      autoAdvanceInProgress.current = false;
      const nextAyah = currentAyahNumber + 1;
      if (nextAyah <= total) {
        inactive.src = buildAyahUrl(surahNum, nextAyah, selectedReciterKey);
        inactive.playbackRate = playbackSpeed;
        inactive.load();
      }
      return;
    }

    setIsAudioLoading(true);
    active.src = currentTrack.audioUrl || buildAyahUrl(surahNum, currentAyahNumber, selectedReciterKey);
    active.playbackRate = playbackSpeed;

    active.play().then(() => {
      setIsPlaying(true);
      setIsAudioLoading(false);
      if (isKhushuMode) requestWakeLock();
    }).catch((err) => {
      console.warn('Audio play error:', err);
      setIsPlaying(false);
      setIsAudioLoading(false);
    });

    const nextAyah = currentAyahNumber + 1;
    if (nextAyah <= total) {
      inactive.src = buildAyahUrl(surahNum, nextAyah, selectedReciterKey);
      inactive.playbackRate = playbackSpeed;
      inactive.load();
    }
  }, [currentTrack, selectedReciterKey, currentAyahNumber]);

  // MediaSession API Integration
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `سورة ${currentTrack.surahName} ${currentTrack.playMode === 'surah' ? '(تلاوة كاملة)' : `- الآية ${currentAyahNumber}`}`,
        artist: MOCK_RECITERS.find(r => reciterFolders[r.id] === selectedReciterKey)?.nameArabic || 'القارئ',
        album: 'سَنَد — القرآن الكريم',
        artwork: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        const { active } = getPlayers();
        active?.play().then(() => {
          setIsPlaying(true);
          interruptedDuringPlaybackRef.current = false;
        }).catch(console.error);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        const { active } = getPlayers();
        active?.pause();
        setIsPlaying(false);
        interruptedDuringPlaybackRef.current = false;
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const { active } = getPlayers();
        if (active) active.currentTime = Math.max(0, active.currentTime - 5);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const { active } = getPlayers();
        if (active && duration) active.currentTime = Math.min(duration, active.currentTime + 5);
      });
    }
  }, [currentTrack, currentAyahNumber, selectedReciterKey, duration]);

  const togglePlay = () => {
    const { active } = getPlayers();
    if (!active) return;
    if (isPlaying) {
      interruptedDuringPlaybackRef.current = false;
      active.pause();
      setIsPlaying(false);
    } else {
      interruptedDuringPlaybackRef.current = false;
      setIsAudioLoading(true);
      active.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
        if (isKhushuMode) requestWakeLock();
      }).catch(console.error);
    }
  };

  const handleTimeUpdate = (playerId: 1 | 2) => {
    if (activePlayerIdRef.current !== playerId) return;
    const { active } = getPlayers();
    if (active) {
      setCurrentTime(active.currentTime);
      setDuration(active.duration || 0);
    }
  };

  const handleEnded = (playerId: 1 | 2) => {
    if (activePlayerIdRef.current !== playerId) return;
    const { active, inactive } = getPlayers();
    if (!active || !inactive) return;

    if (isMemMode) {
      if (currentAyahRepeat < ayahRepeatCount - 1) {
        setCurrentAyahRepeat(prev => prev + 1);
        active.currentTime = 0;
        active.play();
      } else {
        if (currentAyahNumber < memEndAyah) {
          setCurrentAyahRepeat(0);
          autoAdvanceInProgress.current = true;
          inactive.playbackRate = playbackSpeed;
          inactive.play().then(() => setIsPlaying(true)).catch(console.error);
          activePlayerIdRef.current = activePlayerIdRef.current === 1 ? 2 : 1;
          setCurrentAyahNumber(prev => prev + 1);
        } else {
          if (currentBlockRepeat < blockRepeatCount - 1) {
            setCurrentBlockRepeat(prev => prev + 1);
            setCurrentAyahRepeat(0);
            setCurrentAyahNumber(memStartAyah);
          } else {
            setIsPlaying(false);
            setIsMemMode(false);
            setCurrentBlockRepeat(0);
            setCurrentAyahRepeat(0);
          }
        }
      }
      return;
    }

    if (currentTrack?.playMode === 'surah' && fullSurahServers[selectedReciterKey]) {
      setIsPlaying(false);
      return;
    }

    if (isRepeat) {
      active.currentTime = 0;
      active.play();
    } else if (currentTrack?.playMode === 'surah' && currentTrack.totalVerses && currentAyahNumber < currentTrack.totalVerses) {
      autoAdvanceInProgress.current = true;
      inactive.playbackRate = playbackSpeed;
      inactive.play().then(() => setIsPlaying(true)).catch(console.error);
      activePlayerIdRef.current = activePlayerIdRef.current === 1 ? 2 : 1;
      setCurrentAyahNumber(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    const { active, inactive } = getPlayers();
    if (active) active.playbackRate = newSpeed;
    if (inactive) inactive.playbackRate = newSpeed;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Toast Feedback Notification */}
      {showKhushuToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F382C]/95 text-[#FDFBF7] border border-[#C5A059] px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs sm:text-sm font-arabic animate-in fade-in slide-in-from-top-4 flex items-center gap-2.5 max-w-md text-center">
          <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>{showKhushuToast}</span>
        </div>
      )}

      {/* Guide Modal: How to Listen Uninterrupted (Airplane + DND Guide) */}
      {showKhushuGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1412] border border-[#C5A059]/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl font-arabic space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#FDFBF7]">دليل الاستماع بدون انقطاع</h3>
                  <p className="text-xs text-emerald-300/70">كيف تمنع الرنات والإشعارات من قطع القرآن 100%</p>
                </div>
              </div>
              <button
                onClick={() => setShowKhushuGuide(false)}
                className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="flex rounded-xl bg-emerald-950/80 p-1 border border-emerald-800/40 text-xs">
              <button
                onClick={() => setActiveGuideTab('airplane')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'airplane'
                    ? 'bg-[#C5A059] text-gray-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                وضع الطيران (الأقوى)
              </button>
              <button
                onClick={() => setActiveGuideTab('dnd')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'dnd'
                    ? 'bg-[#C5A059] text-gray-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                وضع عدم الإزعاج
              </button>
              <button
                onClick={() => setActiveGuideTab('autoResume')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'autoResume'
                    ? 'bg-[#C5A059] text-gray-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                الاستئناف التلقائي
              </button>
            </div>

            {/* Tab Contents */}
            {activeGuideTab === 'airplane' && (
              <div className="space-y-3.5 text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#C5A059] text-gray-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <p>
                    اضغط على زر <strong>"تحميل السورة أوفلاين"</strong> لحفظ التلاوة مباشرة في ذاكرة هاتفك.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#C5A059] text-gray-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <p>
                    قم بتشغيل <strong>"وضع الطيران" (Airplane Mode ✈️)</strong> من هاتفك.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#C5A059] text-gray-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    ✓
                  </span>
                  <p className="text-emerald-300">
                    <strong>النتيجة:</strong> لن تصلك أي مكالمات أو إشعارات واتساب أو أي تطبيق آخر، وستعمل التلاوة بسلاسة تامة دون توقف!
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCacheSurahOffline}
                    disabled={isOfflineDownloading || isSurahCached}
                    className="w-full py-2.5 rounded-xl bg-[#C5A059] text-gray-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d6b063] transition-all disabled:opacity-75 shadow-lg"
                  >
                    {isOfflineDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الحفظ أوفلاين ({offlineDownloadProgress}%)
                      </>
                    ) : isSurahCached ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                        السورة محفوظة أوفلاين بالفعل ✓
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        تحميل سورة {currentTrack.surahName} أوفلاين الآن
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeGuideTab === 'dnd' && (
              <div className="space-y-3.5 text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
                <div>
                  <h4 className="font-bold text-[#C5A059] mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    في هواتف iPhone (iOS):
                  </h4>
                  <p className="text-xs text-gray-300">
                    اسحب مركز التحكم لأسفل، واضغط على <strong>Focus (التركيز)</strong> ثم اختر <strong>Do Not Disturb (عدم الإزعاج)</strong> لكتم الرنات والإشعارات.
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-900/50">
                  <h4 className="font-bold text-[#C5A059] mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    في هواتف Android:
                  </h4>
                  <p className="text-xs text-gray-300">
                    اسحب شريط الإشعارات لأسفل واضغط على أيقونة <strong>عدم الإزعاج (DND)</strong>، وتأكد من ضبط خيار كتم المكالمات والنوافذ المنبثقة.
                  </p>
                </div>
              </div>
            )}

            {activeGuideTab === 'autoResume' && (
              <div className="space-y-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/30">
                <p>
                  عند تفعيل <strong>"وضع الخشوع 🌙"</strong> في تطبيق سند:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-200">
                  <li>تبقى شاشة هاتفك مضاءة لمنع دخول المعالج في وضع السكون الذي قد يقطع الصوت.</li>
                  <li>إذا وردت مكالمة طارئة وانتهت، يقوم المشغل باستئناف التلاوة تلقائياً من نفس اللحظة.</li>
                  <li>يتم كتم أي تنبيهات أو أصوات تصدر من داخل المنصة.</li>
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowKhushuGuide(false)}
                className="px-5 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                فهمت ذلك، شكراً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Tranquil Khushu' Theater Mode */}
      {isFullScreenKhushu && (
        <div className="fixed inset-0 z-50 bg-[#07130F] text-white flex flex-col justify-between p-6 sm:p-10 font-arabic animate-in fade-in duration-300">
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C5A059] animate-pulse"></span>
              <span className="text-xs sm:text-sm text-[#C5A059] font-bold">وضع الخشوع والتلاوة الهادئة</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowKhushuGuide(true)}
                className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 hover:text-white text-xs flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <span className="hidden sm:inline">دليل منع المقاطعات</span>
              </button>
              <button
                onClick={() => setIsFullScreenKhushu(false)}
                className="p-2 rounded-xl bg-emerald-950 text-gray-300 hover:text-white"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full text-center space-y-6 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isWakeLockActive ? 'الشاشة مستمرة في الإضاءة لمنع الانقطاع' : 'وضع الخشوع نشط'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-quran text-[#FDFBF7] font-bold tracking-wide">
              سورة {currentTrack.surahName}
            </h2>

            <p className="text-base sm:text-xl text-[#C5A059] font-semibold">
              {MOCK_RECITERS.find(r => reciterFolders[r.id] === selectedReciterKey)?.nameArabic || currentTrack.reciterName}
            </p>

            <div className="text-xs text-emerald-300/80">
              {currentTrack.playMode === 'surah' ? 'تلاوة السورة كاملة' : `الآية رقم ${currentAyahNumber} من ${currentTrack.totalVerses || 286}`}
            </div>

            {/* Subtle Audio Waveform Visualizer Pulse */}
            <div className="flex items-center justify-center gap-1.5 h-12">
              {[40, 70, 100, 60, 90, 50, 80, 45, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 bg-[#C5A059] rounded-full transition-all duration-300 ${
                    isPlaying ? 'opacity-90 animate-pulse' : 'opacity-30'
                  }`}
                  style={{
                    height: isPlaying ? `${h}%` : '20%',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Offline notification badge */}
            <div className="pt-2 flex justify-center">
              {isSurahCached ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  محفوظة أوفلاين — يمكنك تفعيل وضع الطيران ✈️
                </span>
              ) : (
                <button
                  onClick={handleCacheSurahOffline}
                  disabled={isOfflineDownloading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-700/40 text-emerald-200 text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                  تحميل للاستماع بدون إنترنت مع وضع الطيران
                </button>
              )}
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-emerald-300 font-mono">
              <span>{formatTime(currentTime)}</span>
              <div
                className="flex-1 h-2 bg-emerald-950 rounded-full cursor-pointer overflow-hidden relative border border-emerald-800/40"
                onClick={(e) => {
                  const { active } = getPlayers();
                  if (!active || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = clickX / rect.width;
                  active.currentTime = pct * duration;
                }}
              >
                <div
                  className="h-full bg-[#C5A059] rounded-full"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => {
                  const { active } = getPlayers();
                  if (active) active.currentTime = Math.max(0, active.currentTime - 5);
                }}
                className="text-emerald-300 hover:text-white p-2"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isAudioLoading}
                className="w-16 h-16 rounded-full bg-[#C5A059] text-gray-950 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
              >
                {isAudioLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current mr-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  const { active } = getPlayers();
                  if (active) active.currentTime = Math.min(duration, active.currentTime + 5);
                }}
                className="text-emerald-300 hover:text-white p-2"
              >
                <SkipBack className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Audio Player Bar */}
      <div
        className={`fixed bottom-[95px] lg:bottom-0 left-2 right-2 lg:left-0 lg:right-0 z-40 bg-[#0F382C] lg:rounded-none rounded-2xl text-[#FDFBF7] border border-[#C5A059]/30 lg:border-t lg:border-x-0 lg:border-b-0 shadow-2xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing touch-none ${
          isDragging ? '' : 'transition-all'
        }`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Drag Handle (Mobile only) */}
        <div className="w-full flex justify-center pt-1.5 pb-0.5 lg:hidden">
          <div className="w-10 h-1 bg-[#C5A059]/40 rounded-full"></div>
        </div>

        {/* Dual Audio Engine */}
        <audio
          ref={audio1Ref}
          preload="auto"
          onTimeUpdate={() => handleTimeUpdate(1)}
          onEnded={() => handleEnded(1)}
          onLoadedMetadata={() => handleTimeUpdate(1)}
          onWaiting={() => activePlayerIdRef.current === 1 && setIsAudioLoading(true)}
          onCanPlay={() => activePlayerIdRef.current === 1 && setIsAudioLoading(false)}
          onPlaying={() => activePlayerIdRef.current === 1 && setIsAudioLoading(false)}
          onPause={() => {
            if (activePlayerIdRef.current === 1 && isPlaying && isKhushuMode) {
              interruptedDuringPlaybackRef.current = true;
            }
          }}
        />
        <audio
          ref={audio2Ref}
          preload="auto"
          onTimeUpdate={() => handleTimeUpdate(2)}
          onEnded={() => handleEnded(2)}
          onLoadedMetadata={() => handleTimeUpdate(2)}
          onWaiting={() => activePlayerIdRef.current === 2 && setIsAudioLoading(true)}
          onCanPlay={() => activePlayerIdRef.current === 2 && setIsAudioLoading(false)}
          onPlaying={() => activePlayerIdRef.current === 2 && setIsAudioLoading(false)}
          onPause={() => {
            if (activePlayerIdRef.current === 2 && isPlaying && isKhushuMode) {
              interruptedDuringPlaybackRef.current = true;
            }
          }}
        />

        {/* Memorization Settings Drawer */}
        {showMemSettings && (
          <div className="bg-[#0D1412]/95 border-b border-[#C5A059]/20 p-4 animate-in slide-in-from-bottom-2">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
              <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
                <label className="flex flex-col text-center">
                  <span className="text-xs text-gray-400 mb-1">من آية</span>
                  <input
                    type="number"
                    min="1"
                    max={currentTrack?.totalVerses || 286}
                    value={memStartAyah}
                    onChange={e => setMemStartAyah(Number(e.target.value))}
                    className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white"
                  />
                </label>
                <label className="flex flex-col text-center">
                  <span className="text-xs text-gray-400 mb-1">إلى آية</span>
                  <input
                    type="number"
                    min={memStartAyah}
                    max={currentTrack?.totalVerses || 286}
                    value={memEndAyah}
                    onChange={e => setMemEndAyah(Number(e.target.value))}
                    className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white"
                  />
                </label>
                <label className="flex flex-col text-center">
                  <span className="text-xs text-gray-400 mb-1">تكرار الآية</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={ayahRepeatCount}
                    onChange={e => setAyahRepeatCount(Number(e.target.value))}
                    className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white"
                  />
                </label>
                <label className="flex flex-col text-center">
                  <span className="text-xs text-gray-400 mb-1">تكرار المقطع</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={blockRepeatCount}
                    onChange={e => setBlockRepeatCount(Number(e.target.value))}
                    className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white"
                  />
                </label>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={() => {
                    setIsMemMode(true);
                    setCurrentAyahNumber(memStartAyah);
                    setCurrentAyahRepeat(0);
                    setCurrentBlockRepeat(0);
                    setShowMemSettings(false);
                    setIsPlaying(false);
                    setTimeout(() => {
                      const { active } = getPlayers();
                      if (active) active.play().then(() => setIsPlaying(true));
                    }, 100);
                  }}
                  className="bg-[#C5A059] text-gray-900 px-6 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
                >
                  بدء التحفيظ
                </button>
                <button
                  onClick={() => setShowMemSettings(false)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-2 lg:py-3 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-0">
            {/* Left/Start: Track Info & Reciter Selection */}
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div className="flex items-center space-x-3 space-x-reverse min-w-0 flex-1">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 relative">
                  {isAudioLoading ? (
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  ) : isKhushuMode ? (
                    <Moon className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlaying ? 'animate-pulse text-[#C5A059]' : ''}`} />
                  ) : isMemMode ? (
                    <Brain className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                  ) : (
                    <Music className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                  )}
                  {isMemMode && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">
                      {currentBlockRepeat + 1}/{blockRepeatCount}
                    </span>
                  )}
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="font-bold text-xs lg:text-sm text-white truncate min-w-0">
                      سورة {currentTrack.surahName} {currentTrack.playMode === 'surah' ? '- تلاوة كاملة' : `- الآية ${currentAyahNumber}`}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded shrink-0 font-medium ${
                        isKhushuMode
                          ? 'bg-[#C5A059] text-gray-950 font-bold'
                          : 'bg-[#C5A059]/20 text-[#C5A059]'
                      }`}
                    >
                      {isKhushuMode
                        ? 'وضع الخشوع 🌙'
                        : isMemMode
                        ? 'وضع التحفيظ الذكي'
                        : currentTrack.playMode === 'surah'
                        ? 'تلاوة متواصلة'
                        : 'تلاوة آية'}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200/80 flex items-center gap-2">
                    <select
                      value={selectedReciterKey}
                      onChange={(e) => setSelectedReciterKey(e.target.value)}
                      className="bg-transparent border-none p-0 text-emerald-200 focus:ring-0 cursor-pointer outline-none truncate max-w-[140px] sm:max-w-[200px] font-bold"
                    >
                      {MOCK_RECITERS.map(r => (
                        <option key={r.id} value={reciterFolders[r.id]} className="bg-emerald-950 text-white">
                          {r.nameArabic}
                        </option>
                      ))}
                    </select>
                    {isMemMode && (
                      <span className="text-[10px] bg-emerald-900/50 px-1.5 py-0.5 rounded shrink-0">
                        تكرار الآية: {currentAyahRepeat + 1}/{ayahRepeatCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Close Button */}
              <div className="flex lg:hidden items-center gap-1.5">
                <button
                  onClick={toggleKhushuMode}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isKhushuMode
                      ? 'bg-[#C5A059] text-gray-950 border-[#C5A059]'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  }`}
                  title="وضع الخشوع"
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle: Controls & Progress */}
            <div className="flex flex-col items-center space-y-1.5 w-full lg:w-auto">
              <div className="flex items-center space-x-3 space-x-reverse lg:space-x-4 lg:space-x-reverse justify-center w-full">
                {/* Khushu' Mode Toggle */}
                <button
                  onClick={toggleKhushuMode}
                  className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-bold ${
                    isKhushuMode
                      ? 'bg-[#C5A059] text-gray-950 border-[#C5A059] shadow-md'
                      : 'text-emerald-300/80 hover:text-[#C5A059] border-emerald-800/40 bg-emerald-950/40'
                  }`}
                  title="وضع الخشوع (تلاوة بدون انقطاع مع منع انطفاء الشاشة والاستئناف التلقائي)"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">الخشوع</span>
                </button>

                {/* Memorization Mode Toggle */}
                <button
                  onClick={() => setShowMemSettings(!showMemSettings)}
                  className={`p-1.5 rounded hover:bg-emerald-800 transition-colors ${
                    isMemMode || showMemSettings ? 'text-[#C5A059] bg-emerald-900/50' : 'text-emerald-300/60'
                  }`}
                  title="المحفظ الذكي"
                >
                  <Brain className="w-4 h-4" />
                </button>

                {/* Repeat Verse Toggle */}
                <button
                  onClick={() => {
                    setIsRepeat(!isRepeat);
                    setIsMemMode(false);
                  }}
                  className={`p-1.5 rounded hover:bg-emerald-800 transition-colors ${
                    isRepeat && !isMemMode ? 'text-[#C5A059]' : 'text-emerald-300/60'
                  }`}
                  title="تكرار الآية"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Rewind 5s */}
                <button
                  onClick={() => {
                    const { active } = getPlayers();
                    if (active) active.currentTime = Math.max(0, active.currentTime - 5);
                  }}
                  className="text-emerald-200 hover:text-white transition-colors"
                  title="تأخير 5 ثواني"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  disabled={isAudioLoading}
                  className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#C5A059] text-gray-950 flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0 disabled:opacity-80"
                >
                  {isAudioLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current mr-0.5" />
                  )}
                </button>

                {/* Forward 5s */}
                <button
                  onClick={() => {
                    const { active } = getPlayers();
                    if (active) active.currentTime = Math.min(duration, active.currentTime + 5);
                  }}
                  className="text-emerald-200 hover:text-white transition-colors"
                  title="تقديم 5 ثواني"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Playback Speed */}
                <button
                  onClick={handleSpeedChange}
                  className="text-[10px] lg:text-[11px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-[#C5A059] border border-[#C5A059]/30 shrink-0"
                >
                  {playbackSpeed}x
                </button>
              </div>

              {/* Progress Slider */}
              <div className="w-full lg:w-80 flex items-center space-x-2 space-x-reverse text-[10px] text-emerald-300/70 font-mono">
                <span>{formatTime(currentTime)}</span>
                <div
                  className="flex-1 h-1.5 bg-emerald-950 rounded-full cursor-pointer overflow-hidden relative"
                  onClick={(e) => {
                    const { active } = getPlayers();
                    if (!active || !duration) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    active.currentTime = pct * duration;
                  }}
                >
                  <div
                    className="h-full bg-[#C5A059] rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right/End: Khushu' Guide, Offline Download, Fullscreen, Mute & Close */}
            <div className="hidden lg:flex items-center space-x-2.5 space-x-reverse shrink-0">
              {/* Uninterrupted Guide Button */}
              <button
                onClick={() => setShowKhushuGuide(true)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-[#C5A059] hover:bg-emerald-900/60 transition-colors flex items-center gap-1 text-xs"
                title="دليل منع المقاطعات والرنات"
              >
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px]">دليل عدم الإزعاج</span>
              </button>

              {/* Offline Download Button */}
              <button
                onClick={handleCacheSurahOffline}
                disabled={isOfflineDownloading}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSurahCached
                    ? 'text-emerald-400 bg-emerald-900/40'
                    : 'text-emerald-300 hover:text-white hover:bg-emerald-800'
                }`}
                title={isSurahCached ? 'السورة محفوظة أوفلاين' : 'تحميل السورة للتشغيل أوفلاين مع وضع الطيران'}
              >
                {isOfflineDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                ) : isSurahCached ? (
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>

              {/* Fullscreen Theater Mode Button */}
              <button
                onClick={() => setIsFullScreenKhushu(true)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
                title="شاشة الخشوع الهادئة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Mute Toggle */}
              <button
                onClick={() => {
                  const { active, inactive } = getPlayers();
                  if (active) active.muted = !isMuted;
                  if (inactive) inactive.muted = !isMuted;
                  setIsMuted(!isMuted);
                }}
                className="text-emerald-300 hover:text-white p-1"
                title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Close Audio Player */}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-emerald-300 hover:text-[#C5A059] transition-colors"
                title="إغلاق المشغل"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
