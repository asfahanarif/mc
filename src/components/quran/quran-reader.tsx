
'use client';

import { useState, useEffect, useRef, CSSProperties, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, BookText, Type, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Music4, ArrowLeft, PauseCircle, Play, Pause, Settings, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QuranSettings } from "@/components/quran/quran-settings";
import { useQuranSettings } from "@/components/quran/quran-settings-provider";
import type { TranslationEdition } from '@/lib/types';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

type Ayah = {
  number: number;
  text: string;
  audio: string;
  numberInSurah: number;
  juz: number;
};

type SurahDetails = {
  ayahs: (Ayah & { translations: { identifier: string; text: string }[] })[];
};

type QuranReaderProps = {
  surah: Surah;
  allSurahs: Surah[];
  allTranslations: TranslationEdition[];
  onClose: () => void;
  onSurahChange: (surah: Surah) => void;
};

const allReciters: TranslationEdition[] = [
    { identifier: 'ar.alafasy', language: 'ar', name: 'Alafasy', englishName: 'Mishary Rashid Alafasy', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ar.abdulsamad', language: 'ar', name: 'Abdul Samad', englishName: 'Abdul Basit Abdul Samad', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ar.abdurrahmaansudais', language: 'ar', name: 'Abdurrahmaan As-Sudais', englishName: 'Abdurrahman as-Sudais', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ar.mahermuaiqly', language: 'ar', name: 'Maher Al Muaiqly', englishName: 'Maher Al Muaiqly', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ar.minshawi', language: 'ar', name: 'Minshawi', englishName: 'Mohamed Siddiq al-Minshawi', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'en.walk', language: 'en', name: 'Walk', englishName: 'Ibrahim Walk (English)', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ur.khan', language: 'ur', name: 'Khan', englishName: 'Shamshad Ali Khan (Urdu)', format: 'audio', type: 'versebyverse', direction: 'ltr' }
];


export function QuranReader({ surah, allSurahs, allTranslations, onClose, onSurahChange }: QuranReaderProps) {
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ayahRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    selectedTranslations,
    arabicFontSize,
    translationFontSize,
    lineHeight,
    showTranslation,
    zoomLevel,
    zoomIn,
    zoomOut,
    arabicFont,
    setArabicFont,
    translationFont,
    urduFont,
    selectedReciter,
    isArabicBold,
    isTranslationBold,
    isUrduBold,
    isAutoScrolling,
    setIsAutoScrolling,
    scrollSpeed,
    setScrollSpeed,
  } = useQuranSettings();

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ top: 1, behavior: 'smooth' });
        }
    }, 110 - scrollSpeed); // Adjust interval based on speed
  }, [scrollSpeed]);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isAutoScrolling, startAutoScroll, stopAutoScroll]);


  const fetchSurahDetails = useCallback(async (currentSurah: Surah, translations: string[], reciter: string) => {
    setLoadingDetails(true);
    setSurahDetails(null);
    setError(null);
    try {
      const editions = [reciter, 'quran-uthmani', ...translations].join(',');
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah.number}/editions/${editions}`);
      if (!response.ok) throw new Error("Failed to fetch Surah details.");
      
      const multiEditionData = await response.json();
      const audioEdition = multiEditionData.data.find((d: any) => d.edition.identifier === reciter);
      const arabicEdition = multiEditionData.data.find((d: any) => d.edition.type === 'quran');
      const translationEditions = multiEditionData.data.filter((d: any) => d.edition.type === 'translation');

      if (!audioEdition || !arabicEdition) throw new Error("Could not find required audio or text editions.");

      const combinedAyahs = audioEdition.ayahs.map((ayah: Ayah, index: number) => {
        const ayahTranslations = translationEditions.map((transData: any) => ({
          identifier: transData.edition.identifier,
          text: transData.ayahs[index].text,
        }));
        return { ...ayah, text: arabicEdition.ayahs[index].text, translations: ayahTranslations };
      });
      
      setSurahDetails({ ayahs: combinedAyahs });
    } catch (e: any) {
      console.error(e);
      setError("Could not load Surah. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    if (surah.number) {
        fetchSurahDetails(surah, selectedTranslations, selectedReciter);
    }
  }, [surah, selectedTranslations, selectedReciter, fetchSurahDetails]);

  const handleAudioEnd = useCallback(() => {
    if (!surahDetails) return;
  
    const currentAyahUrl = playingAudio;
    if (!currentAyahUrl) return;
  
    const currentAyahIndex = surahDetails.ayahs.findIndex(a => a.audio === currentAyahUrl);
    const nextAyahIndex = currentAyahIndex + 1;
  
    if (nextAyahIndex < surahDetails.ayahs.length) {
      const nextAyah = surahDetails.ayahs[nextAyahIndex];
      playAudio(nextAyah.audio);
    } else {
      setPlayingAudio(null); // End of surah
    }
  }, [surahDetails, playingAudio]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    audio.addEventListener('ended', handleAudioEnd);
    
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnd);
        audio.pause();
        audioRef.current = null;
      }
    };
  }, [handleAudioEnd]);
  

  const handleNextSurah = () => {
    const currentIndex = allSurahs.findIndex(s => s.number === surah.number);
    if (currentIndex > -1 && currentIndex < allSurahs.length - 1) {
      onSurahChange(allSurahs[currentIndex + 1]);
    }
  };

  const handlePrevSurah = () => {
    const currentIndex = allSurahs.findIndex(s => s.number === surah.number);
    if (currentIndex > 0) {
      onSurahChange(allSurahs[currentIndex - 1]);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (!audioRef.current) return;
  
    if (playingAudio === audioUrl) {
      audioRef.current.pause();
      setPlayingAudio(null);
      return;
    }

    // Stop any currently playing audio before starting a new one
    if (playingAudio) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(error => {
      if (error.name === 'AbortError') {
        console.log('Audio playback aborted, likely by a new play request.');
      } else {
        console.error('Error playing audio:', error);
      }
    });
    setPlayingAudio(audioUrl);

    // Find the ayah number from the URL and scroll to it
    const ayahNumberInSurah = surahDetails?.ayahs.find(a => a.audio === audioUrl)?.numberInSurah;
    if (ayahNumberInSurah && ayahRefs.current[ayahNumberInSurah]) {
      ayahRefs.current[ayahNumberInSurah]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const arabicStyle: CSSProperties = {
    fontSize: `${arabicFontSize * zoomLevel}rem`,
    lineHeight,
    fontFamily: arabicFont,
    fontWeight: isArabicBold ? 700 : 400,
  };

  const getTranslationStyle = (identifier: string): CSSProperties => {
    const isUrdu = identifier.startsWith('ur.');
    return {
        fontSize: `${translationFontSize * zoomLevel}rem`,
        lineHeight,
        fontFamily: isUrdu ? urduFont : translationFont,
        direction: isUrdu ? 'rtl' : 'ltr',
        fontWeight: isUrdu ? (isUrduBold ? 700 : 400) : (isTranslationBold ? 700 : 400),
    };
  };

  const translationNameMapping: { [key: string]: string } = {
    "en.sahih": "Sahih International (English)",
    "en.hilali": "Hilali & Khan (English)",
    "ur.junagarhi": "Junagarhi (Urdu)"
  };

  return (
    <div className="bg-background flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b flex-shrink-0 flex items-center justify-between gap-4 md:sticky top-0 bg-secondary/30 backdrop-blur-sm z-10">
        <div className="flex-1">
          <Button variant="outline" size="icon" className="rounded-full" onClick={onClose}><ArrowLeft className="h-5 w-5" /></Button>
        </div>
        <div className="flex-1 text-center lg:text-right flex items-center gap-2 justify-center lg:justify-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className='h-7 w-7 text-primary/50 hover:text-primary'>
                        <Info className='h-4 w-4' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='font-headline text-2xl text-primary'>{surah.englishName} ({surah.name})</DialogTitle>
                        <DialogDescription>{surah.englishNameTranslation}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-4 bg-secondary/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Revelation</p>
                            <p className="text-lg font-semibold text-foreground">{surah.revelationType}</p>
                        </div>
                         <div className="text-center p-4 bg-secondary/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Verses</p>
                            <p className="text-lg font-semibold text-foreground">{surah.numberOfAyahs}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <p className="font-arabic text-2xl text-primary" style={{ fontFamily: "Amiri, serif" }}>{surah.name}</p>
        </div>
        <div className="flex-1 text-right">
            {surahDetails && surahDetails.ayahs.length > 0 && (
                <h1 className="font-headline text-xl text-primary hidden lg:block">
                    Juz {surahDetails.ayahs[0].juz} - Surah {surah.number}
                </h1>
            )}
        </div>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-grow" viewportRef={scrollContainerRef}>
        <div className="container max-w-4xl py-8">
          {loadingDetails && (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          )}
          {error && !loadingDetails && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {surahDetails && (
            <div className="space-y-8">
              {surah.number !== 1 && surah.number !== 9 && (
                <p className="font-arabic text-4xl text-center" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
              )}
              {surahDetails.ayahs.map(ayah => (
                <div key={ayah.number} ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)} className="flex flex-col gap-4 py-4 border-b">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                         <Button size="icon" variant="outline" className="h-9 w-9 bg-secondary/50 border-primary/20 hover:bg-primary/10" onClick={() => playAudio(ayah.audio)}>
                            {playingAudio === ayah.audio ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                        </Button>
                    </div>
                    <p className="text-2xl md:text-3xl text-right flex-grow leading-loose" dir="rtl" style={arabicStyle}>{ayah.text}</p>
                  </div>
                  {showTranslation && selectedTranslations.length > 0 && (
                    <div className="pl-12 space-y-4">
                      {ayah.translations?.filter(t => selectedTranslations.includes(t.identifier)).map((translation, index) => (
                        <div key={index}>
                          <p className="text-foreground/80" style={getTranslationStyle(translation.identifier)}>{translation.text}</p>
                          <p className="text-xs text-muted-foreground mt-2">- {translationNameMapping[translation.identifier] || translation.identifier}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsAutoScrolling(!isAutoScrolling)}>
                    {isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="w-24">
                    <Slider
                    id="scroll-speed"
                    min={1}
                    max={100}
                    step={1}
                    value={[scrollSpeed]}
                    onValueChange={(value) => setScrollSpeed(value[0])}
                    />
                </div>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mb-2 p-0">
                    <QuranSettings allTranslations={allTranslations} allReciters={allReciters} />
                </PopoverContent>
            </Popover>

            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomOut}><ZoomOut className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomIn}><ZoomIn className="h-4 w-4" /></Button>

            <div className="flex items-center justify-center rounded-full bg-primary/10 px-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePrevSurah} disabled={surah.number === 1}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Separator orientation='vertical' className='h-5'/>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleNextSurah} disabled={surah.number === 114}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}

    