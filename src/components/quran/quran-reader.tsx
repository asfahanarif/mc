
'use client';

import { useState, useEffect, useRef, CSSProperties, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, BookText, Type, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QuranSettings } from "@/components/quran/quran-settings";
import { useQuranSettings } from "@/components/quran/quran-settings-provider";
import { DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';

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
  allTranslations: any[];
  onClose: () => void;
  onSurahChange: (surah: Surah) => void;
};

export function QuranReader({ surah, allSurahs, allTranslations, onClose, onSurahChange }: QuranReaderProps) {
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  } = useQuranSettings();

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

  const fetchSurahDetails = useCallback(async (currentSurah: Surah) => {
    setLoadingDetails(true);
    setSurahDetails(null);
    setError(null);
    try {
      const editions = ['ar.alafasy', ...selectedTranslations].join(',');
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah.number}/editions/${editions}`);
      if (!response.ok) throw new Error("Failed to fetch Surah details.");
      
      const multiEditionData = await response.json();
      const arabicEdition = multiEditionData.data.find((d: any) => d.edition.identifier === 'ar.alafasy');
      const translationEditions = multiEditionData.data.filter((d: any) => d.edition.identifier !== 'ar.alafasy');

      if (!arabicEdition) throw new Error("Could not find Arabic edition.");

      const combinedAyahs = arabicEdition.ayahs.map((ayah: Ayah, index: number) => {
        const translations = translationEditions.map((transData: any) => ({
          identifier: transData.edition.name,
          text: transData.ayahs[index].text,
        }));
        return { ...ayah, translations };
      });
      
      setSurahDetails({ ayahs: combinedAyahs });
    } catch (e: any) {
      console.error(e);
      setError("Could not load Surah. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  }, [selectedTranslations]);

  useEffect(() => {
    fetchSurahDetails(surah);
  }, [surah, fetchSurahDetails]);

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
    <div className="bg-background/90 backdrop-blur-lg rounded-lg flex flex-col h-full overflow-hidden">
      <DialogHeader className="p-4 border-b flex-shrink-0">
        <DialogTitle className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-headline text-2xl text-primary">{surah.number}. {surah.englishName}</span>
            <span className="font-arabic text-3xl" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{surah.name}</span>
          </div>
          <DialogClose onClick={onClose} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-6 md:p-8">
          {loadingDetails && (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
          {error && !loadingDetails && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {surahDetails && (
            <div className="space-y-6">
              {surahDetails.ayahs.map(ayah => (
                <div key={ayah.number} className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                    <p className="text-xl md:text-2xl text-right flex-grow" dir="rtl" style={arabicStyle}>{ayah.text}</p>
                    <Button size="icon" variant="ghost" onClick={() => playAudio(ayah.audio)}>
                      {playingAudio === ayah.audio ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
                    </Button>
                  </div>
                  {showTranslation && selectedTranslations.length > 0 && (
                    <div className="pl-12 space-y-3" style={translationStyle}>
                      {ayah.translations?.map((translation, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-foreground/80" style={{ direction: translation.identifier.toLowerCase().includes('urdu') ? 'rtl' : 'ltr', fontFamily: translation.identifier.toLowerCase().includes('urdu') ? "'Noto Nastaliq Urdu', serif" : translationFont }}>{translation.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">- {translation.identifier}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {ayah.numberInSurah < surah.numberOfAyahs && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <DialogFooter className="p-2 border-t flex-shrink-0 bg-background/90 justify-center items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <BookText className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <QuranSettings allTranslations={allTranslations} settingType="translations" />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <QuranSettings allTranslations={allTranslations} settingType="fonts" />
          </PopoverContent>
        </Popover>

        <div className="flex-grow" />

        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handlePrevSurah} disabled={surah.number === 1}>
          <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" /> Prev
        </Button>
        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handleNextSurah} disabled={surah.number === 114}>
          Next <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
        </Button>
      </DialogFooter>
    </div>
  );
}
