
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthPanel() {
  const email = 'admin@muslimahs.club';
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Sign In Successful', description: 'You are now logged in.' });
    } catch (error: any) {
      // Use Firebase's error message for more specific feedback
      const errorMessage = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password. Please try again.'
        : error.message;
      toast({ title: 'Authentication Error', description: errorMessage, variant: 'destructive' });
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
