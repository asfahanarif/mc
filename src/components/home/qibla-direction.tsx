
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Compass, LocateFixed, Loader2, AlertTriangle, ArrowUp, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { KaabaIcon } from '../icons/kaaba';
import { cn } from '@/lib/utils';

export function QiblaDirection() {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [isOpen, setIsOpen] = useState(false);

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (event.webkitCompassHeading) {
            // iOS
            setCompassHeading(event.webkitCompassHeading);
        } else if (event.alpha !== null) {
            // Android
            setCompassHeading(360 - event.alpha);
        }
    }, []);
    
    const requestPermissions = async () => {
        setIsLoading(true);
        setError(null);
    
        if (!('DeviceOrientationEvent' in window)) {
            setError("Device orientation not supported on this browser.");
            setIsLoading(false);
            setPermissionState('denied');
            return;
        }
    
        if (!('geolocation' in navigator)) {
            setError("Geolocation is not supported by this browser.");
            setIsLoading(false);
            setPermissionState('denied');
            return;
        }

        try {
            // Type assertion for iOS-specific permission API
            const doe = DeviceOrientationEvent as any;
            if (typeof doe.requestPermission === 'function') {
                 const permission = await doe.requestPermission();
                if (permission !== 'granted') {
                    setError("Permission for device orientation was denied. The compass cannot function.");
                    setIsLoading(false);
                    setPermissionState('denied');
                    return;
                }
            }
        } catch (e) {
            console.info("DeviceOrientationEvent.requestPermission() not needed or failed, proceeding.", e);
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                calculateQibla(latitude, longitude);
                window.addEventListener('deviceorientation', handleOrientation);
                setPermissionState('granted');
                setIsLoading(false);
            },
            (err) => {
                setError("Location permission denied. Cannot calculate Qibla direction.");
                setIsLoading(false);
                setPermissionState('denied');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const calculateQibla = (latitude: number, longitude: number) => {
        const PI = Math.PI;
        const latK = 21.4225 * PI / 180.0;
        const longK = 39.8264 * PI / 180.0;
        const lat = latitude * PI / 180.0;
        const long = longitude * PI / 180.0;
        const longDiff = longK - long;
        const y = Math.sin(longDiff) * Math.cos(latK);
        const x = Math.cos(lat) * Math.sin(latK) - Math.sin(lat) * Math.cos(latK) * Math.cos(longDiff);
        const result = (Math.atan2(y, x) * 180.0 / PI + 360) % 360;
        setQiblaDirection(result);
    };
    
    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [handleOrientation]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && permissionState === 'prompt') {
            requestPermissions();
        } else if (!open) {
            // Reset state when closing the dialog
            window.removeEventListener('deviceorientation', handleOrientation);
            setQiblaDirection(null);
            setCompassHeading(null);
            setError(null);
            setIsLoading(false);
            setPermissionState('prompt');
        }
    }

    const compassStyle = {
        transform: `rotate(${-(compassHeading || 0)}deg)`,
        transition: 'transform 0.5s ease-out'
    };

    const qiblaStyle = {
        transform: `rotate(${qiblaDirection || 0}deg)`
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center gap-2 h-64 justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Requesting permissions...</p>
                </div>
            );
        }
        
        if (error) {
             return (
                <div className="h-64 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="max-w-md mx-auto">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Permission Denied</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            );
        }

        if (permissionState === 'granted' && qiblaDirection !== null && compassHeading !== null) {
            return (
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-64 h-64 rounded-full bg-background shadow-inner-lg border-4 border-primary/20 flex items-center justify-center" style={compassStyle}>
                        <span className="absolute top-2 text-xl font-bold text-primary">N</span>
                        <span className="absolute bottom-2 text-xl font-bold text-muted-foreground">S</span>
                        <span className="absolute left-3 text-xl font-bold text-muted-foreground">W</span>
                        <span className="absolute right-3 text-xl font-bold text-muted-foreground">E</span>

                        <div className="absolute inset-0 flex items-center justify-center" style={qiblaStyle}>
                             <div className="w-0.5 h-full">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                                     <KaabaIcon className="w-6 h-6 text-green-500 drop-shadow-lg" />
                                </div>
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-green-500"></div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50"></div>
                    </div>
                </div>
            )
        }
        
        // Fallback for initial state while waiting for sensor data or permissions
        if (permissionState === 'granted' || permissionState === 'prompt') {
             return (
                 <div className="flex flex-col items-center gap-2 h-64 justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Calibrating compass...</p>
                </div>
            )
        }

        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="lg">
                    <Compass className="mr-2 h-5 w-5" />
                    Find Qibla Direction
                </Button>
            </DialogTrigger>
            <DialogContent className={cn(
                "p-0 w-80 h-80 rounded-full",
                "bg-transparent border-0 shadow-none",
              )}>
                <div className="rounded-full w-full h-full flex items-center justify-center relative">
                    <DialogHeader className='sr-only'>
                        <DialogTitle>Qibla Compass</DialogTitle>
                        <DialogDescription>
                            A compass to help you find the direction of the Qibla for prayer.
                        </DialogDescription>
                    </DialogHeader>
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
