
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, LocateFixed, Loader2, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from '@/lib/countries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type RamadanDay = {
    timings: {
        Imsak: string;
        Maghrib: string;
    },
    date: {
        readable: string;
        gregorian: {
            weekday: {
                en: string;
            }
        }
    }
}

const RAMADAN_YEAR = 2026;
const RAMADAN_MONTHS = [2, 3]; // February and March

export function RamadanCalendar() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [calendar, setCalendar] = useState<RamadanDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRamadanCalendar = async (latitude?: number, longitude?: number, city?: string, country?: string) => {
    setIsLoading(true);
    setError(null);
    setCalendar([]);
    setHasSearched(true);
    
    try {
        let allTimings: RamadanDay[] = [];

        for (const month of RAMADAN_MONTHS) {
            let url = '';
            if (latitude && longitude) {
                url = `https://api.aladhan.com/v1/calendar/${RAMADAN_YEAR}/${month}?latitude=${latitude}&longitude=${longitude}&method=3&school=1`;
            } else if (city && country) {
                url = `https://api.aladhan.com/v1/calendarByCity/${RAMADAN_YEAR}/${month}?city=${city}&country=${country}&method=3&school=1`;
            } else {
                 throw new Error("Please provide location information.");
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('City not found or API error. Please check your spelling.');
            }
            const data = await response.json();
            if (data.code === 200) {
                allTimings = [...allTimings, ...data.data];
            } else {
                throw new Error(data.data || 'Could not fetch Ramadan calendar.');
            }
        }

        const ramadanStartDate = new Date(`${RAMADAN_YEAR}-02-18`); 
        const ramadanEndDate = new Date(`${RAMADAN_YEAR}-03-19`);
        
        const filteredTimings = allTimings.filter(day => {
            const dayDate = new Date(day.date.readable);
            return dayDate >= ramadanStartDate && dayDate <= ramadanEndDate;
        });

        setCalendar(filteredTimings);
        
        if (latitude && longitude) {
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
        } else if (city && country) {
             const countryName = countries.find(c => c.iso3 === country)?.name || country;
             setLocationName(`${city}, ${countryName}`);
        }

    } catch (err: any) {
        setError(err.message);
        setCalendar([]);
        setLocationName('');
    } finally {
        setIsLoading(false);
    }
  }

  const fetchByCoordinates = (latitude: number, longitude: number) => {
      fetchRamadanCalendar(latitude, longitude);
  }
  
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
    if (!city || !country) {
      setError('Please select a country and enter a city.');
      return;
    }
    const countryName = countries.find(c => c.iso3 === country)?.name || country;
    fetchRamadanCalendar(undefined, undefined, city, countryName);
  }

  const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor('#333');
    doc.setFontSize(22);
    doc.text("Muslimahs Club", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.text("Ramadan 2026 Calendar", doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#666');
    doc.text(`Location: ${locationName}`, doc.internal.pageSize.getWidth() / 2, 38, { align: 'center' });

    const tableColumn = ["Date", "Day", "Suhoor", "Iftar"];
    const tableRows: any[] = [];

    calendar.forEach(day => {
        const row = [
            day.date.readable,
            day.date.gregorian.weekday.en,
            formatTime(day.timings.Imsak),
            formatTime(day.timings.Maghrib),
        ];
        tableRows.push(row);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [41, 28, 25], textColor: 255 },
        styles: { halign: 'center' },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
        }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    const footerText = "Generated from muslimahsclub.com";
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(footerText, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right'});

    doc.save(`Ramadan_2026_${locationName.replace(/, /g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4 max-w-lg mx-auto">
          <Select onValueChange={setCountry} value={country}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Country" />
            </SelectTrigger>
            <SelectContent>
                <ScrollArea className="h-72">
                    {countries.map((c) => (
                        <SelectItem key={c.iso3} value={c.iso3}>{c.name}</SelectItem>
                    ))}
                </ScrollArea>
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
         <div className="text-center mb-8 flex justify-center items-center gap-4">
            <Button onClick={handleGeoLocation} disabled={isLoading}>
                {isLoading && !calendar.length && hasSearched ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LocateFixed className="mr-2 h-4 w-4" />
                )}
                Use My Location
            </Button>
            {calendar.length > 0 && (
                <Button onClick={handleDownloadPdf} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            )}
        </div>

        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
        ) : error ? (
            <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : calendar.length > 0 ? (
            <Card>
                <CardHeader className="text-center">
                    <h3 className="text-xl font-semibold">Ramadan Timings for {locationName}</h3>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead className="text-center">Suhoor</TableHead>
                                <TableHead className="text-center">Iftar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {calendar.map((day, index) => (
                                <TableRow key={index}>
                                    <TableCell>{day.date.readable}</TableCell>
                                    <TableCell>{day.date.gregorian.weekday.en}</TableCell>
                                    <TableCell className="text-center font-semibold">
                                        <Badge variant="outline">{formatTime(day.timings.Imsak)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                        <Badge>{formatTime(day.timings.Maghrib)}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
            </Card>
        ) : hasSearched ? (
            <p className="text-center text-muted-foreground">Could not find Ramadan timings for the selected location.</p>
        ) : null}
    </div>
  );
}
