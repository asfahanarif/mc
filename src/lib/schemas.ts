import { z } from 'zod';

export const EventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  location: z.string().min(3, 'Location is required'),
  type: z.enum(['Online', 'Onsite']),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type Event = z.infer<typeof EventSchema>;

export const TestimonialSchema = z.object({
  authorName: z.string().min(2, 'Author name is required'),
  authorTitle: z.string().min(2, 'Author title/location is required'),
  content: z.string().min(10, 'Testimonial content is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

export const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(2, 'Title is required'),
  bio: z.string().min(10, 'Bio is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const ForumReplySchema = z.object({
  id: z.string().uuid(),
  authorName: z.string(),
  reply: z.string(),
  timestamp: z.any(),
  isAdminReply: z.boolean().optional(),
});

export const ForumPostSchema = z.object({
  authorName: z.string(),
  question: z.string(),
  replies: z.array(ForumReplySchema),
  timestamp: z.any(), // Firestore server timestamp
  isClosed: z.boolean().optional(),
});

export type ForumReply = z.infer<typeof ForumReplySchema>;
export type ForumPost = z.infer<typeof ForumPostSchema>;
