
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Volume2, Loader2, PlayCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    // Initialize Audio object only on the client
    audioRef.current = new Audio();

    const onEnded = () => setPlayingAudio(null);
    const audio = audioRef.current;
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.pause();
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

  const fetchSurahDetails = async (surahNumber: number) => {
    if (activeSurah === surahNumber) {
        setActiveSurah(null); // Collapse if already open
        setSurahDetails(null);
        return;
    }
    setActiveSurah(surahNumber);
    setLoadingDetails(true);
    setSurahDetails(null);
    try {
        const [ayahsRes, translationRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`)
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


  return (
    <div>
      <PageHeader
        title="Qur'an Explorer"
        subtitle="Read, listen to, and reflect upon the words of Allah."
        image={quranImage}
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surahs.map((surah) => (
                <Collapsible asChild key={surah.number} open={activeSurah === surah.number} onOpenChange={() => fetchSurahDetails(surah.number)}>
                    <Card className="flex flex-col">
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
                            <CollapsibleTrigger asChild>
                                <Button className="w-full">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    {activeSurah === surah.number ? 'Close Surah' : 'Read Surah'}
                                </Button>
                            </CollapsibleTrigger>
                        </CardFooter>

                        <CollapsibleContent className="md:col-span-2 lg:col-span-3 w-full">
                            <div className="p-4 border-t">
                                {loadingDetails && activeSurah === surah.number && (
                                    <div className="space-y-4">
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                )}
                                {surahDetails && activeSurah === surah.number && (
                                    <div className="space-y-2">
                                        {surahDetails.ayahs.map(ayah => (
                                            <Card key={ayah.number} className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">{ayah.numberInSurah}</div>
                                                    <p className="text-xl md:text-2xl font-arabic text-right flex-grow px-4" dir="rtl">{ayah.text}</p>
                                                    <Button size="icon" variant="ghost" onClick={() => playAudio(ayah.audio)}>
                                                        {playingAudio === ayah.audio ? <Loader2 className="h-5 w-5 animate-spin"/> : <PlayCircle className="h-5 w-5"/>}
                                                    </Button>
                                                </div>
                                                <p className="mt-4 text-foreground/80 pl-12 text-sm">{ayah.translationText}</p>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

    