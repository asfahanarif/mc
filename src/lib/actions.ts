
"use server";

import { z } from "zod";
import { initializeFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    const { firestore } = initializeFirebase();
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

export async function submitContactForm(prevState: any, formData: FormData) {
    const validatedFields = contactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors and try again.'
        }
    }

    // In a real app, you would send this email or save it to a database.
    console.log("New contact form submission:", validatedFields.data);

    return {
        message: 'Thank you for your message! We will get back to you soon.',
        errors: {}
    }
}
