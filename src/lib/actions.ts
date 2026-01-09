
"use server";

import { z } from "zod";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";

const emailSchema = z.string().email({ message: "Invalid email address." });
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const validatedEmail = emailSchema.safeParse(email);

  if (!validatedEmail.success) {
    return {
      message: validatedEmail.error.errors[0].message,
    };
  }
  
  try {
    // Ensure Firebase is initialized on the server for this action
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const firestore = getFirestore();
    
    const subscriptionsCollection = collection(firestore, 'newsletter_subscriptions');
    await addDoc(subscriptionsCollection, {
      email: validatedEmail.data,
      subscribedAt: serverTimestamp(),
    });
    
    return {
      message: "Thank you for subscribing!",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
        message: "An error occurred. Please try again later."
    }
  }
}
