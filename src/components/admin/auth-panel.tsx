'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn } from '@/firebase';
import { useAuth } from '@/firebase';

export default function AuthPanel() {
  const [email, setEmail] = useState('admin@muslimahs.club');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    // Hardcode the check for the admin password for extra clarity on the client-side
    if (password !== 'admin@mc') {
        toast({ title: 'Authentication Error', description: 'Invalid password.', variant: 'destructive' });
        return;
    }

    try {
      // Firebase will still verify the credentials on the backend
      initiateEmailSignIn(auth, email, password);
      toast({ title: 'Sign In Successful', description: 'You are now logged in.' });
    } catch (error: any) {
      toast({ title: 'Authentication Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Please sign in to manage your content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@muslimahs.club"
              value={email}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleSignIn} className="w-full">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
