"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Clock } from 'lucide-react';

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

type PrayerTimes = {
  [key: string]: string;
};

export function PrayerTimings() {
  const [city, setCity] = useState('London');
  const [query, setQuery] = useState('London');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${query}&country=&method=2`);
        if (!response.ok) {
          throw new Error('City not found or API error.');
        }
        const data = await response.json();
        if (data.code === 200) {
          setPrayerTimes(data.data.timings);
        } else {
          throw new Error(data.data || 'Could not fetch prayer times.');
        }
      } catch (err: any) {
        setError(err.message);
        setPrayerTimes(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(city);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-sm mx-auto">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="text-base"
        />
        <Button type="submit" size="icon" aria-label="Search city">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prayerNames.map((name) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-center">{name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-8 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : prayerTimes ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prayerNames.map((name) => (
            <Card key={name} className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-headline text-primary">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6 text-accent" />
                    {prayerTimes[name]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
