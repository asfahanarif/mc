"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, LocateFixed, Loader2, Sunrise, Sun, Sunset, Moon, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from '@/lib/countries';

const prayerDetails = [
  { name: "Fajr", icon: <Sunrise className="h-6 w-6 text-accent" /> },
  { name: "Sunrise", icon: <Sunrise className="h-6 w-6 text-accent" /> },
  { name: "Dhuhr", icon: <Sun className="h-6 w-6 text-accent" /> },
  { name: "Asr", icon: <Sun className="h-6 w-6 text-accent" /> },
  { name: "Maghrib", icon: <Sunset className="h-6 w-6 text-accent" /> },
  { name: "Isha", icon: <Moon className="h-6 w-6 text-accent" /> },
];

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

  const fetchPrayerTimes = async (method = 3) => {
    if (!city || !country) {
      setError('Please select a country and enter a city.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrayerTimes(null);
    try {
      const countryName = countries.find(c => c.iso3 === country)?.name || country;
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${countryName}&method=${method}&school=1`);
      if (!response.ok) {
        throw new Error('City not found or API error. Please check the spelling and country.');
      }
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        setLocationName(`${city}, ${countryName}`);
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

  const fetchByCoordinates = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    setPrayerTimes(null);
    try {
      // Fetch prayer times
      const timingsResponse = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3&school=1`);
      if (!timingsResponse.ok) throw new Error("Could not fetch prayer times for your location.");
      const timingsData = await timingsResponse.json();
      if (timingsData.code !== 200) throw new Error("Could not calculate prayer times for your location.");
      setPrayerTimes(timingsData.data.timings);

      // Fetch location name
      try {
        const locationResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        if(locationResponse.ok) {
            const locationData = await locationResponse.json();
            setLocationName(`${locationData.city}, ${locationData.countryName}`);
        } else {
             setLocationName("Your Current Location");
        }
      } catch (locationError) {
          console.warn("Could not fetch location name, using generic name.");
          setLocationName("Your Current Location");
      }

    } catch (err: any) {
      setError(err.message);
      setPrayerTimes(null);
      setLocationName('');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Could not access your location. Please enable location services in your browser settings.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrayerTimes(3); // Muslim World League
  }

  return (
    <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4 max-w-lg mx-auto">
          <Select onValueChange={setCountry} value={country}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.iso3} value={c.iso3}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city..."
                className="flex-grow"
            />
            <Button type="submit" variant="outline" size="icon" aria-label="Search" disabled={isLoading}>
                <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
         <div className="text-center mb-8">
            <Button onClick={handleGeoLocation} disabled={isLoading}>
                {isLoading && !prayerTimes ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LocateFixed className="mr-2 h-4 w-4" />
                )}
                Use My Location
            </Button>
        </div>


        {locationName && !isLoading && !error && (
            <h3 className="text-xl font-semibold text-center mb-4">Prayer Times for {locationName}</h3>
        )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {prayerDetails.map((prayer) => (
            <Card key={prayer.name}>
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {prayerDetails.map((prayer) => (
            <Card key={prayer.name} className="text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                {prayer.icon}
                <p className="text-lg font-headline text-primary">{prayer.name}</p>
                <p className="text-2xl font-bold text-foreground">
                    {prayerTimes[prayer.name]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
