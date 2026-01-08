'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignUp, initiateEmailSignIn } from '@/firebase';
import { useAuth } from '@/firebase';

export default function AuthPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const { toast } = useToast();

  const handleAuthAction = async (action: 'signUp' | 'signIn') => {
    try {
      if (action === 'signUp') {
        initiateEmailSignUp(auth, email, password);
        toast({ title: 'Sign Up Successful', description: 'You have been signed up.' });
      } else {
        initiateEmailSignIn(auth, email, password);
        toast({ title: 'Sign In Successful', description: 'You are now logged in.' });
      }
    } catch (error: any) {
      toast({ title: 'Authentication Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>Please sign in or sign up to manage your content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <Button onClick={() => handleAuthAction('signIn')} className="w-full">
            Sign In
          </Button>
          <Button onClick={() => handleAuthAction('signUp')} variant="outline" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
