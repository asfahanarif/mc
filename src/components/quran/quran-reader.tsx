
'use client';

import { useState, useEffect, useRef, CSSProperties, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, BookText, Type, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Music4, ArrowLeft, PauseCircle, Play, Pause, Settings, Info, X, Copy, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { QuranSettings } from "@/components/quran/quran-settings";
import { useQuranSettings } from "@/components/quran/quran-settings-provider";
import type { TranslationEdition } from '@/lib/types';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import indoPakScriptData from '@/lib/quran-indopak.json';

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
    { identifier: 'ar.saoodshuraym', language: 'ar', name: 'Saood Ash-Shuraym', englishName: 'Saood Ash-Shuraym', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'en.walk', language: 'en', name: 'Walk', englishName: 'Ibrahim Walk (English)', format: 'audio', type: 'versebyverse', direction: 'ltr' },
    { identifier: 'ur.khan', language: 'ur', name: 'Khan', englishName: 'Shamshad Ali Khan (Urdu)', format: 'audio', type: 'versebyverse', direction: 'ltr' }
];

const indoPakDataTyped: Record<string, { text: string }> = indoPakScriptData;

export function QuranReader({ surah, allSurahs, allTranslations, onClose, onSurahChange }: QuranReaderProps) {
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ayahRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const {
    selectedTranslations,
    arabicFontSize,
    translationFontSize,
    lineHeight,
    showTranslation,
    zoomLevel,
    zoomIn,
    zoomOut,
    setZoomLevel,
    arabicFont,
    setArabicFont,
    indoPakFont,
    translationFont,
    setTranslationFont,
    urduFont,
    setUrduFont,
    selectedReciter,
    setSelectedReciter,
    isArabicBold,
    setIsArabicBold,
    isTranslationBold,
    setIsTranslationBold,
    isUrduBold,
    setIsUrduBold,
    isAutoScrolling,
    setIsAutoScrolling,
    scrollSpeed,
    setScrollSpeed,
    isAutoplayEnabled,
    setIsAutoplayEnabled,
    arabicScript,
  } = useQuranSettings();

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const initialPinchDistance = useRef<number | null>(null);
    const initialZoom = useRef<number>(1);
    const [isPinching, setIsPinching] = useState(false);
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            setIsPinching(true);
            initialPinchDistance.current = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialZoom.current = zoomLevel;
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isPinching && e.touches.length === 2 && initialPinchDistance.current) {
            e.preventDefault();
            const currentPinchDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const zoomFactor = currentPinchDistance / initialPinchDistance.current;
            const newZoom = initialZoom.current * zoomFactor;
            // Clamp the zoom level within min/max bounds
            const clampedZoom = Math.max(0.5, Math.min(newZoom, 2));
            setZoomLevel(clampedZoom);
        }
    };
    
    const handleTouchEnd = () => {
        setIsPinching(false);
        initialPinchDistance.current = null;
    };


  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
  
    // Map the linear slider value (1-100) to a non-linear interval (e.g., 300ms down to 10ms)
    // This gives more control at slower speeds.
    const minInterval = 10; // Fastest
    const maxInterval = 300; // Slowest
    const speedPercentage = (scrollSpeed - 1) / 99; // 0 to 1
    // Use an exponential curve for a more natural feel
    const interval = maxInterval - (maxInterval - minInterval) * Math.pow(speedPercentage, 2);

    const scrollStep = (scrollContainerRef.current?.clientHeight || window.innerHeight) * 0.008;
  
    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ top: scrollStep, behavior: 'smooth' });
      }
    }, interval);
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


 const fetchSurahDetails = useCallback(async (currentSurah: Surah, translations: string[], reciter: string, script: string) => {
    setLoadingDetails(true);
    setSurahDetails(null);
    setError(null);
    try {
        const editions = [reciter, ...translations, (script !== 'quran-indopak' ? script : 'quran-uthmani')].join(',');
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah.number}/editions/${editions}`);
        if (!response.ok) throw new Error("Failed to fetch Surah details.");
        
        const multiEditionData = await response.json();

        const audioEdition = multiEditionData.data.find((d: any) => d.edition.format === 'audio');
        const textEdition = multiEditionData.data.find((d: any) => d.edition.identifier === (script !== 'quran-indopak' ? script : 'quran-uthmani'));
        const translationEditions = multiEditionData.data.filter((d: any) => d.edition.type === 'translation');

        if (!audioEdition || !textEdition) {
             throw new Error("Could not find required audio or text editions.");
        }
        
        const combinedAyahs = audioEdition.ayahs.map((ayah: Ayah, index: number) => {
            const ayahTranslations = translationEditions.map((transData: any) => ({
                identifier: transData.edition.identifier,
                text: transData.ayahs[index].text,
            }));
            
            let arabicText = textEdition.ayahs[index].text;
            if (script === 'quran-indopak') {
                const verseKey = `${currentSurah.number}:${ayah.numberInSurah}`;
                if (indoPakDataTyped[verseKey]) {
                    arabicText = indoPakDataTyped[verseKey].text;
                }
            }

            return {
                ...ayah,
                text: arabicText,
                translations: ayahTranslations,
            };
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
        fetchSurahDetails(surah, selectedTranslations, selectedReciter, arabicScript);
        window.scrollTo(0, 0);
    }
  }, [surah, selectedTranslations, selectedReciter, arabicScript, fetchSurahDetails]);

  const handleAudioEnd = useCallback(() => {
    if (!isAutoplayEnabled || !surahDetails || !playingAudio) {
        setPlayingAudio(null);
        return;
    };

    const currentAyahIndex = surahDetails.ayahs.findIndex(a => a.audio === playingAudio);

    if (currentAyahIndex > -1 && currentAyahIndex < surahDetails.ayahs.length - 1) {
        const nextAyah = surahDetails.ayahs[currentAyahIndex + 1];
        setPlayingAudio(nextAyah.audio);
    } else {
        setPlayingAudio(null); // End of surah
    }
  }, [surahDetails, playingAudio, isAutoplayEnabled]);

  useEffect(() => {
    if (playingAudio) {
        const ayahNumberInSurah = surahDetails?.ayahs.find(a => a.audio === playingAudio)?.numberInSurah;
        if (ayahNumberInSurah && ayahRefs.current[ayahNumberInSurah]) {
            ayahRefs.current[ayahNumberInSurah]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [playingAudio, surahDetails]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.removeEventListener('ended', handleAudioEnd);
      audioRef.current.pause();
    }
  
    const audio = new Audio();
    audioRef.current = audio;
    audio.addEventListener('ended', handleAudioEnd);
  
    if (playingAudio) {
      audio.src = playingAudio;
      audio.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Audio play error:", e);
        }
      });
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
      }
    };
  }, [playingAudio, handleAudioEnd]);


  const playAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

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

  const arabicStyle: CSSProperties = {
    fontSize: `${arabicFontSize * zoomLevel}rem`,
    lineHeight,
    fontFamily: arabicScript === 'quran-indopak' ? indoPakFont : arabicFont,
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

   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight <= clientHeight) {
        setScrollProgress(100);
        return;
    }
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };
  
    const getShareableText = (ayah: any) => {
        let text = `"${ayah.text}"\n\n(Qur'an ${surah.number}:${ayah.numberInSurah})\n\n`;
        if (showTranslation && selectedTranslations.length > 0) {
            ayah.translations?.filter((t: any) => selectedTranslations.includes(t.identifier)).forEach((translation: any) => {
                text += `Translation (${translationNameMapping[translation.identifier] || translation.identifier}):\n"${translation.text}"\n\n`;
            });
        }
        text += "Shared from Muslimahs Club App";
        return text;
    };

    const handleCopy = async (ayah: any) => {
        const textToCopy = getShareableText(ayah);
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast({ title: 'Ayah Copied!', description: 'The verse and its translation have been copied.', duration: 4000 });
        } catch (err) {
            console.error('Failed to copy: ', err);
            toast({ title: 'Failed to Copy', variant: 'destructive' });
        }
    };
    
    const handleShare = async (ayah: any) => {
        const shareData = {
            title: `Qur'an ${surah.number}:${ayah.numberInSurah}`,
            text: getShareableText(ayah),
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err: any) {
                // NotAllowedError can happen if the user cancels the share.
                // We'll only log other errors.
                if (err.name !== 'NotAllowedError') {
                    console.error('Share failed:', err);
                    // Fallback to copy for other errors.
                    handleCopy(ayah);
                }
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            handleCopy(ayah);
        }
    };


  return (
    <div className="bg-background flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b flex-shrink-0 flex items-center justify-between gap-4 md:sticky top-0 bg-secondary/30 backdrop-blur-sm z-10">
        <TooltipProvider>
        <div className="flex-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={onClose}><ArrowLeft className="h-5 w-5" /></Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Back to Surah List</p>
                </TooltipContent>
            </Tooltip>
        </div>
        </TooltipProvider>
        <div className="flex-1 flex items-center gap-2 justify-center text-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className='h-7 w-7 text-primary/50 hover:text-primary'>
                        <Info className='h-4 w-4' />
                    </Button>
                </DialogTrigger>
                <DialogContent className={cn(
                    "sm:max-w-md w-[calc(100vw-2rem)] rounded-lg p-0",
                    "bg-transparent border-0 shadow-none",
                    "sm:bg-background sm:border sm:shadow-lg"
                  )}>
                  <div className="bg-background/90 backdrop-blur-lg rounded-lg p-6 relative">
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
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
                  </div>
                </DialogContent>
            </Dialog>
            <p className="font-arabic text-2xl text-primary whitespace-nowrap" style={{ fontFamily: "Amiri, serif" }}>{surah.name}</p>
        </div>
        <div className="flex-1 text-right">
            {surahDetails && surahDetails.ayahs.length > 0 && (
                <h1 className="font-headline text-xl text-primary hidden lg:block">
                    Juz {surahDetails.ayahs[0].juz} - Surah {surah.number}
                </h1>
            )}
        </div>
      </header>
       <Progress value={scrollProgress} className="h-1 rounded-none w-full transition-transform duration-300 ease-in-out" />

      {/* Main Content */}
      <ScrollArea 
        className="flex-grow" 
        viewportRef={scrollContainerRef} 
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="container max-w-4xl pt-8 pb-64">
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
            <div className="space-y-4">
              {surahDetails.ayahs.map(ayah => (
                <div 
                    key={ayah.number} 
                    ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)} 
                    className={cn(
                        "flex flex-col gap-4 py-4 border-b transition-colors rounded-lg",
                        playingAudio === ayah.audio && "bg-primary/5"
                    )}
                >
                    <div className="flex items-start gap-4 px-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                             <Button size="icon" variant="outline" className="h-9 w-9 text-primary border-primary/50 hover:bg-primary/10 hover:text-primary" onClick={() => playAudio(ayah.audio)}>
                                {playingAudio === ayah.audio ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                            </Button>
                        </div>
                        <p className="text-2xl md:text-3xl text-right flex-grow leading-loose" dir="rtl" style={arabicStyle}>{ayah.text.replace(/<[^>]+>/g, '')}</p>
                    </div>
                    {showTranslation && selectedTranslations.length > 0 && (
                        <div className="pl-16 pr-4 space-y-4">
                        {ayah.translations?.filter(t => selectedTranslations.includes(t.identifier)).map((translation, index) => (
                            <div key={index}>
                            <p className="text-foreground/80" style={getTranslationStyle(translation.identifier)}>{translation.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">- {translationNameMapping[translation.identifier] || translation.identifier}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    <div className="px-4 flex justify-start items-center gap-1 mt-2">
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => handleCopy(ayah)}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy</span>
                                </Button>
                            </TooltipTrigger>
                             <TooltipContent><p>Copy Ayah</p></TooltipContent>
                        </Tooltip>
                        {navigator.share && (
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => handleShare(ayah)}>
                                            <Share2 className="h-4 w-4" />
                                            <span className="sr-only">Share</span>
                                        </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Share Ayah</p></TooltipContent>
                            </Tooltip>
                        )}
                        </TooltipProvider>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
        <TooltipProvider>
        <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsAutoScrolling(!isAutoScrolling)}>
                            {isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Auto Scroll</p></TooltipContent>
                </Tooltip>
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
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Settings</p></TooltipContent>
                </Tooltip>
                <PopoverContent align="center" side="top" className="w-80 mb-2 p-0">
                    <QuranSettings allTranslations={allTranslations} allReciters={allReciters} />
                </PopoverContent>
            </Popover>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomOut}><ZoomOut className="h-4 w-4" /></Button>
                </TooltipTrigger>
                 <TooltipContent side="top"><p>Zoom Out</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={zoomIn}><ZoomIn className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Zoom In</p></TooltipContent>
            </Tooltip>

            <div className="flex items-center justify-center rounded-full bg-primary/10 px-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePrevSurah} disabled={surah.number === 1}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Previous Surah</p></TooltipContent>
                </Tooltip>
                <Separator orientation='vertical' className='h-5'/>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleNextSurah} disabled={surah.number === 114}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top"><p>Next Surah</p></TooltipContent>
                </Tooltip>
            </div>
        </div>
        </TooltipProvider>
      </footer>
    </div>
  );
}
