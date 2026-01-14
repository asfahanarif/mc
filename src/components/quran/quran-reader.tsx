'use client';

import { useState, useEffect, useRef, CSSProperties, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, BookText, Type, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Music4, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QuranSettings } from "@/components/quran/quran-settings";
import { useQuranSettings } from "@/components/quran/quran-settings-provider";
import type { TranslationEdition } from '@/lib/types';

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

export function QuranReader({ surah, allSurahs, allTranslations, onClose, onSurahChange }: QuranReaderProps) {
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [allReciters, setAllReciters] = useState<TranslationEdition[]>([]);

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
    translationFont,
    selectedReciter,
  } = useQuranSettings();

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
          identifier: transData.edition.name,
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

  useEffect(() => {
    const fetchReciters = async () => {
        try {
            const res = await fetch("https://api.alquran.cloud/v1/edition/type/audio");
            if (!res.ok) throw new Error("Failed to fetch reciters.");
            const data = await res.json();
            setAllReciters(data.data);
        } catch (e) {
            console.error("Could not load reciters list:", e);
        }
    };
    fetchReciters();
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    const onEnded = () => setPlayingAudio(null);
    const audio = audioRef.current;
    audio.addEventListener('ended', onEnded);
    
    return () => {
      if (audio) {
        audio.removeEventListener('ended', onEnded);
        audio.pause();
      }
    };
  }, []);

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
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlayingAudio(audioUrl);
    }
  };

  const arabicStyle: CSSProperties = {
    fontSize: `${arabicFontSize * zoomLevel}rem`,
    lineHeight,
    fontFamily: arabicFont,
  };

  const translationStyle: CSSProperties = {
    fontSize: `${translationFontSize * zoomLevel}rem`,
    lineHeight,
    fontFamily: translationFont,
  };

  return (
    <div className="bg-background flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b flex-shrink-0 flex items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="outline" size="sm" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Surah List</Button>
        <div className="flex flex-col items-center text-center">
            <h1 className="font-headline text-2xl text-primary">{surah.number}. {surah.englishName}</h1>
            <p className="font-arabic text-3xl" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{surah.name}</p>
        </div>
        <div className="w-[170px]"></div>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-grow">
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
                <div key={ayah.number} className="flex flex-col gap-4 py-4 border-b">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                         <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => playAudio(ayah.audio)}>
                            {playingAudio === ayah.audio ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
                        </Button>
                    </div>
                    <p className="text-2xl md:text-3xl text-right flex-grow leading-loose" dir="rtl" style={arabicStyle}>{ayah.text}</p>
                  </div>
                  {showTranslation && selectedTranslations.length > 0 && (
                    <div className="pl-12 space-y-4" style={translationStyle}>
                      {ayah.translations?.map((translation, index) => (
                        <div key={index}>
                          <p className="text-foreground/80" style={{ direction: translation.identifier.toLowerCase().includes('urdu') ? 'rtl' : 'ltr', fontFamily: translation.identifier.toLowerCase().includes('urdu') ? "'Noto Nastaliq Urdu', serif" : translationFont }}>{translation.text}</p>
                          <p className="text-xs text-muted-foreground mt-2">- {translation.identifier}</p>
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
      <footer className="p-2 border-t flex-shrink-0 flex justify-center items-center gap-2 sticky bottom-0 bg-background/80 backdrop-blur-sm z-10">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomOut}><ZoomOut className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomIn}><ZoomIn className="h-4 w-4" /></Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8"><Music4 className="h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 mb-2"><QuranSettings allTranslations={allTranslations} allReciters={allReciters} settingType="audio" /></PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8"><BookText className="h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 mb-2"><QuranSettings allTranslations={allTranslations} allReciters={allReciters} settingType="translations" /></PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8"><Type className="h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mb-2"><QuranSettings allTranslations={allTranslations} allReciters={allReciters} settingType="fonts" /></PopoverContent>
        </Popover>

        <div className="flex-grow" />

        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handlePrevSurah} disabled={surah.number === 1}><ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" /> Prev</Button>
        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handleNextSurah} disabled={surah.number === 114}>Next <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" /></Button>
      </footer>
    </div>
  );
}