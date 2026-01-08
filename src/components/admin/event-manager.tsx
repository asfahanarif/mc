'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventSchema, type Event } from '@/lib/schemas';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type EventWithId = Event & { id: string };

function EventForm({
  event,
  onClose,
}: {
  event?: EventWithId;
  onClose: () => void;
}) {
  const firestore = useFirestore();
  const form = useForm<Event>({
    resolver: zodResolver(EventSchema),
    defaultValues: event || {
      title: '',
      description: '',
      date: '',
      location: '',
      type: 'Online',
      imageUrl: '',
    },
  });
  const { toast } = useToast();

  const onSubmit = (data: Event) => {
    const eventRef = event ? doc(firestore, 'events', event.id) : doc(collection(firestore, 'events'));
    setDocumentNonBlocking(eventRef, data, { merge: true });
    toast({
      title: event ? 'Event Updated' : 'Event Created',
      description: `The event "${data.title}" has been saved.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Weekly Qur'an Tafsir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A deep dive into Surah Al-Fatiha..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Online (Zoom)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
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

function EventDialog({ event }: { event?: EventWithId }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {event ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details for this event.' : 'Fill out the form to create a new event.'}
          </DialogDescription>
        </DialogHeader>
        <EventForm event={event} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default function EventManager() {
  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => collection(firestore, 'events'), [firestore]);
  const { data: events, isLoading } = useCollection<Event>(eventsQuery);
  const { toast } = useToast();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
      const eventRef = doc(firestore, 'events', id);
      deleteDocumentNonBlocking(eventRef);
      toast({
        title: 'Event Deleted',
        description: `The event "${title}" has been deleted.`,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Add, edit, or delete community events.</CardDescription>
        </div>
        <EventDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          {events?.map((event) => (
            <Card key={event.id} className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()} - {event.location}</p>
              </div>
              <div className="flex items-center">
                <EventDialog event={event} />
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id, event.title)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
          {!isLoading && events?.length === 0 && <p className='text-center text-muted-foreground py-8'>No events found. Add one to get started.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
