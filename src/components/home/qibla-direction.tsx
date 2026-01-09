
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Compass, LocateFixed, Loader2, AlertTriangle, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CompassIcon } from '../icons/compass';

export function QiblaDirection() {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.webkitCompassHeading) {
            // iOS
            setCompassHeading(event.webkitCompassHeading);
        } else if (event.alpha !== null) {
            // Android
            setCompassHeading(360 - event.alpha);
        }
    };
    
    const requestPermissions = async () => {
        setIsLoading(true);
        setError(null);
    
        // Check for DeviceOrientationEvent support
        if (!('DeviceOrientationEvent' in window)) {
            setError("Device orientation not supported on this browser.");
            setIsLoading(false);
            setPermissionState('denied');
            return;
        }
    
        // Check for Geolocation support
        if (!('geolocation' in navigator)) {
            setError("Geolocation is not supported by this browser.");
            setIsLoading(false);
            setPermissionState('denied');
            return;
        }

        // Request Device Orientation permission
        try {
            // Type assertion for non-standard permission API
            const doePermission = await (DeviceOrientationEvent as any).requestPermission();
            if (doePermission !== 'granted') {
                setError("Permission for device orientation was denied. The compass cannot function.");
                setIsLoading(false);
                setPermissionState('denied');
                return;
            }
        } catch (e) {
            // This will fail on browsers that don't require this permission (like Chrome on Android), which is fine.
            console.info("DeviceOrientationEvent.requestPermission() not needed or failed, proceeding.", e);
        }

        // Add orientation listener
        window.addEventListener('deviceorientation', handleOrientation);

        // Request Geolocation permission
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                calculateQibla(latitude, longitude);
                setPermissionState('granted');
                setIsLoading(false);
            },
            (err) => {
                setError("Location permission denied. Cannot calculate Qibla direction.");
                setIsLoading(false);
                setPermissionState('denied');
                window.removeEventListener('deviceorientation', handleOrientation);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
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
        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const compassStyle = {
        transform: `rotate(${-(compassHeading || 0)}deg)`,
        transition: 'transform 0.5s ease-out'
    };

    const qiblaStyle = {
        transform: `rotate(${qiblaDirection || 0}deg)`
    };

    const renderContent = () => {
        if (permissionState === 'denied') {
            return (
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Permission Denied</AlertTitle>
                    <AlertDescription>{error || "Required permissions were denied. Please grant permissions in your browser settings and try again."}</AlertDescription>
                </Alert>
            );
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Waiting for permissions...</p>
                </div>
            )
        }

        if (permissionState === 'granted' && qiblaDirection !== null && compassHeading !== null) {
            return (
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-64 h-64 rounded-full bg-background shadow-inner-lg border-4 border-primary/20 flex items-center justify-center" style={compassStyle}>
                        {/* Cardinal directions */}
                        <span className="absolute top-2 text-xl font-bold text-primary">N</span>
                        <span className="absolute bottom-2 text-xl font-bold text-muted-foreground">S</span>
                        <span className="absolute left-2 text-xl font-bold text-muted-foreground">W</span>
                        <span className="absolute right-2 text-xl font-bold text-muted-foreground">E</span>

                        {/* Qibla Needle */}
                        <div className="absolute inset-0 flex items-center justify-center" style={qiblaStyle}>
                            <div className="w-2/3 h-2 bg-transparent flex justify-center">
                                <CompassIcon className="w-16 h-16 text-green-500 drop-shadow-lg" />
                            </div>
                        </div>
                    </div>
                     <p className="text-lg font-semibold text-center">
                        Align the <span className="text-green-500 font-bold">green icon</span> with the North mark (N).<br />The Kaaba icon will then point to the Qibla.
                    </p>
                </div>
            )
        }

        return (
            <div className="max-w-md mx-auto text-center space-y-4">
                <p>To find the Qibla direction, we need access to your device's location and orientation sensors. Your data is not stored.</p>
                <Button onClick={requestPermissions} size="lg">
                    <LocateFixed className="mr-2 h-5 w-5" />
                    Find Qibla
                </Button>
            </div>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
                {renderContent()}
            </CardContent>
        </Card>
    );
}

