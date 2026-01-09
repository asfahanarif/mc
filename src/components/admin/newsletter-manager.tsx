
'use client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';
import { Mail, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscription {
    email: string;
    subscribedAt: {
        seconds: number;
        nanoseconds: number;
    };
}

export default function NewsletterManager() {
  const firestore = useFirestore();
  const subscriptionsQuery = useMemoFirebase(() => query(collection(firestore, 'newsletter_subscriptions'), orderBy('subscribedAt', 'desc')), [firestore]);
  const { data: subscriptions, isLoading } = useCollection<NewsletterSubscription>(subscriptionsQuery);
  const { toast } = useToast();

  const handleCopyEmails = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast({
        title: 'No emails to copy',
        variant: 'destructive',
      });
      return;
    }
    const emailList = subscriptions.map(sub => sub.email).join(', ');
    navigator.clipboard.writeText(emailList);
    toast({
      title: 'Emails Copied!',
      description: `${subscriptions.length} subscriber emails have been copied to your clipboard.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>View and manage your newsletter subscriber list.</CardDescription>
        </div>
        <Button onClick={handleCopyEmails} disabled={isLoading || !subscriptions || subscriptions.length === 0}>
            <Copy className="mr-2 h-4 w-4" />
            Copy All Emails
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead className='text-right'>Subscription Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell className='text-right'><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {subscriptions?.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {!isLoading && subscriptions?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <Mail className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No subscribers yet</h3>
                <p>When users subscribe to your newsletter, their emails will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
