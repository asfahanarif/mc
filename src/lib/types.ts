export type NavLink = {
    href: string;
    label: string;
};

// These types are now replaced by Zod schemas in `lib/schemas.ts`
// Keeping the file for other potential shared types, but the main
// data-related types should be inferred from schemas.

export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
