# Sanity Studio Schemas for Fruits From Da Hood

This document outlines the necessary schemas to be defined in Sanity Studio for the `fruitsfromdahood.pl` project. The goal is to ensure the admin panel allows for editing of *all* content and settings across the site, meeting the requirement for full editability.

## Core Content Schemas

1. **Navigation Menu**
   - Fields: Category (string), Items (array of objects with label, url, icon, description, status)
   - Purpose: Manage site navigation structure for header and sidebar.

2. **Homepage Content**
   - Fields: Title (string), Description (text), Hero Slides (array of objects with id, character, title, subtitle, description, imageUrl, cta, ctaLink, bgGradient)
   - Purpose: Manage homepage content, especially hero section slides.

3. **Character Profile**
   - Fields: Name (string), Emoji (string), Description (text), Image (image), Slogan (string), Status (string), Last Update (date)
   - Purpose: Manage character data for the 'Characters Section'.

4. **Shop Products**
   - Fields: Name (string), Description (text), Price (number), Images (array of images), Category (string), Variants (array of objects with size, color), Printful ID (string)
   - Purpose: Manage product listings integrated with Printful API for e-commerce.

5. **Lookbook Entries**
   - Fields: Title (string), Description (text), Images (array of images), Video URL (string), Tags (array of strings), Publish Date (date)
   - Purpose: Manage lifestyle gallery and social media feed content.

6. **Manifest Content**
   - Fields: Title (string), Content (rich text), Images (array of images)
   - Purpose: Manage content for the brand manifesto page.

7. **Newsletter/Drop Alerts**
   - Fields: Title (string), Description (text), Signup Form Text (string), Alert Message (string), Active (boolean)
   - Purpose: Manage newsletter signup forms and drop alert content.

8. **Footer Texts**
   - Fields: Copyright Text (string), Links (array of objects with label, url), Social Media Links (array of objects with platform, url)
   - Purpose: Manage editable content for the site footer.

## User and Dashboard Schemas

9. **User Data**
   - Fields: Name (string), Email (string), Role (string), Status (string), Join Date (date), Last Active (datetime), Points (number), Avatar (image), Stats (object with posts, likes, comments, level), Dashboard Data (nested objects for personality, wishlist, achievements, etc.)
   - Purpose: Manage user profiles and personalized dashboard content.

## System and Configuration Schemas

10. **System Settings**
    - Fields: General (object with platformName, tagline, defaultLanguage, timezone, maintenanceMode, publicRegistration, contentModeration), Security (object with maxLoginAttempts, lockoutDuration, requireTwoFactor, strongPasswords, activityLogging), Notifications (object with newRegistrations, newPosts, reports, communityActivity, systemUpdates, adminEmail), Integrations (object with instagram, email, googleAnalytics, stripePublicKey)
    - Purpose: Manage platform-wide settings and configurations.

## Community and Knowledge Content Schemas

11. **Community Content**
    - Fields: Posts (array of objects with author, content, timestamp, status, likes, comments, shares), Tips (array of objects with title, content, category, difficulty, author, timeAgo, likes, shares, comments, isLiked, tags, images)
    - Purpose: Manage community-generated content and interactions.

12. **Knowledge Hub Content**
    - Fields: Tutorials (array of objects with title, description, thumbnail, duration, difficulty, character, views, publishedAt, category), Material Guides (array of objects with title, materialType, description, image, sustainability, careLevel, origin, transparency), Care Instructions (array of objects with productType, material, careTime, difficulty, frequency, steps), Cultural Timeline (array of objects with year, title, description, image, category, location, isInfluential, relatedCharacters, impact)
    - Purpose: Manage educational content for the Knowledge Hub.

## Implementation Notes
- Each schema should be defined in Sanity Studio with appropriate field types (string, text, number, boolean, object, array, image, etc.) to match the data structure used in the frontend.
- Ensure all schemas have proper validation rules to maintain data integrity.
- Use references where necessary to link related content (e.g., linking products to characters).
- Set up permissions in Sanity Studio to control access levels for different admin roles.
- Document each schema with descriptions and examples to assist content editors.

This comprehensive set of schemas will ensure that every aspect of the site can be managed via the Sanity Studio admin panel, fulfilling the requirement for full editability.
