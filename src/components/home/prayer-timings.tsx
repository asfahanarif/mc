"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Clock, MapPin } from 'lucide-react';

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

type PrayerTimes = {
  [key: string]: string;
};

export function PrayerTimings() {
  const [city, setCity] = useState('London');
  const [inputCity, setInputCity] = useState('London');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('London');

  const fetchPrayerTimes = async (url: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('City not found or API error.');
        }
        const data = await response.json();
        if (data.code === 200) {
          setPrayerTimes(data.data.timings);
          if (data.data.meta.timezone) {
            setLocationName(data.data.meta.timezone.split('/')[1].replace(/_/g, ' '));
          }
        } else {
          throw new Error(data.data || 'Could not fetch prayer times.');
        }
      } catch (err: any) {
        setError(err.message);
        setPrayerTimes(null);
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    if (city) {
      fetchPrayerTimes(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`);
    }
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCity(inputCity);
  }

  const handleGPS = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchPrayerTimes(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
          setInputCity('');
        },
        (err) => {
          setError("Could not get location. Please enable location services or search manually.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 mb-8 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex-grow flex gap-2">
                <Input
                    type="text"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="flex-grow"
                />
                <Button type="submit" variant="outline" size="icon" aria-label="Search">
                    <Search className="h-5 w-5" />
                </Button>
            </form>
            <Button onClick={handleGPS} variant="outline">
                <MapPin className="mr-2 h-5 w-5" /> Use My Location
            </Button>
        </div>

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
