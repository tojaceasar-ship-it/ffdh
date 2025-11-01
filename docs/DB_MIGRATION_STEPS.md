# Database Migration Steps

Button-by-button instructions for Supabase Dashboard SQL Editor

## Method 1: Via Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
# Windows: choco install supabase
# Mac: brew install supabase/tap/supabase
# Linux: npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Verify
supabase db diff
```

## Method 2: Via Supabase Dashboard

### Steps

1. **Go to**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
2. **Click**: "SQL Editor" in left sidebar
3. **Click**: "New Query" button
4. **Copy** entire contents of `supabase/migrations/001_initial_schema.sql`
5. **Paste** into SQL Editor
6. **Click**: "Run" button (or Ctrl+Enter)
7. **Wait** for success message
8. **Repeat** for `002_scenes_schema_rewir.sql`
9. **Repeat** for `003_feedback_logs.sql`

### Verification

After running migrations, verify tables exist:

```sql
-- Run this in SQL Editor
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `users`
- `products`
- `orders`
- `order_items`
- `characters`
- `scenes`
- `comments`
- `webhook_logs`
- `decision_logs`

## Expected Schema Summary

### Tables

| Table | Columns | Purpose |
|-------|---------|---------|
| `users` | id, email, name, role, phone, birthdate | User profiles |
| `products` | id, name, slug, price_eur, image_url, stock | Shop products |
| `orders` | id, user_id, stripe_session_id, status, items | Order tracking |
| `scenes` | id, slug, title, narrative, emotion_tags, sanity_id | Rewir scenes |
| `comments` | id, scene_id, content, emotion, is_approved | User comments |
| `decision_logs` | id, decision_id, outcome, effectiveness_score | AI feedback |

### Functions

| Function | Purpose |
|----------|---------|
| `increment_scene_view_count(scene_slug)` | Track scene views |
| `update_scene_comment_count(scene_id)` | Update comment counts |
| `seed_initial_data()` | Seed sample data |

### Indexes

- GIN index on `emotion_tags` for fast filtering
- Index on `slug` for scene lookups
- Index on `view_count` for sorting

## Troubleshooting

### Error: "relation already exists"
- Migration already applied
- Safe to ignore

### Error: "permission denied"
- Check RLS policies
- Verify service role key permissions

### Error: "syntax error"
- Check SQL syntax
- Verify PostgreSQL version compatibility

## Verification Script

Create `scripts/db-verify.mjs`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifySchema() {
  const tables = ['users', 'products', 'orders', 'scenes', 'comments', 'decision_logs']
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.error(`❌ Table ${table}: ${error.message}`)
    } else {
      console.log(`✅ Table ${table}: OK`)
    }
  }
}

verifySchema()
```

Run: `node scripts/db-verify.mjs`

