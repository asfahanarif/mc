
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, Mail, Mic, Newspaper, Quote, Users, Globe, Video, Presentation } from "lucide-react";
import { PrayerTimings } from "@/components/home/prayer-timings";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Logo } from "@/components/shared/logo";
import { TestimonialsCarousel } from "@/components/home/testimonials";
import { placeholderImages } from "@/lib/data";

const counters = [
    { icon: Users, label: "Sisters", value: "1200+", className: "flex lg:hidden" },
    { icon: Video, label: "Online Events", value: "140+", className: "flex lg:hidden" },
    { icon: Calendar, label: "Onsite Events", value: "6", className: "flex lg:hidden" },
    { icon: Globe, label: "Countries", value: "10+", className: "flex lg:hidden" },
];

const desktopCounters = [
    { icon: Users, label: "Sisters", value: "1200+" },
    { icon: Presentation, label: "Events", value: "150+" },
    { icon: Globe, label: "Countries", value: "10+" },
];

const featuredItems = [
  {
    icon: Newspaper,
    title: "Featured Articles",
    description: "Insightful articles on various Islamic topics.",
    link: "/resources",
    image: placeholderImages.find(p => p.id === "article")
  },
  {
    icon: BookOpen,
    title: "Featured Duas",
    description: "Find supplications for every occasion.",
    link: "/resources",
    image: placeholderImages.find(p => p.id === "dua")
  },
  {
    icon: Quote,
    title: "Featured Hadith",
    description: "Pearls of wisdom from the Prophet (PBUH).",
    link: "/resources",
    image: placeholderImages.find(p => p.id === "hadith")
  },
  {
    icon: Calendar,
    title: "Featured Events",
    description: "Join our upcoming online and onsite events.",
    link: "/events",
    image: placeholderImages.find(p => p.id === "event")
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 flex flex-col items-center justify-center text-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6">
            <Logo className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold tracking-tight text-primary">
                Welcome to Muslimahs Club
              </h1>
              <p className="max-w-[700px] text-xl font-headline font-bold tracking-tighter sm:text-2xl text-primary/80">
                Empowering Muslimahs Through Qur'an &amp; Sunnah!
              </p>
              <p className="max-w-[700px] mx-auto text-foreground/70 md:text-lg">
                Join a global sisterhood dedicated to learning, sharing, and growing in faith.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="https://chat.whatsapp.com/ErUV6XUaWyq6xml6k6eKfE" target="_blank" rel="noopener noreferrer">
                  Join Community
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/resources">Explore Resources</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary/50">
        <div className="container mx-auto px-4 py-12 md:px-6">
          {/* Mobile and Tablet View */}
          <div className="grid grid-cols-2 justify-center gap-8 text-center items-center md:grid-cols-4 lg:hidden">
            {counters.map((item) => (
              <div key={item.label} className={`flex flex-col items-center justify-center gap-2 ${item.className}`}>
                <item.icon className="h-10 w-10 text-primary" />
                <p className="text-3xl font-bold text-foreground">{item.value}</p>
                <p className="text-md text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          {/* Desktop View */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 text-center items-center justify-center lg:px-20">
            {desktopCounters.map((item) => (
              <Card key={item.label} className="bg-background/50 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                      <item.icon className="h-10 w-10 text-primary" />
                      <p className="text-3xl font-bold text-foreground">{item.value}</p>
                      <p className="text-md text-muted-foreground">{item.label}</p>
                  </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="prayer" className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-primary">Prayer Timings</h2>
            <p className="max-w-[600px] mx-auto text-foreground/80 md:text-lg">
              Get accurate prayer times for your city.
            </p>
          </div>
          <PrayerTimings />
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <Card key={item.title} className="group overflow-hidden flex flex-col">
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image src={item.image.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.image.imageHint}/>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <item.icon className="h-6 w-6 text-primary" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80">{item.description}</p>
                </CardContent>
                <CardContent>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={item.link}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-primary">What Our Sisters Say</h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-primary/10">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight text-primary">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay updated with our latest news, events, and articles.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
