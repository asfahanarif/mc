import Image from "next/image";
import type { PlaceholderImage } from "@/lib/types";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  image?: PlaceholderImage;
}

export function PageHeader({ title, subtitle, image }: PageHeaderProps) {
  return (
    <section className="relative w-full py-20 md:py-32 flex items-center justify-center text-center bg-secondary/30 overflow-hidden">
      {image && (
        <Image
          src={image.imageUrl}
          alt={title}
          fill
          className="object-cover z-0 opacity-20"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
            {title}
          </h1>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
