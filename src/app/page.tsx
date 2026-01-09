
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calendar, Mail, Mic, Newspaper, Quote, Users, Globe, Video, Presentation } from "lucide-react";
import { PrayerTimings } from "@/components/home/prayer-timings";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Logo } from "@/components/shared/logo";
import { TestimonialsCarousel } from "@/components/home/testimonials";
import { placeholderImages } from "@/lib/data";
import { QiblaDirection } from "@/components/home/qibla-direction";

const counters = [
    { icon: Users, label: "Sisters", value: "1200+", screen: "all" },
    { icon: Presentation, label: "Events", value: "150+", screen: "large" },
    { icon: Globe, label: "Countries", value: "10+", screen: "all" },
    { icon: Video, label: "Online Events", value: "140+", screen: "mobile" },
    { icon: Presentation, label: "Onsite Events", value: "6", screen: "mobile" },
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
      <section className="w-full pt-10 pb-20 md:pt-16 md:pb-32 flex flex-col items-center justify-center text-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6">
            <Logo className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                Welcome to Muslimahs Club
              </h1>

              <div className="flex w-full items-center justify-center gap-4 text-primary/50 my-4 max-w-[200px] mx-auto">
                <div className="flex-grow border-t border-primary/20"></div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-3 w-3">
                  <path d="M12 2L14.09 8.26L20.36 10.34L14.09 12.42L12 18.68L9.91 12.42L3.64 10.34L9.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex-grow border-t border-primary/20"></div>
              </div>

              <p className="max-w-[700px] text-primary text-xl sm:text-2xl font-headline font-bold tracking-tighter">
                Empowering Women Through Qur'an &amp; Sunnah!
              </p>
              <p className="max-w-[700px] mx-auto text-foreground/80 text-sm md:text-base">
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

      <section id="counters" className="w-full bg-secondary/50 py-12 lg:px-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-center text-center items-center">
            {counters.filter(item => item.screen !== 'large' && item.screen !== 'all').map((item) => (
              <Card key={item.label} className="bg-background/50 hover:shadow-lg transition-shadow md:hidden">
                <CardContent className="pt-4 flex flex-col items-center justify-center gap-1">
                    <item.icon className="h-8 w-8 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            ))}
             {counters.filter(item => item.screen === 'all').map((item) => (
              <Card key={item.label} className="bg-background/50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center justify-center gap-2">
                    <item.icon className="h-10 w-10 text-primary" />
                    <p className="text-3xl font-bold text-foreground">{item.value}</p>
                    <p className="text-md text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            ))}
            {counters.filter(item => item.screen === 'large').map((item) => (
              <Card key={item.label} className="bg-background/50 hover:shadow-lg transition-shadow hidden md:block">
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

      <section id="qibla" className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6 text-center">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-primary">Qibla Direction</h2>
                <p className="max-w-[600px] mx-auto text-foreground/80 md:text-lg">
                Find the direction of the Kaaba from your current location.
                </p>
            </div>
            <QiblaDirection />
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <Card key={item.title} className="group overflow-hidden flex flex-col">
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image src={item.image.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.image.imageHint}/>
                  </div>
                )}
                <CardContent className="pt-6 flex-grow">
                  <h3 className="flex items-center gap-2 font-headline text-xl font-semibold">
                    <item.icon className="h-6 w-6 text-primary" />
                    {item.title}
                  </h3>
                  <p className="text-foreground/80 mt-2">{item.description}</p>
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
      
      <section className="w-full py-16 md:py-24 bg-secondary/50">
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
