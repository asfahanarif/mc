import type { Testimonial, ForumPost, Article, Dua, Hadith, TeamMember, EventPost, PlaceholderImage } from "./types";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/quran", label: "Qur’an" },
  { href: "/resources", label: "Resources" },
  { href: "/forum", label: "Forum" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
];

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Aisha B.",
        location: "Toronto, Canada",
        comment: "Muslimahs Club has been a true blessing. The community is so supportive, and the resources have helped me grow so much in my deen. I finally feel like I have a place where I belong.",
        avatar: "https://picsum.photos/seed/1/40/40"
    },
    {
        id: "2",
        name: "Fatima Z.",
        location: "London, UK",
        comment: "I love the Qur'an sessions and the variety of events. It's amazing to connect with sisters from all over the world who share the same values. Highly recommend!",
        avatar: "https://picsum.photos/seed/2/40/40"
    },
    {
        id: "3",
        name: "Zainab A.",
        location: "Lagos, Nigeria",
        comment: "The Q&A forum is my favorite feature. Getting well-thought-out answers to my questions has been invaluable. The sense of sisterhood here is incredible.",
        avatar: "https://picsum.photos/seed/3/40/40"
    },
    {
        id: "4",
        name: "Sumayyah K.",
        location: "Kuala Lumpur, Malaysia",
        comment: "As a new Muslim, this platform has been my go-to for authentic knowledge. The articles are easy to understand and the community has been so welcoming.",
        avatar: "https://picsum.photos/seed/4/40/40"
    }
];

export const forumPosts: ForumPost[] = [
    {
        id: 'q1',
        author: 'Amina',
        question: 'What is the best way to start learning Arabic to understand the Quran?',
        answer: 'Starting with the Arabic alphabet and basic grammar is a great first step. We recommend finding a structured course, like the ones in our resources section, and practicing daily. Consistency is key!',
        isAnswered: true
    },
    {
        id: 'q2',
        author: 'Layla',
        question: 'How can I balance my work/studies with my daily prayers and Islamic learning?',
        answer: 'Balancing responsibilities can be challenging. Creating a schedule and prioritizing your prayers is essential. Try dedicating even 15-20 minutes daily for Islamic learning. Small, consistent efforts make a big difference. May Allah make it easy for you.',
        isAnswered: true
    },
    {
        id: 'q3',
        author: 'Noor',
        question: 'I struggle with staying motivated to pray all my sunnah prayers. Any advice?',
        answer: null,
        isAnswered: false
    }
];


export const articles: Article[] = Array.from({ length: 50 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `The Ruling on Celebrating the Middle of Sha’baan - IslamQA #${i+1}`,
    source: 'islamqa.info',
    category: i % 5 === 0 ? 'Fiqh' : (i % 5 === 1 ? 'Aqeedah' : (i % 5 === 2 ? 'Family' : (i % 5 === 3 ? 'Character' : 'History'))),
    content: 'Celebrating the middle of Sha’baan (Laylat al-Nusf min Sha’baan) is a controversial issue. There is no sound evidence from the Prophet (peace and blessings of Allaah be upon him) or his Companions to suggest that it should be singled out for celebration...'
}));

export const duas: Dua[] = [
    { id: 'd1', category: 'Morning', title: 'Morning Remembrance', content: 'Asbahna wa asbahal-mulku lillah...', translation: 'We have entered a new day and with it all dominion is Allahs...' },
    { id: 'd2', category: 'Evening', title: 'Evening Remembrance', content: 'Amsayna wa amsal-mulku lillah...', translation: 'We have reached the evening and with it all dominion is Allahs...' },
    { id: 'd3', category: 'General', title: 'Dua for Guidance', content: 'Allahumma inni as\'alukal-huda wat-tuqa wal-\'afafa wal-ghina', translation: 'O Allah, I ask You for guidance, piety, abstinence and independence.' },
];

export const hadithBooks = [
  "Bukhari", "Muslim", "Abu Dawood", "Tirmidhi", "Nasai", "Ibn Majah", "Muwatta Malik"
];

export const sampleHadith: Hadith = {
  book: 'Bukhari',
  number: 1,
  topic: 'Revelation',
  text: 'Actions are but by intention and every man shall have but that which he intended...',
};

export const teamMembers: TeamMember[] = [
    { id: 'tm1', name: 'Dr. Fatima Ahmed', role: 'Founder & Director', avatar: 'https://picsum.photos/seed/t1/100/100' },
    { id: 'tm2', name: 'Aisha Khan', role: 'Head of Education', avatar: 'https://picsum.photos/seed/t2/100/100' },
    { id: 'tm3', name: 'Zainab Yusuf', role: 'Community Manager', avatar: 'https://picsum.photos/seed/t3/100/100' },
    { id: 'tm4', name: 'Hafsa Ali', role: 'Events Coordinator', avatar: 'https://picsum.photos/seed/t4/100/100' },
];

export const events: EventPost[] = [
    { id: 'ev1', title: 'Weekly Qur\'an Tafsir Circle', type: 'Online', date: 'Every Saturday', description: 'Join us for a deep dive into the meanings of the Qur\'an.', image: 'https://picsum.photos/seed/ev1/600/400' },
    { id: 'ev2', title: 'Sisters\' Annual Conference', type: 'Onsite', date: '2024-12-15', description: 'Our flagship annual event with renowned speakers, workshops, and sisterhood.', image: 'https://picsum.photos/seed/ev2/600/400' },
    { id: 'ev3', title: 'Fiqh of Menstruation Workshop', type: 'Online', date: '2024-11-20', description: 'An essential workshop covering the Islamic rulings related to menstruation.', image: 'https://picsum.photos/seed/ev3/600/400' },
];

import placeholderData from './placeholder-images.json';
export const placeholderImages: PlaceholderImage[] = placeholderData.placeholderImages;
