import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-32 w-48 md:h-40 md:w-60 transition-transform duration-300 hover:scale-105", className)}>
      <Image
        src="https://i.ibb.co/68Z1Jd5/image.png"
        alt="Muslimahs Club Logo"
        layout="fill"
        className="object-contain"
        priority
      />
    </div>
  );
}
