
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { placeholderImages, articles, duas, hadithBooks } from "@/lib/data";
import { BookOpen, Newspaper, Search, ChevronsRight, ChevronsLeft, ExternalLink, BookMarked, Footprints, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Hadith, HadithResult } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Source: Islamqa.info</p>
        </div>
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
  const duaCategories = ['Morning', 'Evening', 'General'];
  
  return (
    <Tabs defaultValue="Morning" className="w-full">
      <div className="flex justify-center">
        <TabsList>
          {duaCategories.map(category => (
              <TabsTrigger key={category} value={category}>
              {category}
              </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {duaCategories.map(category => (
        <TabsContent key={category} value={category} className="mt-8">
            <div className="space-y-6 max-w-4xl mx-auto">
            {duas.filter(d => d.category === category).map(dua => (
                <Collapsible key={dua.id} asChild>
                    <Card className="shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle className="font-headline text-primary">{dua.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="font-arabic text-3xl/relaxed text-right" dir="rtl">{dua.arabic}</p>
                            <CollapsibleContent className="space-y-6">
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Footprints className="h-5 w-5 text-primary/70 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold">Transliteration</h4>
                                            <p className="text-sm text-muted-foreground italic">{dua.transliteration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <BookOpen className="h-5 w-5 text-primary/70 flex-shrink-0 mt-0.5" />
                                        <div>
                                        <h4 className="font-semibold">Translation</h4>
                                        <p className="text-sm text-muted-foreground">{dua.translation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                    <BookMarked className="h-5 w-5 text-primary/70 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Reference</h4>
                                        <p className="text-xs text-muted-foreground">{dua.reference}</p>
                                    </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </CardContent>
                        <CardFooter>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="mx-auto text-muted-foreground data-[state=open]:rotate-180 transition-transform">
                                    <ChevronDown className="h-5 w-5" />
                                    <span className="sr-only">Toggle details</span>
                                </Button>
                            </CollapsibleTrigger>
                        </CardFooter>
                    </Card>
                </Collapsible>
            ))}
            </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}


function HadithTab() {
    const [selectedBook, setSelectedBook] = useState('');
    const [hadithNumber, setHadithNumber] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<HadithResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!selectedBook || !hadithNumber) {
            setError("Please select a book and enter a hadith number.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearchResults(null);

        try {
            const searchParams = new URLSearchParams();
            if (selectedBook) searchParams.append('collection', selectedBook);
            if (hadithNumber) searchParams.append('hadithNumber', hadithNumber);
            if (keyword) {
                 setError("Keyword search is not supported. Please search by book and hadith number.");
                 setIsLoading(false);
                 return;
            }

            const response = await fetch(`/api/hadith?${searchParams.toString()}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Hadith not found or API error. Please check your input.');
            }
            
            const data = await response.json();
            setSearchResults(data);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Search Hadith</CardTitle>
                    <CardDescription>Search by book and number.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={selectedBook} onValueChange={setSelectedBook}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent>
                            {hadithBooks.map(book => <SelectItem key={book.name} value={book.name}>{book.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input 
                        placeholder="Hadith number (e.g., 1)" 
                        value={hadithNumber}
                        onChange={(e) => setHadithNumber(e.target.value)}
                        disabled={!selectedBook}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSearch} disabled={isLoading || !selectedBook || !hadithNumber}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                </CardFooter>
            </Card>

            {error && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                </div>
            )}
            
            {searchResults && searchResults.hadiths.length > 0 && (
                <div className="space-y-4">
                    {searchResults.hadiths.map((hadith) => (
                         <Card key={`${hadith.collection}-${hadith.hadithnumber}`} className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle className="text-lg font-headline">
                                    {hadithBooks.find(b => b.name === hadith.collection)?.title}, Hadith {hadith.hadithnumber}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg leading-relaxed font-arabic text-right mb-4" dir="rtl">{hadith.arabic.text}</p>
                                <p className="text-foreground/90">{hadith.text}</p>
                            </CardContent>
                            <CardFooter>
                                {hadith.grades?.map((grade, index) => (
                                    <Badge key={index} variant="outline" className="mr-2">{grade.grade}</Badge>
                                ))}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            
            {searchResults && searchResults.hadiths.length === 0 && (
                <p className="text-center text-muted-foreground">No hadith found matching your search criteria.</p>
            )}
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
          <Tabs defaultValue="hadith" className="w-full">
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
