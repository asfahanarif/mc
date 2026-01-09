'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
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
import { Pencil, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { getTestimonialContentSuggestion } from '@/ai/flows/suggest-testimonial-content';

type TestimonialWithId = Testimonial & { id: string };

function TestimonialForm({
  testimonial,
  onClose,
}: {
  testimonial?: TestimonialWithId;
  onClose: () => void;
}) {
  const firestore = useFirestore();
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const form = useForm<Testimonial>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: testimonial || { authorName: '', authorTitle: '', content: '', imageUrl: '' },
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
    const testimonialRef = testimonial ? doc(firestore, 'testimonials', testimonial.id) : doc(collection(firestore, 'testimonials'));
    setDocumentNonBlocking(testimonialRef, data, { merge: true });
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

function TestimonialDialog({ testimonial }: { testimonial?: TestimonialWithId }) {
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
        <TestimonialForm testimonial={testimonial} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default function TestimonialManager() {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => collection(firestore, 'testimonials'), [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from ${name}?`)) {
      const testimonialRef = doc(firestore, 'testimonials', id);
      deleteDocumentNonBlocking(testimonialRef);
      toast({
        title: 'Testimonial Deleted',
        description: `The testimonial from ${name} has been deleted.`,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Testimonial Management</CardTitle>
            <CardDescription>Manage what your members are saying.</CardDescription>
        </div>
        <TestimonialDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="flex items-center justify-between p-4">
                <div className='flex items-center gap-4'>
                    <Image src={testimonial.imageUrl || `https://picsum.photos/seed/${testimonial.id}/64/64`} alt={testimonial.authorName} width={48} height={48} className='rounded-full' />
                    <div>
                        <p className="italic">"{testimonial.content.substring(0,80)}..."</p>
                        <p className="text-sm text-muted-foreground mt-2">- {testimonial.authorName}, {testimonial.authorTitle}</p>
                    </div>
                </div>
              <div className="flex items-center">
                <TestimonialDialog testimonial={testimonial} />
                <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id, testimonial.authorName)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
          {!isLoading && testimonials?.length === 0 && <p className='text-center text-muted-foreground py-8'>No testimonials found. Add one to get started.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
