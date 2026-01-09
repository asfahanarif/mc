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

// These types are now replaced by Zod schemas in `lib/schemas.ts`
// Keeping the file for other potential shared types, but the main
// data-related types should be inferred from schemas.

export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
