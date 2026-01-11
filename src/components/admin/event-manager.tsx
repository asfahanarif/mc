
'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
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
import { Pencil, PlusCircle, Trash2, Loader2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getEventDescriptionSuggestion } from '@/ai/flows/suggest-event-description';
import { Label } from '../ui/label';

type EventWithId = Event & { id: string };

type RegistrationType = 'url' | 'whatsapp';

function EventForm({
  event,
  onClose,
  maxOrder = 0,
}: {
  event?: EventWithId;
  onClose: () => void;
  maxOrder?: number;
}) {
  const firestore = useFirestore();
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  
  const isWhatsAppUrl = (url?: string) => url?.startsWith('https://wa.me/') || false;

  const getWhatsAppNumber = (url?: string) => {
    if (!url || !isWhatsAppUrl(url)) return '';
    return url.split('/')[3]?.split('?')[0] || '';
  };

  const getWhatsAppMessage = (url?: string) => {
    if (!url || !isWhatsAppUrl(url)) return '';
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('text') || '';
  };

  const [registrationType, setRegistrationType] = useState<RegistrationType>(isWhatsAppUrl(event?.registrationUrl) ? 'whatsapp' : 'url');
  const [whatsAppNumber, setWhatsAppNumber] = useState(getWhatsAppNumber(event?.registrationUrl));
  const [whatsAppMessage, setWhatsAppMessage] = useState(getWhatsAppMessage(event?.registrationUrl));

  const form = useForm<Event>({
    resolver: zodResolver(EventSchema),
    defaultValues: event || {
      title: '',
      description: '',
      schedule: '',
      location: '',
      type: 'Online',
      imageUrl: '',
      order: maxOrder + 1,
      registrationUrl: '',
      directionsUrl: '',
      status: 'Upcoming',
    },
  });
  const { toast } = useToast();

  const eventType = form.watch('type');

  const handleGetSuggestion = async () => {
    const title = form.getValues('title');
    if (!title) {
        toast({ title: "Please enter a title first.", variant: "destructive" });
        return;
    }
    setIsGettingSuggestion(true);
    try {
        const result = await getEventDescriptionSuggestion({ title });
        form.setValue('description', result.suggestedDescription, { shouldValidate: true });
    } catch (error) {
        console.error("Error getting AI suggestion:", error);
        toast({ title: "Could not get suggestion.", variant: "destructive" });
    } finally {
        setIsGettingSuggestion(false);
    }
  }

  const onSubmit = (data: Event) => {
    let finalRegistrationUrl = '';
    if (registrationType === 'whatsapp') {
      if (whatsAppNumber) {
        const message = whatsAppMessage || `As-salamu alaykum! I would like to register for the event: "${data.title}". My name is:`;
        finalRegistrationUrl = `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      }
    } else {
      finalRegistrationUrl = data.registrationUrl || '';
    }
    
    const eventData = { ...data, registrationUrl: finalRegistrationUrl };

    if (!eventData.order) {
        eventData.order = maxOrder + 1;
    }

    const eventRef = event ? doc(firestore, 'events', event.id) : doc(collection(firestore, 'events'));
    setDocumentNonBlocking(eventRef, eventData, { merge: true });
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
               <div className="flex justify-between items-center">
                <FormLabel>Description</FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={handleGetSuggestion} disabled={isGettingSuggestion}>
                    {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Get AI Suggestion
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="A deep dive into Surah Al-Fatiha..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Schedule / Days</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Every Saturday" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select event status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{eventType === 'Onsite' ? 'Venue Name / Address' : 'Location (e.g., Zoom)'}</FormLabel>
              <FormControl>
                <Input placeholder={eventType === 'Onsite' ? '123 Main St, City' : 'Online (Zoom)'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {eventType === 'Onsite' && (
             <FormField
                control={form.control}
                name="directionsUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Directions URL (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://maps.app.goo.gl/xyz" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )}
        
        <div className="space-y-2">
            <Label>Registration Method</Label>
            <Select onValueChange={(value: RegistrationType) => setRegistrationType(value)} defaultValue={registrationType}>
                <SelectTrigger>
                    <SelectValue placeholder="Select registration method" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="url">URL (e.g., Google Form)</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {registrationType === 'url' && (
            <FormField
                control={form.control}
                name="registrationUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Registration URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://forms.gle/xyz" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}
        
        {registrationType === 'whatsapp' && (
            <div className='space-y-4 p-4 border rounded-md'>
                <div className='space-y-2'>
                    <Label>WhatsApp Number</Label>
                    <Input placeholder="+1234567890" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
                </div>
                 <div className='space-y-2'>
                    <Label>Pre-filled Message (Optional)</Label>
                    <Textarea 
                        placeholder={`I want to register for '${form.watch('title') || 'this event'}'.`}
                        value={whatsAppMessage}
                        onChange={(e) => setWhatsAppMessage(e.target.value)}
                    />
                </div>
            </div>
        )}

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

function EventDialog({ event, maxOrder }: { event?: EventWithId, maxOrder?: number }) {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details for this event.' : 'Fill out the form to create a new event.'}
          </DialogDescription>
        </DialogHeader>
        <EventForm event={event} onClose={() => setOpen(false)} maxOrder={maxOrder} />
      </DialogContent>
    </Dialog>
  );
}

export default function EventManager() {
  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => query(collection(firestore, 'events'), orderBy('order', 'asc')), [firestore]);
  const { data: events, isLoading } = useCollection<Event>(eventsQuery);
  const { toast } = useToast();

  const maxOrder = events ? Math.max(0, ...events.map(e => e.order || 0)) : 0;

  const handleReorder = (currentIndex: number, direction: 'up' | 'down') => {
    if (!events) return;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= events.length) return;

    const currentEvent = events[currentIndex];
    const swapEvent = events[newIndex];
    
    const currentEventRef = doc(firestore, 'events', currentEvent.id);
    const swapEventRef = doc(firestore, 'events', swapEvent.id);

    // Swap order values
    updateDocumentNonBlocking(currentEventRef, { order: swapEvent.order });
    updateDocumentNonBlocking(swapEventRef, { order: currentEvent.order });

    toast({ title: "Reordering events..." });
  };

  const handleDuplicate = (event: EventWithId) => {
    const { id, ...eventData } = event;
    const newEvent = {
      ...eventData,
      title: `Copy of ${event.title}`,
      order: maxOrder + 1,
    };
    addDocumentNonBlocking(collection(firestore, 'events'), newEvent);
    toast({
      title: 'Event Duplicated',
      description: `A copy of "${event.title}" has been created.`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Add, edit, or delete community events.</CardDescription>
        </div>
        <EventDialog maxOrder={maxOrder} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          {events?.map((event, index) => (
            <Card key={event.id} className="flex items-center justify-between p-4">
              <div className="flex items-center">
                 <div className="flex flex-col gap-1 mr-4">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleReorder(index, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleReorder(index, 'down')} disabled={index === events.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </div>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.schedule} - {event.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(event)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <EventDialog event={event} maxOrder={maxOrder} />
              </div>
            </Card>
          ))}
          {!isLoading && events?.length === 0 && <p className='text-center text-muted-foreground py-8'>No events found. Add one to get started.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
