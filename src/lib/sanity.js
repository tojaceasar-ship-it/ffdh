import { createClient } from '@sanity/client';

// Sanity client configuration
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '9xzlbwva',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-10-01',
  useCdn: import.meta.env.PROD,
  token: import.meta.env.VITE_SANITY_TOKEN
});

// Note: Schemas for all content types are defined in a separate Sanity Studio setup.
// This includes schemas for navigation, homepage content, characters, shop products,
// lookbook entries, manifest, newsletter alerts, footer texts, user data, system settings,
// and all other editable content to ensure full editability via the admin panel.
