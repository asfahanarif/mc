"use client";

import { useFormState, useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
      Subscribe
    </Button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, { message: null });
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
        toast({
            title: state.message.includes("Thank you") ? "Success!" : "Error",
            description: state.message,
            variant: state.message.includes("Thank you") ? "default" : "destructive"
        })
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" name="email" placeholder="Enter your email" required />
      <SubmitButton />
    </form>
  );
}
