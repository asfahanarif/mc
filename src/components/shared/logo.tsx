import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-24 w-24 md:h-32 md:w-32 transition-transform duration-300 hover:scale-110", className)}>
      <Image
        src="https://i.ibb.co/5g03Zq7/MC-logo.png"
        alt="MuslimahSphere Logo"
        width={128}
        height={128}
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
}
