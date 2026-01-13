
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


export type Hadith = {
    hadithnumber: number;
    arabic: {
        text: string;
        footnotes: any[];
    };
    text: string;
    footnotes: any[];
    grades: { name: string; grade: string }[];
    reference: {
        book: number;
        hadith: number;
    };
    collection: string; // I'm adding this to track which book it's from
};

export type HadithResult = {
    hadiths: Hadith[];
};

export type TranslationEdition = {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string;
};
