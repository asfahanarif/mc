
'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestimonialSchema, type Testimonial } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Pencil, PlusCircle, Trash2, Loader2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { getTestimonialContentSuggestion } from '@/lib/actions/ai';

type TestimonialWithId = Testimonial & { id: string };

function TestimonialForm({
  testimonial,
  onClose,
  maxOrder = 0,
}: {
  testimonial?: TestimonialWithId;
  onClose: () => void;
  maxOrder?: number;
}) {
  const firestore = useFirestore();
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const form = useForm<Testimonial>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: testimonial || { 
        authorName: '', 
        authorTitle: '', 
        content: '', 
        imageUrl: '',
        order: maxOrder + 1,
    },
  });
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    const authorName = form.getValues('authorName');
    if (!authorName) {
        toast({ title: "Please enter an author's name first.", variant: "destructive" });
        return;
    }
    setIsGettingSuggestion(true);
    try {
        const result = await getTestimonialContentSuggestion({ authorName });
        form.setValue('content', result.suggestedContent, { shouldValidate: true });
    } catch (error) {
        console.error("Error getting AI suggestion:", error);
        toast({ title: "Could not get suggestion.", variant: "destructive" });
    } finally {
        setIsGettingSuggestion(false);
    }
  }

  const onSubmit = (data: Testimonial) => {
    const testimonialData = { ...data };
    if (!testimonialData.order) {
        testimonialData.order = maxOrder + 1;
    }

    const testimonialRef = testimonial ? doc(firestore, 'testimonials', testimonial.id) : doc(collection(firestore, 'testimonials'));
    setDocumentNonBlocking(testimonialRef, testimonialData, { merge: true });
    toast({
      title: testimonial ? 'Testimonial Updated' : 'Testimonial Added',
      description: `The testimonial from ${data.authorName} has been saved.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author's Name</FormLabel>
              <FormControl>
                <Input placeholder="Aisha B." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author's Title (e.g. Location)</FormLabel>
              <FormControl>
                <Input placeholder="Toronto, Canada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Testimonial Content</FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={handleGetSuggestion} disabled={isGettingSuggestion}>
                    {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Get AI Suggestion
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="Muslimahs Club has been a true blessing..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author's Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function TestimonialDialog({ testimonial, maxOrder }: { testimonial?: TestimonialWithId, maxOrder?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {testimonial ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
          <DialogDescription>
            {testimonial ? 'Update the testimonial details.' : 'Fill out the form to add a new testimonial.'}
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm testimonial={testimonial} onClose={() => setOpen(false)} maxOrder={maxOrder} />
      </DialogContent>
    </Dialog>
  );
}

export default function TestimonialManager() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => query(collection(firestore, 'testimonials'), orderBy('order', 'asc')), [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);
  const { toast } = useToast();

  const maxOrder = testimonials ? Math.max(0, ...testimonials.map(t => t.order || 0)) : 0;

  const handleReorder = (currentIndex: number, direction: 'up' | 'down') => {
    if (!testimonials) return;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;

    const currentTestimonial = testimonials[currentIndex];
    const swapTestimonial = testimonials[newIndex];
    
    const currentTestimonialRef = doc(firestore, 'testimonials', currentTestimonial.id);
    const swapTestimonialRef = doc(firestore, 'testimonials', swapTestimonial.id);

    // Swap order values
    updateDocumentNonBlocking(currentTestimonialRef, { order: swapTestimonial.order });
    updateDocumentNonBlocking(swapTestimonialRef, { order: currentTestimonial.order });

    toast({ title: "Reordering testimonials..." });
  };

  const handleDuplicate = (testimonial: TestimonialWithId) => {
    const { id, ...testimonialData } = testimonial;
    const newTestimonial = {
      ...testimonialData,
      authorName: `Copy of ${testimonial.authorName}`,
      order: maxOrder + 1,
    };
    addDocumentNonBlocking(collection(firestore, 'testimonials'), newTestimonial);
    toast({
      title: 'Testimonial Duplicated',
      description: `A copy of the testimonial from "${testimonial.authorName}" has been created.`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Testimonial Management</CardTitle>
            <CardDescription>Manage what your members are saying.</CardDescription>
        </div>
        <TestimonialDialog maxOrder={maxOrder} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          {testimonials?.map((testimonial, index) => (
            <Card key={testimonial.id} className="flex items-center justify-between p-4">
                <div className='flex items-center gap-4'>
                    <div className="flex flex-col gap-1 mr-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleReorder(index, 'up')} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleReorder(index, 'down')} disabled={index === testimonials.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image src={testimonial.imageUrl || 'https://i.pinimg.com/736x/51/bd/ec/51bdec9c6b1b42e993d540ec4c418bc7.jpg'} alt={testimonial.authorName} width={48} height={48} className='rounded-full' />
                    <div>
                        <p className="italic">"{testimonial.content.substring(0,80)}..."</p>
                        <p className="text-sm text-muted-foreground mt-2">- {testimonial.authorName}, {testimonial.authorTitle}</p>
                    </div>
                </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(testimonial)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <TestimonialDialog testimonial={testimonial} maxOrder={maxOrder} />
              </div>
            </Card>
          ))}
          {!isLoading && testimonials?.length === 0 && <p className='text-center text-muted-foreground py-8'>No testimonials found. Add one to get started.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

    