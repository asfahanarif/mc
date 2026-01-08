"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from 'lucide-react';
import { countries } from '@/lib/countries';

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

type PrayerTimes = {
  [key: string]: string;
};

type City = {
  name: string;
};

export function PrayerTimings() {
  const [country, setCountry] = useState('United Kingdom');
  const [city, setCity] = useState('London');
  const [cities, setCities] = useState<string[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) return;

    const fetchCities = async () => {
        setIsCitiesLoading(true);
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country })
            });
            if (!response.ok) throw new Error('Could not fetch cities for the selected country.');
            const data = await response.json();
            if (data.error) throw new Error(data.msg);
            setCities(data.data);
            if (data.data.length > 0) {
              const defaultCity = data.data.includes('London') ? 'London' : data.data[0];
              setCity(defaultCity);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsCitiesLoading(false);
        }
    }
    fetchCities();
  }, [country]);


  useEffect(() => {
    if (!city || !country) return;

    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
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
  }, [city, country]);


  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 mb-8 max-w-md mx-auto">
        <Select onValueChange={setCountry} value={country}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(c => <SelectItem key={c.iso3} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
         <Select onValueChange={setCity} value={city} disabled={isCitiesLoading || cities.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {isCitiesLoading ? <SelectItem value="loading" disabled>Loading cities...</SelectItem> :
             cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

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
