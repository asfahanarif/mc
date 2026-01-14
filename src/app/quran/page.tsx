
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { placeholderImages } from "@/lib/data";
import { BookOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { TranslationEdition } from "@/lib/types";
import { QuranReader } from "@/components/quran/quran-reader";
import { useIsMobile } from "@/hooks/use-mobile";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

function SurahList({ onSelectSurah }: { onSelectSurah: (surah: Surah) => void }) {
  const quranImage = placeholderImages.find((p) => p.id === "quran-explorer");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTranslations, setAllTranslations] = useState<TranslationEdition[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSurahsAndTranslations = async () => {
      setLoadingSurahs(true);
      setError(null);
      try {
        const [surahRes, transRes] = await Promise.all([
          fetch("https://api.alquran.cloud/v1/surah"),
          fetch("https://api.alquran.cloud/v1/edition/type/translation")
        ]);

        if (!surahRes.ok) throw new Error("Failed to fetch Surahs list.");
        if (!transRes.ok) throw new Error("Failed to fetch translations list.");

        const surahData = await surahRes.json();
        const transData = await transRes.json();

        setSurahs(surahData.data);
        setAllTranslations(transData.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingSurahs(false);
      }
    };

    fetchSurahsAndTranslations();
  }, []);

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  return (
    <div>
      <PageHeader
        title="Qur'an Explorer"
        subtitle="Read, listen to, and reflect upon the words of Allah."
        image={quranImage}
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl">
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={isMobile ? "Search for a Surah" : "Search for a Surah by name or number..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          {loadingSurahs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSurahs.map((surah) => (
                <Card key={surah.number} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {surah.number}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-headline">{surah.englishName}</CardTitle>
                          <p className="text-xs text-muted-foreground">{surah.englishNameTranslation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-arabic text-xl font-bold" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{surah.name}</p>
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
                    <Button className="w-full" onClick={() => onSelectSurah(surah)}>
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
    </div>
  )
}

export default function QuranPage() {
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [allTranslations, setAllTranslations] = useState<TranslationEdition[]>([]);

  useEffect(() => {
    // Fetch all surahs to enable next/prev navigation in reader
    const fetchAllData = async () => {
      try {
        const [surahRes, transRes] = await Promise.all([
          fetch("https://api.alquran.cloud/v1/surah"),
          fetch("https://api.alquran.cloud/v1/edition/type/translation")
        ]);
        const surahData = await surahRes.json();
        const transData = await transRes.json();
        setAllSurahs(surahData.data);
        setAllTranslations(transData.data);
      } catch (error) {
        console.error("Failed to fetch initial Quran data:", error);
      }
    };
    fetchAllData();
  }, []);

  if (activeSurah) {
    return (
      <QuranReader
        surah={activeSurah}
        allSurahs={allSurahs}
        allTranslations={allTranslations}
        onClose={() => setActiveSurah(null)}
        onSurahChange={setActiveSurah}
      />
    );
  }

  return <SurahList onSelectSurah={setActiveSurah} />;
}
