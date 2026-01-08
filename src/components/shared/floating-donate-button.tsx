"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingDonateButton() {
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
            <Button asChild size="lg" className="rounded-full shadow-lg group transition-all duration-300 ease-in-out hover:scale-105">
                <Link href="/donate">
                    <Heart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-125 group-hover:fill-red-500 text-red-500" />
                    Donate
                </Link>
            </Button>
        </div>
    );
}
