'use client';
import { useState } from 'react';
import { useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamMemberSchema, type TeamMember } from '@/lib/schemas';
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
import { getTeamMemberBioSuggestion } from '@/ai/flows/suggest-team-member-bio';

type TeamMemberWithId = TeamMember & { id: string };

function TeamMemberForm({
  member,
  onClose,
}: {
  member?: TeamMemberWithId;
  onClose: () => void;
}) {
  const firestore = useFirestore();
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const form = useForm<TeamMember>({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: member || { name: '', title: '', bio: '', imageUrl: '' },
  });
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
      const name = form.getValues('name');
      const title = form.getValues('title');
      if (!name || !title) {
          toast({ title: "Please enter a name and title first.", variant: "destructive" });
          return;
      }
      setIsGettingSuggestion(true);
      try {
          const result = await getTeamMemberBioSuggestion({ name, title });
          form.setValue('bio', result.suggestedBio, { shouldValidate: true });
      } catch (error) {
          console.error("Error getting AI suggestion:", error);
          toast({ title: "Could not get suggestion.", variant: "destructive" });
      } finally {
          setIsGettingSuggestion(false);
      }
  }

  const onSubmit = (data: TeamMember) => {
    const memberRef = member ? doc(firestore, 'team_members', member.id) : doc(collection(firestore, 'team_members'));
    setDocumentNonBlocking(memberRef, data, { merge: true });
    toast({
      title: member ? 'Team Member Updated' : 'Team Member Added',
      description: `The profile for ${data.name} has been saved.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Fatima Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title / Role</FormLabel>
              <FormControl>
                <Input placeholder="Founder & Director" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
               <div className="flex justify-between items-center">
                <FormLabel>Short Bio</FormLabel>
                 <Button type="button" size="sm" variant="outline" onClick={handleGetSuggestion} disabled={isGettingSuggestion}>
                    {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Get AI Suggestion
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="A short bio about the team member." {...field} />
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

function TeamMemberDialog({ member }: { member?: TeamMemberWithId }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {member ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update the profile details.' : 'Fill out the form to add a new member.'}
          </DialogDescription>
        </DialogHeader>
        <TeamMemberForm member={member} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default function TeamManager() {
  const firestore = useFirestore();
  const teamQuery = useMemoFirebase(() => collection(firestore, 'team_members'), [firestore]);
  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamQuery);
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the profile for ${name}?`)) {
      const memberRef = doc(firestore, 'team_members', id);
      deleteDocumentNonBlocking(memberRef);
      toast({
        title: 'Team Member Deleted',
        description: `The profile for ${name} has been deleted.`,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage your organization's team members.</CardDescription>
        </div>
        <TeamMemberDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && [...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          {teamMembers?.map((member) => (
            <Card key={member.id} className="flex items-center justify-between p-4">
                <div className='flex items-center gap-4'>
                    <Image src={member.imageUrl || `https://picsum.photos/seed/${member.id}/64/64`} alt={member.name} width={64} height={64} className='rounded-full' />
                    <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.title}</p>
                    </div>
                </div>
              <div className="flex items-center">
                <TeamMemberDialog member={member} />
                <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id, member.name)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
          {!isLoading && teamMembers?.length === 0 && <p className='text-center text-muted-foreground py-8'>No team members found. Add one to get started.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
