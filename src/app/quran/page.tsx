
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Volume2, Loader2, PlayCircle, BookOpen, X, ChevronLeft, ChevronRight, BookText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

type AyahTranslation = {
    number: number;
    text: string;
};

type SurahDetails = {
    ayahs: (Ayah & { translationText: string })[];
};

export default function QuranPage() {
  const quranImage = placeholderImages.find((p) => p.id === "quran-explorer");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    // Initialize Audio object only on the client
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
  
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        if (!res.ok) throw new Error("Failed to fetch surahs list.");
        const data = await res.json();
        setSurahs(data.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingSurahs(false);
      }
    };
    fetchSurahs();
  }, []);

  const fetchSurahDetails = async (surah: Surah) => {
    setActiveSurah(surah);
    setLoadingDetails(true);
    setSurahDetails(null);
    try {
        const [ayahsRes, translationRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`),
            fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`)
        ]);

        if (!ayahsRes.ok || !translationRes.ok) throw new Error("Failed to fetch surah details.");
        
        const ayahsData = await ayahsRes.json();
        const translationData = await translationRes.json();

        const combinedAyahs = ayahsData.data.ayahs.map((ayah: Ayah) => ({
            ...ayah,
            translationText: translationData.data.ayahs.find((t: AyahTranslation) => t.numberInSurah === ayah.numberInSurah)?.text || ''
        }));
        
        setSurahDetails({ ayahs: combinedAyahs });

    } catch (e: any) {
        setError("Could not load Surah. Please try again.");
    } finally {
        setLoadingDetails(false);
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

  const handleDialogClose = () => {
    setActiveSurah(null);
    setSurahDetails(null);
    if(audioRef.current) {
        audioRef.current.pause();
    }
    setPlayingAudio(null);
  }

  const handleNextSurah = () => {
    if (!activeSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.number === activeSurah.number);
    if (currentIndex > -1 && currentIndex < surahs.length - 1) {
        fetchSurahDetails(surahs[currentIndex + 1]);
    }
  }

  const handlePrevSurah = () => {
    if (!activeSurah || surahs.length === 0) return;
    const currentIndex = surahs.findIndex(s => s.number === activeSurah.number);
    if (currentIndex > 0) {
        fetchSurahDetails(surahs[currentIndex - 1]);
    }
  }


  return (
    <div>
      <PageHeader
        title="Qur'an Explorer"
        subtitle="Read, listen to, and reflect upon the words of Allah."
        image={quranImage}
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl">
          {loadingSurahs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {surahs.map((surah) => (
                <Card key={surah.number} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                    {surah.number}
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-headline">{surah.englishName}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{surah.englishNameTranslation}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-arabic text-xl font-bold">{surah.name}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <Badge variant="outline">{surah.revelationType}</Badge>
                            <span>{surah.numberOfAyahs} Ayahs</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => fetchSurahDetails(surah)}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Surah
                        </Button>
                    </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!activeSurah} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
        <DialogContent className={cn(
            "w-[calc(100vw-2rem)] max-h-[80vh] p-0 flex flex-col sm:max-w-5xl sm:max-h-[90vh]",
            "bg-transparent border-0 shadow-none"
        )}>
           {activeSurah && (
                <div className="bg-background/90 backdrop-blur-lg rounded-lg flex flex-col h-full overflow-hidden">
                    <DialogHeader className="p-4 border-b flex-shrink-0">
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-headline text-2xl text-primary">{activeSurah.number}. {activeSurah.englishName}</span>
                                <span className="font-arabic text-3xl">{activeSurah.name}</span>
                            </div>
                            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
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
                            {surahDetails && (
                                <div className="space-y-6">
                                    {surahDetails.ayahs.map(ayah => (
                                        <div key={ayah.number} className="flex flex-col gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                                                <p className="text-xl md:text-2xl font-arabic text-right flex-grow" dir="rtl">{ayah.text}</p>
                                                <Button size="icon" variant="ghost" onClick={() => playAudio(ayah.audio)}>
                                                    {playingAudio === ayah.audio ? <Loader2 className="h-5 w-5 animate-spin"/> : <PlayCircle className="h-5 w-5"/>}
                                                </Button>
                                            </div>
                                            {showTranslation && (
                                                <p className="text-foreground/80 pl-12 text-sm">{ayah.translationText}</p>
                                            )}
                                            {ayah.numberInSurah < activeSurah.numberOfAyahs && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-2 flex-shrink-0 bg-background/90 justify-center gap-2">
                        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" variant="outline" onClick={() => setShowTranslation(!showTranslation)}>
                            <BookText className="mr-1 sm:mr-2 h-4 w-4" />
                            {showTranslation ? "Hide" : "Show"}
                        </Button>
                        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handlePrevSurah} disabled={activeSurah.number === 1}>
                            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                            Prev
                        </Button>
                        <Button size="sm" className="px-2 h-8 sm:px-3 sm:h-9" onClick={handleNextSurah} disabled={activeSurah.number === 114}>
                            Next
                            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </div>
           )}
        </DialogContent>
      </Dialog>

    </div>
  );
}






