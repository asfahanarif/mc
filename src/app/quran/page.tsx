
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { Volume2, Loader2, PlayCircle } from "lucide-react";

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
            <div className="space-y-2">
                {[...Array(5)].map((_,i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {surahs.map((surah) => (
                <AccordionItem value={`surah-${surah.number}`} key={surah.number}>
                  <AccordionTrigger
                    onClick={() => fetchSurahDetails(surah.number)}
                    className="hover:bg-accent/50 px-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {surah.number}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{surah.englishName}</p>
                        <p className="text-sm text-muted-foreground">{surah.englishNameTranslation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="font-arabic text-2xl font-bold">{surah.name}</p>
                        <p className="text-sm text-muted-foreground">{surah.numberOfAyahs} Ayahs</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {loadingDetails && activeSurah === surah.number && (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    )}
                    {surahDetails && activeSurah === surah.number && (
                        <div className="p-2 space-y-2">
                            {surahDetails.ayahs.map(ayah => (
                                <Card key={ayah.number} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">{ayah.numberInSurah}</div>
                                        <p className="text-2xl md:text-3xl font-arabic text-right flex-grow px-4" dir="rtl">{ayah.text}</p>
                                        <Button size="icon" variant="ghost" onClick={() => playAudio(ayah.audio)}>
                                            {playingAudio === ayah.audio ? <Loader2 className="h-5 w-5 animate-spin"/> : <PlayCircle className="h-5 w-5"/>}
                                        </Button>
                                    </div>
                                    <p className="mt-4 text-foreground/80 pl-12">{ayah.translationText}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
}
