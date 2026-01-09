
export type NavLink = {
    href: string;
    label: string;
};

export type Article = {
    id: string;
    title: string;
    source: string;
    category: string;
    content: string;
    url: string;
}

export type Dua = {
  id: string;
  category: 'Morning' | 'Evening' | 'General';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type HadithContent = {
    lang: 'ar' | 'en';
    chapterNumber: string;
    chapterTitle: string;
    urn: number;
    body: string;
    grades: { name: string; grade: string }[];
};

export type Hadith = {
    collection: string;
    bookNumber: string;
    hadithNumber: string;
    hadith: HadithContent[];
};

export type HadithResult = {
    total: number;
    hadiths: Hadith[];
};
