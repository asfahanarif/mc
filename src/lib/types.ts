export type NavLink = {
    href: string;
    label: string;
};

export type Testimonial = {
    id: string;
    name: string;
    location: string;
    comment: string;
    avatar: string;
};

export type ForumPost = {
    id: string;
    author: string;
    question: string;
    answer: string | null;
    isAnswered: boolean;
};

export type Article = {
    id: string;
    title: string;
    source: string;
    category: string;
    content: string;
};

export type Dua = {
    id: string;
    category: 'Morning' | 'Evening' | 'General';
    title: string;
    content: string;
    translation: string;
};

export type Hadith = {
    book: string;
    number: number;
    topic: string;
    text: string;
};

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatar: string;
};

export type EventPost = {
    id: string;
    title: string;
    type: 'Online' | 'Onsite';
    date: string;
    description: string;
    image: string;
};

export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
