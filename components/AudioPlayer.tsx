'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, X, Music, Volume2, VolumeX, Brain, Loader2 } from 'lucide-react';
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

  // Memorization Mode State
  const [isMemMode, setIsMemMode] = useState(false);
  const [memStartAyah, setMemStartAyah] = useState<number>(1);
  const [memEndAyah, setMemEndAyah] = useState<number>(1);
  const [ayahRepeatCount, setAyahRepeatCount] = useState<number>(1);
  const [currentAyahRepeat, setCurrentAyahRepeat] = useState<number>(0);
  const [blockRepeatCount, setBlockRepeatCount] = useState<number>(1);
  const [currentBlockRepeat, setCurrentBlockRepeat] = useState<number>(0);
  const [showMemSettings, setShowMemSettings] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const getAudioUrl = () => {
    if (currentTrack?.audioUrl) return currentTrack.audioUrl;
    const surahNum = currentTrack?.surahId || 1;
    const ayahNum = currentAyahNumber;
    const folder = selectedReciterKey;
    return buildAyahUrl(surahNum, ayahNum, folder);
  };

  const audioSrc = currentTrack ? getAudioUrl() : '';

  useEffect(() => {
    if (currentTrack) {
      setCurrentAyahNumber(currentTrack.ayahNumber);
      setMemStartAyah(currentTrack.ayahNumber);
      setMemEndAyah(Math.min(currentTrack.ayahNumber + 4, currentTrack.totalVerses || 286));
    }
  }, [currentTrack]);

  // Audio loading & playback effect
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsAudioLoading(true);
      audioRef.current.src = audioSrc;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
        setIsAudioLoading(false);
      });
    }
  }, [currentTrack, selectedReciterKey, currentAyahNumber]);

  // Preload NEXT Ayah Audio in background for gapless playback
  useEffect(() => {
    if (!currentTrack) return;
    const surahNum = currentTrack.surahId || 1;
    const nextAyah = currentAyahNumber + 1;
    const total = currentTrack.totalVerses || 286;

    if (nextAyah <= total) {
      const nextUrl = buildAyahUrl(surahNum, nextAyah, selectedReciterKey);
      if (!nextAudioRef.current) {
        nextAudioRef.current = new Audio();
      }
      nextAudioRef.current.src = nextUrl;
      nextAudioRef.current.preload = 'auto';
      nextAudioRef.current.load();
    }
  }, [currentAyahNumber, selectedReciterKey, currentTrack]);

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `سورة ${currentTrack.surahName} - الآية ${currentAyahNumber}`,
        artist: MOCK_RECITERS.find(r => reciterFolders[r.id] === selectedReciterKey)?.nameArabic || 'القارئ',
        album: 'القرآن الكريم',
        artwork: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (audioRef.current && duration) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
      });
    }
  }, [currentTrack, currentAyahNumber, selectedReciterKey, duration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsAudioLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
      }).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (!audioRef.current) return;

    if (isMemMode) {
       if (currentAyahRepeat < ayahRepeatCount - 1) {
           setCurrentAyahRepeat(prev => prev + 1);
           audioRef.current.currentTime = 0;
           audioRef.current.play();
       } else {
           if (currentAyahNumber < memEndAyah) {
               setCurrentAyahRepeat(0);
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

    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (currentTrack?.playMode === 'surah' && currentTrack.totalVerses && currentAyahNumber < currentTrack.totalVerses) {
      // Advance to next preloaded verse instantly
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
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[95px] lg:bottom-0 left-2 right-2 lg:left-0 lg:right-0 z-40 bg-[#0F382C] lg:rounded-none rounded-2xl text-[#FDFBF7] border border-[#C5A059]/30 lg:border-t lg:border-x-0 lg:border-b-0 shadow-2xl transition-all overflow-hidden flex flex-col">
      
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onWaiting={() => setIsAudioLoading(true)}
        onCanPlay={() => setIsAudioLoading(false)}
        onPlaying={() => setIsAudioLoading(false)}
      />

      {showMemSettings && (
        <div className="bg-[#0D1412]/95 border-b border-[#C5A059]/20 p-4 animate-in slide-in-from-bottom-2">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
               <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
                  <label className="flex flex-col text-center">
                     <span className="text-xs text-gray-400 mb-1">من آية</span>
                     <input type="number" min="1" max={currentTrack?.totalVerses || 286} value={memStartAyah} onChange={e => setMemStartAyah(Number(e.target.value))} className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white" />
                  </label>
                  <label className="flex flex-col text-center">
                     <span className="text-xs text-gray-400 mb-1">إلى آية</span>
                     <input type="number" min={memStartAyah} max={currentTrack?.totalVerses || 286} value={memEndAyah} onChange={e => setMemEndAyah(Number(e.target.value))} className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white" />
                  </label>
                  <label className="flex flex-col text-center">
                     <span className="text-xs text-gray-400 mb-1">تكرار الآية</span>
                     <input type="number" min="1" max="100" value={ayahRepeatCount} onChange={e => setAyahRepeatCount(Number(e.target.value))} className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white" />
                  </label>
                  <label className="flex flex-col text-center">
                     <span className="text-xs text-gray-400 mb-1">تكرار المقطع</span>
                     <input type="number" min="1" max="100" value={blockRepeatCount} onChange={e => setBlockRepeatCount(Number(e.target.value))} className="bg-emerald-950 border border-emerald-700/50 rounded p-1 w-16 text-center text-white" />
                  </label>
               </div>
               <div className="flex gap-2 w-full md:w-auto justify-center">
                 <button onClick={() => {
                     setIsMemMode(true);
                     setCurrentAyahNumber(memStartAyah);
                     setCurrentAyahRepeat(0);
                     setCurrentBlockRepeat(0);
                     setShowMemSettings(false);
                     setIsPlaying(false);
                     setTimeout(() => { if(audioRef.current) audioRef.current.play().then(()=>setIsPlaying(true)); }, 100);
                 }} className="bg-[#C5A059] text-gray-900 px-6 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95">بدء التحفيظ</button>
                 <button onClick={() => { setShowMemSettings(false); }} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold">إغلاق</button>
               </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2 lg:py-3 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-0">
          
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center space-x-3 space-x-reverse min-w-0 flex-1">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 relative">
                {isAudioLoading ? (
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                ) : isMemMode ? (
                  <Brain className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                ) : (
                  <Music className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                )}
                {isMemMode && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">{currentBlockRepeat+1}/{blockRepeatCount}</span>
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="font-bold text-xs lg:text-sm text-white truncate min-w-0">
                    سورة {currentTrack.surahName} - الآية {currentAyahNumber}
                  </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] shrink-0">
                  {isMemMode ? 'وضع التحفيظ الذكي' : (currentTrack.playMode === 'surah' ? 'تلاوة متواصلة (تلقائي)' : 'تلاوة آية')}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 truncate flex items-center gap-2">
                القارئ المختار: {MOCK_RECITERS.find(r => reciterFolders[r.id] === selectedReciterKey)?.nameArabic || 'الشيخ المنشاوي'}
                {isMemMode && <span className="text-[10px] bg-emerald-900/50 px-1.5 py-0.5 rounded">تكرار الآية: {currentAyahRepeat+1}/{ayahRepeatCount}</span>}
              </p>
            </div>
          </div>

            <div className="flex lg:hidden items-center">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-1.5 w-full lg:w-auto">
            <div className="flex items-center space-x-4 space-x-reverse lg:space-x-4 lg:space-x-reverse justify-center w-full">
              <button 
                onClick={() => setShowMemSettings(!showMemSettings)}
                className={`p-1.5 rounded hover:bg-emerald-800 transition-colors ${isMemMode || showMemSettings ? 'text-[#C5A059] bg-emerald-900/50' : 'text-emerald-300/60'}`}
                title="المحفظ الذكي"
              >
                <Brain className="w-4 h-4 lg:w-4 lg:h-4" />
              </button>

              <button 
                onClick={() => { setIsRepeat(!isRepeat); setIsMemMode(false); }}
                className={`p-1.5 rounded hover:bg-emerald-800 transition-colors ${isRepeat && !isMemMode ? 'text-[#C5A059]' : 'text-emerald-300/60'}`}
                title="تكرار الآية"
              >
                <Repeat className="w-4 h-4 lg:w-4 lg:h-4" />
              </button>

              <button 
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                }}
                className="text-emerald-200 hover:text-white transition-colors"
                title="تأخير 5 ثواني"
              >
                <SkipForward className="w-5 h-5" />
              </button>

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

              <button 
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
                }}
                className="text-emerald-200 hover:text-white transition-colors"
                title="تقديم 5 ثواني"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleSpeedChange}
                className="text-[10px] lg:text-[11px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-[#C5A059] border border-[#C5A059]/30 shrink-0"
              >
                {playbackSpeed}x
              </button>
            </div>

            <div className="w-full lg:w-80 flex items-center space-x-2 space-x-reverse text-[10px] text-emerald-300/70 font-mono">
              <span>{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-1.5 lg:h-1.5 bg-emerald-950 rounded-full cursor-pointer overflow-hidden relative"
                onClick={(e) => {
                  if (!audioRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = clickX / rect.width;
                  audioRef.current.currentTime = pct * duration;
                }}
              >
                <div 
                  className="h-full bg-[#C5A059] rounded-full" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3 space-x-reverse shrink-0">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="text-emerald-300 hover:text-white p-1"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <select
              value={selectedReciterKey}
              onChange={(e) => setSelectedReciterKey(e.target.value)}
              className="bg-emerald-950 border border-emerald-700/50 rounded-lg text-xs text-emerald-100 px-3 py-1.5 focus:outline-none focus:border-[#C5A059] max-w-[200px] truncate"
            >
              {MOCK_RECITERS.map(r => (
                <option key={r.id} value={reciterFolders[r.id]}>{r.nameArabic}</option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-300 hover:text-[#C5A059] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
