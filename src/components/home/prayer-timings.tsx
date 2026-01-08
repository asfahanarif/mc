"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from '@/lib/countries';

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

type PrayerTimes = {
  [key: string]: string;
};

export function PrayerTimings() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');

  const fetchPrayerTimes = async () => {
    if (!city || !country) {
      setError('Please select a country and enter a city.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrayerTimes(null);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2&school=0`);
      if (!response.ok) {
        throw new Error('City not found or API error. Please check the spelling and country.');
      }
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        setLocationName(`${city}, ${countries.find(c => c.iso3 === country)?.name || country}`);
      } else {
        throw new Error(data.data || 'Could not fetch prayer times. Please try a different city.');
      }
    } catch (err: any) {
      setError(err.message);
      setPrayerTimes(null);
      setLocationName('');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrayerTimes();
  }

  return (
    <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8 max-w-lg mx-auto">
          <Select onValueChange={setCountry} value={country}>
            <SelectTrigger className="sm:w-[250px]">
              <SelectValue placeholder="Select a Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.iso3} value={c.iso3}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
            <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city..."
                className="flex-grow"
            />
            <Button type="submit" variant="outline" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
            </Button>
        </form>

        {locationName && !isLoading && !error && (
            <h3 className="text-xl font-semibold text-center mb-4">Prayer Times for {locationName}</h3>
        )}

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
