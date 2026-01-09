
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { placeholderImages, articles, duas, hadithBooks, sampleHadith } from "@/lib/data";
import { BookOpen, Newspaper, Search, ChevronsRight, ChevronsLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ARTICLES_PER_PAGE = 8;

function ArticlesTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );
  
  return (
    <div className="space-y-8">
        <Input 
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="max-w-sm mx-auto"
        />
        <p className="text-xs text-muted-foreground text-center">Source: Islamqa.info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedArticles.map(article => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">{article.title}</CardTitle>
                        <CardDescription>{article.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm">
                            <Link href={article.url} target="_blank" rel="noopener noreferrer">
                                View More <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
        {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        )}
    </div>
  );
}

function DuasTab() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
      <AccordionItem value="morning">
        <AccordionTrigger className="text-xl font-headline">Morning Duas</AccordionTrigger>
        <AccordionContent>
          {duas.filter(d => d.category === 'Morning').map(dua => (
            <Card key={dua.id} className="mb-4">
              <CardHeader>
                <CardTitle>{dua.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-arabic text-xl mb-2" dir="rtl">{dua.content}</p>
                <p className="text-sm italic text-muted-foreground">{dua.translation}</p>
              </CardContent>
            </Card>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="evening">
        <AccordionTrigger className="text-xl font-headline">Evening Duas</AccordionTrigger>
        <AccordionContent>
          {duas.filter(d => d.category === 'Evening').map(dua => (
            <Card key={dua.id} className="mb-4">
              <CardHeader>
                <CardTitle>{dua.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-arabic text-xl mb-2" dir="rtl">{dua.content}</p>
                <p className="text-sm italic text-muted-foreground">{dua.translation}</p>
              </CardContent>
            </Card>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="general">
        <AccordionTrigger className="text-xl font-headline">General Duas</AccordionTrigger>
        <AccordionContent>
          {duas.filter(d => d.category === 'General').map(dua => (
            <Card key={dua.id} className="mb-4">
              <CardHeader>
                <CardTitle>{dua.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-arabic text-xl mb-2" dir="rtl">{dua.content}</p>
                <p className="text-sm italic text-muted-foreground">{dua.translation}</p>
              </CardContent>
            </Card>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function HadithTab() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Search Hadith</CardTitle>
                    <CardDescription>Search by book, number, keyword or topic.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent>
                            {hadithBooks.map(book => <SelectItem key={book} value={book.toLowerCase()}>{book}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Hadith number (e.g., 1)" />
                    <Input placeholder="Keyword or Topic" className="md:col-span-2" />
                </CardContent>
                <CardFooter>
                    <Button><Search className="mr-2 h-4 w-4" />Search</Button>
                </CardFooter>
            </Card>
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-lg font-headline">Sahih al-Bukhari, Hadith 1</CardTitle>
                    <CardDescription>Topic: {sampleHadith.topic}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">{sampleHadith.text}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResourcesPage() {
  const resourcesImage = placeholderImages.find(p => p.id === 'resources-library');

  return (
    <div>
      <PageHeader
        title="Resource Library"
        subtitle="A curated collection of articles, duas, and hadith to enrich your Islamic knowledge."
        image={resourcesImage}
      />
      <section className="py-16 md:py-24">
        <div className="container">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="articles"><Newspaper className="mr-2 h-4 w-4"/>Articles</TabsTrigger>
              <TabsTrigger value="duas"><BookOpen className="mr-2 h-4 w-4"/>Duas</TabsTrigger>
              <TabsTrigger value="hadith"><BookOpen className="mr-2 h-4 w-4"/>Hadith</TabsTrigger>
            </TabsList>
            <TabsContent value="articles" className="mt-8">
              <ArticlesTab />
            </TabsContent>
            <TabsContent value="duas" className="mt-8">
              <DuasTab />
            </TabsContent>
            <TabsContent value="hadith" className="mt-8">
              <HadithTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
